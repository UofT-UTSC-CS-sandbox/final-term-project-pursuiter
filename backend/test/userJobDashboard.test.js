import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import "./setup.js";

describe("Applications Management", () => {
  let user, job1, job2, job3, application1, application2;

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    const userResponse = await request(app).post("/signup").send({
      userType: "applicant",
      email: "applicant@example.com",
      password: "password123",
      fullName: "John Applicant",
      companyName: "Applicant Corp",
    });
    user = userResponse.body;

    job1 = await mongoose.connection.db.collection("jobs").insertOne({
      title: "Sample Job 1",
      company: "Sample Company 1",
      location: "Location 1",
      type: "Full-time",
      applyBy: "2024-07-14",
      hiddenKeywords: "keyword1, keyword2",
      description: "Sample job description 1",
      qualifications: "Sample qualifications 1",
      recruiterID: "recruiter1"
    });

    job2 = await mongoose.connection.db.collection("jobs").insertOne({
      title: "Sample Job 2",
      company: "Sample Company 2",
      location: "Location 2",
      type: "Part-time",
      applyBy: "2024-08-13",
      hiddenKeywords: "keyword3, keyword4",
      description: "Sample job description 2",
      qualifications: "Sample qualifications 2",
      recruiterID: "recruiter2"
    });

    job3 = await mongoose.connection.db.collection("jobs").insertOne({
      title: "Sample Job 3",
      company: "Sample Company 3",
      location: "Location 3",
      type: "Internship",
      applyBy: "2024-09-14",
      hiddenKeywords: "keyword5, keyword6",
      description: "Sample job description 3",
      qualifications: "Sample qualifications 3",
      recruiterID: "recruiter3"
    });

    application1 = await mongoose.connection.db.collection("applications").insertOne({
      applicantID: user.userId,
      jobID: job1.insertedId.toString(),
      appliedDate: "2024-06-14",
      resumeData: "data:application/pdf;base64,samplebase64data"
    });

    application2 = await mongoose.connection.db.collection("applications").insertOne({
      applicantID: user.userId,
      jobID: job2.insertedId.toString(),
      resumeData: null
    });
  });

  it("should fetch all applications for a user", async () => {
    const res = await request(app).get(`/applications/user/${user.userId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.equal(2);
    expect(res.body[0]).to.have.property("applicantID", user.userId);
    expect(res.body[0]).to.have.property("jobID", job1.insertedId.toString());
    expect(res.body[0]).to.have.property("appliedDate", "2024-06-14");
    expect(res.body[0]).to.have.property("resumeData", "data:application/pdf;base64,samplebase64data");
    expect(res.body[1]).to.have.property("applicantID", user.userId);
    expect(res.body[1]).to.have.property("jobID", job2.insertedId.toString());
  });

  it("should return 404 if no applications found for the user", async () => {
    await mongoose.connection.db.collection("applications").deleteMany({});

    const res = await request(app).get(`/applications/user/${user.userId}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property("message", "No applications found for this user");
  });

  it("should fetch jobs excluding those the user has applied for", async () => {
    const jobsResponse = await request(app).get("/jobs");
    expect(jobsResponse.status).to.equal(200);
    const jobs = jobsResponse.body;

    const userJobsResponse = await request(app).get(`/applications/user/${user.userId}`);
    expect(userJobsResponse.status).to.equal(200);
    const appliedJobIds = new Set(userJobsResponse.body.map(app => app.jobID));

    const availableJobs = jobs.filter(job => !appliedJobIds.has(job._id.toString()));
    
    expect(availableJobs.length).to.equal(1);
    expect(availableJobs[0]).to.have.property("_id", job3.insertedId.toString());
  });
});
