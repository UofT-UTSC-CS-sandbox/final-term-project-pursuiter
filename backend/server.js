import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const PORT = 4000;
const mongoURL = "mongodb+srv://mohammadqassim000:xVTcVQ2a7IA3HL0C@cluster0.1teyexn.mongodb.net/pursuiter?retryWrites=true&w=majority";
const dbName = "pursuiter";

app.use(express.json());
app.use(cors());

// Connect to MongoDB
let db;

async function connectToMongo() {
  const client = new MongoClient(mongoURL);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongo();

// Routes for jobs
app.get('/jobs', async (req, res) => {
  try {
    const jobs = await db.collection('jobs').find().toArray();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.post('/jobs/add', async (req, res) => {
  const { title, company, location, type, applyBy, hiddenKeywords, description, qualifications } = req.body;

  const newJob = {
    title,
    company,
    location,
    type,
    applyBy,
    hiddenKeywords,
    description,
    qualifications
  };

  try {
    await db.collection('jobs').insertOne(newJob);
    res.status(201).json({ message: "Job added!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding job" });
  }
});

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
