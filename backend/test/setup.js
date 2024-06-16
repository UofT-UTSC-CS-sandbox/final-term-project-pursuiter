import mongoose from "mongoose";
import dotenv from "dotenv";

process.env.NODE_ENV = "test";
dotenv.config({ path: ".env.test" });

before(async () => {
  const dbUri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME;
  await mongoose.connect(dbUri, { dbName });
  console.log("Connected to MongoDB");
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
    console.log(`Cleared collection: ${collection.collectionName}`);
  }
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log("Disconnected from MongoDB");
});
