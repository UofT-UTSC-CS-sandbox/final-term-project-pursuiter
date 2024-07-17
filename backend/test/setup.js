import mongoose from "mongoose";
import dotenv from "dotenv";

process.env.NODE_ENV = "test";
dotenv.config({ path: ".env.test" });

before(async () => {
  const dbUri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME;
  try {
    await mongoose.connect(dbUri, { dbName });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
});

const waitForMongoConnection = async (retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    if (mongoose.connection.readyState === 1) return;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error("Failed to establish MongoDB connection");
};

beforeEach(async () => {
  try {
    await waitForMongoConnection();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }
  } catch (error) {
    console.error("Error in beforeEach hook:", error);
  }
});

after(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
});