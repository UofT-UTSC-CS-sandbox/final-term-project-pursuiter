import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import "./setup.js";

describe("AI Generated Applicant Descriptions", () => {
  let applicantId;
  let jobId;

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    // Create an applicant using signup endpoint
    const applicantRes = await request(app).post("/signup").send({
      userType: "applicant",
      email: "john.doe@example.com",
      password: "password123",
      fullName: "John Doe",
      companyName: "",
      companyAccessCode: "",
    });
    applicantId = applicantRes.body.userId;

    // Create a job
    const jobRes = await request(app).post("/jobs/add").send({
      title: "Software Engineer",
      description: "Develop and maintain software applications.",
      company: "Tech Corp",
      location: "New York, NY",
      salary: "120000",
    });
    jobId = jobRes.body.insertedId;

    // Add an application for the job
    const applicationRes = await request(app)
      .post("/applications/add")
      .send({
        jobID: jobId,
        applicantID: applicantId,
        resumeData: "base64ResumeString",
        totalScore: 8,
        qualificationsScore: {
          score: 4,
          description: "Meets most qualifications",
        },
        jobDescriptionScore: {
          score: 4,
          description: "Matches job description well",
        },
        applicantSummary: {
          longSummary:
            "This applicant is a software engineer with 5 years of experience in developing and maintaining software applications.",
          shortSummary:
            "• 5 years experience in software engineering\n• Developed and maintained software applications",
        },
      });
  });

  it("should fetch the application descriptions", async () => {
    const res = await request(app).get(
      `/applications/details/${applicantId}/${jobId}`,
    );
    expect(res.status).to.equal(200);
    expect(res.body.applicantSummary).to.have.property(
      "longSummary",
      "This applicant is a software engineer with 5 years of experience in developing and maintaining software applications.",
    );
    expect(res.body.applicantSummary).to.have.property(
      "shortSummary",
      "• 5 years experience in software engineering\n• Developed and maintained software applications",
    );
  });
});
