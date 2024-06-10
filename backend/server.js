import express from 'express';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
const PORT = 4000;
const mongoURL = "mongodb://localhost:27017";
const dbName = "pursuiter";

app.use(express.json());
app.use(cors());

let db;

async function connectToMongo() {
  const client = new MongoClient(mongoURL);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; 
  }
}

// Ensure MongoDB is connected before handling requests
app.use(async (req, res, next) => {
  if (!db) {
    try {
      db = await connectToMongo();
    } catch (error) {
      return res.status(500).json({ message: "Error connecting to the database" });
    }
  }
  next();
});

app.get('/jobs', async (req, res) => {
  try {
    const jobs = await db.collection('jobs').find().toArray();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.post('/jobs/add', async (req, res) => {
  const jobs = req.body;

  if (!Array.isArray(jobs)) {
    return res.status(400).json({ message: "Expected an array of jobs" });
  }

  try {
    await db.collection('jobs').insertMany(jobs);
    res.status(201).json({ message: "Jobs added!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding jobs" });
  }
});

app.post('/signup', async (req, res) => {
  const { userType, email, password, fullName, companyName, address, positions } = req.body;
  try {
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      userType,
      email,
      password: hashedPassword,
      fullName,
      companyName,
      address,
      positions,
    };

    const result = await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: "User created", userId: result.insertedId });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.collection('users').findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({
        message: "Login successful",
        userType: user.userType,
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        address: user.address,
        positions: user.positions,
        userId: user._id
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Update the user fullName, email, address, positions
app.put("/updateUser", async (req, res) => {
  const { email, newEmail, fullName, address, positions } = req.body;
  try {
    const user = await db.collection('users').findOne({ email });
    if (user) {
      const updatedUser = { ...user };
      if (newEmail) {
        const emailUsed = await db.collection('users').findOne({ email: newEmail });
        if (emailUsed && newEmail !== email) {
          return res.status(400).json({ message: "New email already used by another account" });
        } else {
          updatedUser.email = newEmail;
        }
      }

      if (fullName) updatedUser.fullName = fullName;
      if (address) updatedUser.address = address;
      if (positions) updatedUser.positions = positions;

      await db.collection('users').updateOne(
        { email }, 
        { $set: updatedUser } 
      );

      res.json({
        message: "Update successful",
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        address: updatedUser.address,
        positions: updatedUser.positions,
      });      
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
});

async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();

export default app
