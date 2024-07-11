import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import "./setup.js";

describe("Application Process", () => {
  let applicant, job;

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    // Create an applicant
    const applicantRes = await request(app).post("/signup").send({
      userType: "applicant",
      email: "applicant@example.com",
      password: "password123",
      fullName: "Jane Applicant",
      companyName: "",
    });
    applicant = applicantRes.body.userId;

    // Create a job
    const jobRes = await request(app).post("/jobs/add").send({
      title: "Software Engineer",
      description: "Develop and maintain software applications.",
      company: "Tech Corp",
      location: "New York, NY",
      salary: "120000",
    });
    job = jobRes.body.insertedId;
  });

  it("should allow an applicant to apply for a job", async () => {
    const applicationData = {
      applicantID: applicant,
      jobID: job,
      resumeData: "Base64EncodedResumeData",
      applyDate: new Date().toISOString(),
    };

    const res = await request(app)
      .post("/applications/add")
      .send(applicationData);

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("message", "Application added!");

    const application = await mongoose.connection.db
      .collection("applications")
      .findOne({ applicantID: applicant, jobID: job });
    expect(application).to.not.be.null;
    expect(application).to.have.property("applicantID", applicant);
    expect(application).to.have.property("jobID", job);
    expect(application).to.have.property(
      "resumeData",
      "Base64EncodedResumeData",
    );

    // Check for default status
    expect(application).to.have.property("status", "Pending Review");
  });

  it("should allow a recruiter to update the application status", async () => {
    const applicationData = {
      applicantID: applicant,
      jobID: job,
      resumeData: "Base64EncodedResumeData",
      applyDate: new Date().toISOString(),
    };

    await request(app).post("/applications/add").send(applicationData);

    // Update the application status
    const updateRes = await request(app)
      .put(`/applications/${applicant}/${job}/status`)
      .send({ status: "reviewed" });

    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("message", "Application status updated");
    expect(updateRes.body).to.have.property("status", "reviewed");

    const updatedApplication = await mongoose.connection.db
      .collection("applications")
      .findOne({ applicantID: applicant, jobID: job });
    expect(updatedApplication).to.not.be.null;
    expect(updatedApplication).to.have.property("status", "reviewed");
  });
});
