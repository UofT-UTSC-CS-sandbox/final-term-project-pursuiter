import express from 'express';
import { MongoClient, ObjectId } from 'mongodb'; // Ensure ObjectId is imported
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
  const { userType, email, password, fullName, companyName } = req.body;
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
      companyName
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
        userId: user._id
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

app.get('/jobs/:id/applicants', async (req, res) => {
  const jobId = req.params.id;

  try {
    const applications = await db.collection('applications').find({ jobId: new ObjectId(jobId) }).toArray();
    const userIds = applications.map(app => app.userId);
    const applicants = await db.collection('users').find({ _id: { $in: userIds } }).toArray();
    res.json(applicants);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ message: "Error fetching applicants" });
  }
});

app.get('/jobs/:id', async (req, res) => {
  const jobId = req.params.id;

  try {
      const job = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
      if (job) {
          res.json(job);
      } else {
          res.status(404).json({ message: "Job not found" });
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching job details" });
  }
});

app.get('/applications/:jobId', async (req, res) => {
  const jobId = req.params.jobId;
  try {
      const applications = await db.collection('applications').find({ jobID: jobId }).toArray();
      if (applications.length === 0) {
          return res.status(404).json({ message: "No applications found for this job" });
      }
      const applicantIds = applications.map(app => app.applicantID);
      const applicants = await db.collection('users').find({ _id: { $in: applicantIds.map(id => new ObjectId(id)) } }).toArray();
      res.json(applicants);
  } catch (error) {
      console.error('Error fetching applicants:', error); // Log the error
      res.status(500).json({ message: "Error fetching applicants", error: error.message });
  }
});

async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
