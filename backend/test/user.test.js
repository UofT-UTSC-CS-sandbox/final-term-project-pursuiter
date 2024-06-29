import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import "./setup.js"; // Import the common setup

describe("User Management", () => {
  let user1, user2;

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

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
      "New email already used by another account",
    );
  });

  it("should update name, address and positions", async () => {
    const res = await request(app).put("/updateUser").send({
      email: "user1@example.com",
      newEmail: "newuser1@example.com",
      fullName: "New Name",
      address: "New Address",
      positions: "New Position",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Update successful");
    expect(res.body).to.have.property("email", "newuser1@example.com");
    expect(res.body).to.have.property("fullName", "New Name");
    expect(res.body).to.have.property("address", "New Address");
    expect(res.body).to.have.property("positions", "New Position");
  });

  it("should update the master resume", async () => {
    const res = await request(app).put("/updateUser").send({
      email: "user1@example.com",
      masterResume: "resume1",
      newMasterResume: "newresume1",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Update successful");
  });
});
