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
      return res
        .status(500)
        .json({ message: "Error connecting to the database" });
    }
  }
  next();
});

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await db.collection("jobs").find().toArray();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.post('/jobs/add', async (req, res) => {
  const job = req.body;

  if (!job || typeof job !== 'object') {
    return res.status(400).json({ message: "Expected a job object" });
  }

  try {
    const result = await db.collection('jobs').insertOne(job);
    res.status(201).json({ message: "Job added!", insertedId: result.insertedId });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ message: "Error adding job", error: error.message });
  }
});

app.put('/jobs/:id', async (req, res) => {
  const jobId = req.params.id;
  const job = req.body;

  console.log('Received PUT request for job:', jobId, job); // Add logging

  if (!ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    const result = await db.collection('jobs').updateOne({ _id: new ObjectId(jobId) }, { $set: job });
    if (result.modifiedCount === 1) {
      res.json({ message: "Job updated", job: job });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
});

app.delete('/jobs/:id', async (req, res) => {
  const jobId = req.params.id;

  try {
    console.log(`Deleting job with ID: ${jobId}`);
    const result = await db.collection('jobs').deleteOne({ _id: new ObjectId(jobId) });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Job deleted!" });
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Error deleting job" });
  }
});

// Add a job to favorites
app.post('/favorites/add', async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: new ObjectId(jobId) } }
    );
    res.status(200).json({ message: "Job added to favorites" });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: "Error adding to favorites" });
  }
});

// Remove a job from favorites
app.post('/favorites/remove', async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favorites: new ObjectId(jobId) } }
    );
    res.status(200).json({ message: "Job removed from favorites" });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ message: "Error removing from favorites" });
  }
});

// Get favorite jobs
app.get('/favorites/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (user && user.favorites) {
      const favoriteJobs = await db.collection('jobs').find({ _id: { $in: user.favorites } }).toArray();
      res.status(200).json(favoriteJobs);
    } else {
      res.status(404).json({ message: "User or favorites not found" });
    }
  } catch (error) {
    console.error("Error fetching favorite jobs:", error);
    res.status(500).json({ message: "Error fetching favorite jobs" });
  }
});


app.post("/signup", async (req, res) => {
  const {
    userType,
    email,
    password,
    fullName,
    companyName,
    address,
    positions,
  } = req.body;
  try {
    const existingUser = await db.collection("users").findOne({ email });
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

    const result = await db.collection("users").insertOne(newUser);
    res
      .status(201)
      .json({ message: "User created", userId: result.insertedId });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.collection("users").findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: "Login successful",
        userType: user.userType,
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        address: user.address,
        positions: user.positions,
        userId: user._id,
        favorites: user.favorites || [],
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
  const { email, newEmail, fullName, address, positions, companyName, userType, userId } = req.body;
  try {
    const user = await db.collection("users").findOne({ email });
    if (user) {
      const updatedUser = { ...user };
      if (newEmail) {
        const emailUsed = await db
          .collection("users")
          .findOne({ email: newEmail });
        if (emailUsed && newEmail !== email) {
          return res
            .status(400)
            .json({ message: "New email already used by another account" });
        } else {
          updatedUser.email = newEmail;
        }
      }

      if (fullName) updatedUser.fullName = fullName;
      if (address) updatedUser.address = address;
      if (positions) updatedUser.positions = positions;
      if (companyName) updatedUser.companyName = companyName;
      if (userType) updatedUser.userType = userType;
      if (userId) updatedUser._id = userId;

      await db.collection("users").updateOne({ email }, { $set: updatedUser });

      res.json({
        message: "Update successful",
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        address: updatedUser.address,
        positions: updatedUser.positions,
        companyName: updatedUser.companyName,
        userType: updatedUser.userType,
        userId: updatedUser._id
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
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

      // Merge applicants with their applyDate
      const applicantsWithApplyDate = applicants.map(applicant => {
        const application = applications.find(app => app.applicantID === applicant._id.toString());
        return { ...applicant, applyDate: application ? application.applyDate : null };
      });

      res.json(applicantsWithApplyDate);
  } catch (error) {
      console.error('Error fetching applicants:', error);
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
