import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import "./setup.js"; // Import the common setup

describe("User Authentication", () => {
  let userCredentials = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    await request(app).post("/signup").send({
      userType: "recruiter",
      email: "test@example.com",
      password: "password123",
      fullName: "John Doe",
      companyName: "Tech Corp",
    });
  });

  describe("POST /signup", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/signup").send({
        userType: "recruiter",
        email: "newuser@example.com",
        password: "password123",
        fullName: "Jane Doe",
        companyName: "Tech Corp",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("message", "User created");
    });

    it("should not create a user with the same email", async () => {
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
      const res = await request(app).post("/login").send(userCredentials);

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
