import express from 'express';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

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

// Signup
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
      res.json({ message: "Login successful", userType: user.userType });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Open Port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
