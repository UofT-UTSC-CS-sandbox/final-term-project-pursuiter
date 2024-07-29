import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import "./setup.js";

describe("Job Management", () => {
  let jobId;

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    const jobRes = await request(app).post("/jobs/add").send({
      title: "Software Engineer",
      description: "Develop and maintain software applications.",
      company: "Tech Corp",
      location: "New York, NY",
    });
    jobId = jobRes.body.insertedId;
  });

  it("should create a new job", async () => {
    const jobData = {
      title: "Backend Developer",
      description: "Develop and maintain backend services.",
      company: "Tech Solutions",
      location: "San Francisco, CA",
    };

    const res = await request(app).post("/jobs/add").send(jobData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "Job added!");
    expect(res.body).to.have.property("insertedId");

    const job = await mongoose.connection.db
      .collection("jobs")
      .findOne({ _id: new mongoose.Types.ObjectId(res.body.insertedId) });
    expect(job).to.not.be.null;
    expect(job).to.have.property("title", jobData.title);
    expect(job).to.have.property("description", jobData.description);
    expect(job).to.have.property("company", jobData.company);
    expect(job).to.have.property("location", jobData.location);
  });

  it("should edit an existing job", async () => {
    const updatedJobData = {
      title: "Senior Software Engineer",
      description: "Develop and maintain complex software applications.",
      company: "Tech Corp",
      location: "New York, NY",
      lastEditedBy: "John Doe",
    };

    const res = await request(app).put(`/jobs/${jobId}`).send(updatedJobData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Job updated");

    const job = await mongoose.connection.db
      .collection("jobs")
      .findOne({ _id: new mongoose.Types.ObjectId(jobId) });
    expect(job).to.not.be.null;
    expect(job).to.have.property("title", updatedJobData.title);
    expect(job).to.have.property("description", updatedJobData.description);
    expect(job).to.have.property("company", updatedJobData.company);
    expect(job).to.have.property("location", updatedJobData.location);
    expect(job).to.have.property("lastEditedBy", updatedJobData.lastEditedBy);
  });

  it("should delete an existing job", async () => {
    const res = await request(app).delete(`/jobs/${jobId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message", "Job deleted!");

    const job = await mongoose.connection.db
      .collection("jobs")
      .findOne({ _id: new mongoose.Types.ObjectId(jobId) });
    expect(job).to.be.null;
  });
});
