import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import "./setup.js";
import sinon from "sinon";
import { OAuth2Client } from 'google-auth-library';

describe("User Authentication", () => {
  let userCredentials = {
    email: "test@example.com",
    password: "password123",
  };

  const mockIdToken = "sample-valid-google-id-token";

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    await request(app).post("/signup").send({
      userType: "recruiter",
      email: "test@example.com",
      password: "password123",
      fullName: "John Doe",
      companyName: "Tech Corp",
      companyAccessCode: "Code123",
    });

    sinon.stub(OAuth2Client.prototype, 'verifyIdToken').callsFake(async () => {
      return {
        getPayload: () => ({
          sub: "sample-google-id",
          email: "test@example.com",
          name: "John Doe",
        }),
      };
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("POST /signup", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/signup").send({
        userType: "recruiter",
        email: "newuser@example.com",
        password: "password123",
        fullName: "Jane Doe",
        companyName: "Tech Corp",
        companyAccessCode: "Code123",
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
        companyAccessCode: "Code123",
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

  describe("POST /api/auth/google-signup", () => {
    it("should create a new user with Google signup", async () => {
      sinon.restore();
      sinon.stub(OAuth2Client.prototype, 'verifyIdToken').callsFake(async () => {
        return {
          getPayload: () => ({
            sub: "new-sample-google-id",
            email: "newuser@example.com",
            name: "Jane Doe",
          }),
        };
      });

      const res = await request(app).post("/api/auth/google-signup").send({
        idToken: "new-valid-google-id-token",
        userType: "applicant",
      });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("email", "newuser@example.com");
    });

    it("should not allow Google signup with a different userType", async () => {
      const res = await request(app).post("/api/auth/google-signup").send({
        idToken: mockIdToken,
        userType: "applicant",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message").that.includes("different user type");
    });
  });

  describe("POST /api/auth/google-login", () => {
    it("should login a user with Google login", async () => {
      await request(app).post("/api/auth/google-signup").send({
        idToken: mockIdToken,
        userType: "applicant",
      });
      const res = await request(app).post("/api/auth/google-login").send({
        idToken: mockIdToken,
      });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("email", "test@example.com");
      expect(res.body).to.have.property("message", "Login successful");
    });

    it("should not login a non-existent user with Google login", async () => {
      sinon.restore();
      sinon.stub(OAuth2Client.prototype, 'verifyIdToken').callsFake(async () => {
        return {
          getPayload: () => ({
            sub: "non-existent-google-id",
            email: "nonexistent@example.com",
            name: "Non Existent",
          }),
        };
      });

      const res = await request(app).post("/api/auth/google-login").send({
        idToken: "invalid-google-id-token",
      });
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "User not found");
    });
  });

  describe("POST /verifyAccessCode", () => {
    it("should verify a valid access code", async () => {
      const res = await request(app).post("/verifyAccessCode").send({
        companyName: "Tech Corp",
        companyAccessCode: "Code123",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Access code verified");
    });

    it("should return an error for an invalid access code", async () => {
      const res = await request(app).post("/verifyAccessCode").send({
        companyName: "Tech Corp",
        companyAccessCode: "InvalidCode",
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("message", "Invalid access code for that company");
    });
  });

  describe("DELETE /user/:id", () => {
      it("should delete an existing user", async () => {
        const email = "test@example.com";
        let existingUserId;
    
        try {
          const existingUserRes = await request(app).post("/login").send({
            email: email,
            password: "password123",
          });
          existingUserId = existingUserRes.body.userId;
        } catch (err) {
          console.log("User not found or login failed:", err.message);
        }
        const res = await request(app).delete(`/user/${existingUserId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "User deleted!");
      });
    });

    it("should return 404 for a non-existent user", async () => {
      const res = await request(app).delete("/user/60d0fe4f5311236168a109ca");
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("message", "User not found");
    });
});
