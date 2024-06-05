import express from "express";             // express framework - Express.js framework
import { MongoClient, ObjectId } from "mongodb"; // mongodb - database interaction client
import bcrypt from "bcrypt";               // bcrypt - hashing and salting passwords
import cors from "cors";                   // CORS middleware - enabling cross-origin requests
import jwt from "jsonwebtoken";            // jsonwebtoken - creating and verifying JWTs
import multer from 'multer';               // multer - uploading files
import fs from "fs";                       // fs - interact with the local ile system
import path from "path";                   // path - work with file and directory paths

const app = express();
const PORT = 4000;
const mongoURL = "mongodb://localhost:27017";
const dbName = "pursuiter";
const dbCollections = {
	users: "users",
}

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

// Signup
app.post('/signup', async (req, res) => {
  const { userType, email, password, fullName, companyName } = req.body;
  try {
    const existingUser = await db.collection(dbCollections.users).findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      userType,
      email,
      password: hashedPassword,
      fullName,
      companyName
    };

    const result = await db.collection(dbCollections.users).insertOne(newUser);
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
      const user = await db.collection(dbCollections.users).findOne({ email });
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