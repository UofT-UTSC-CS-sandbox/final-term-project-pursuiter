import request from "supertest";
import { expect } from "chai";
import app from "../server.js";
import { MongoClient } from "mongodb";

const mongoURL = "mongodb://localhost:27017";
const dbName = "pursuiter_test"; // Use a separate test database
let db;

before(async () => {
  const client = new MongoClient(mongoURL);
  await client.connect();
  db = client.db(dbName);
  await db.collection("users").deleteMany({}); // Clear the users collection before tests
});

describe("User Authentication", () => {
  describe("POST /signup", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/signup").send({
        userType: "recruiter",
        email: "test@example.com",
        password: "password123",
        fullName: "John Doe",
        companyName: "Tech Corp",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "User created");
    });

    it("should not create a user with the same email", async () => {
      await request(app).post("/signup").send({
        userType: "recruiter",
        email: "test@example.com",
        password: "password123",
        fullName: "John Doe",
        companyName: "Tech Corp",
      });

      const res = await request(app).post("/signup").send({
        userType: "recruiter",
        email: "test@example.com",
        password: "password123",
        fullName: "John Doe",
        companyName: "Tech Corp",
      });

      expect(res.status).to.equal(409);
      expect(res.body).to.have.property("message", "User already exists");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user", async () => {
      const res = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Login successful");
    });

    it("should not login with incorrect credentials", async () => {
      const res = await request(app).post("/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("message", "Invalid credentials");
    });
  });
});

describe("PUT /updateUser", () => {
  let user1, user2;

  before(async () => {
    user1 = await request(app).post("/signup").send({
      userType: "applicant",
      email: "user1@example.com",
      password: "password123",
      fullName: "John Doe",
      companyName: "Tech Corp",
    });

    user2 = await request(app).post("/signup").send({
      userType: "applicant",
      email: "user2@example.com",
      password: "password123",
      fullName: "Doe John",
      companyName: "Tech Corp",
    });
  });

  it("should not allow updating email to an email that already exists", async () => {
    const res = await request(app).put("/updateUser").send({
      email: "user1@example.com",
      newEmail: "user2@example.com",
    });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property(
      "message",
      "New email already used by another account"
    );
  });

  it("should update name, address and positions", async () => {
    const res = await request(app).put("/updateUser").send({
      email: "user1@example.com",
      newEmail: "Newuser1@example.com",
      fullName: "New name",
      address: "New address",
      positions: "New position",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Update successful");
    expect(res.body).to.have.property("email", "Newuser1@example.com");
    expect(res.body).to.have.property("fullName", "New name");
    expect(res.body).to.have.property("address", "New address");
    expect(res.body).to.have.property("positions", "New position");
  });
});

after(async () => {
  await db.collection("users").deleteMany({}); // Clean up the users collection after tests
});
