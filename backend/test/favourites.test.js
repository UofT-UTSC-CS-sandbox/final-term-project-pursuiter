import request from "supertest";
import { expect } from "chai";
import app from "../server.js";
import mongoose from "mongoose";
import "./setup.js";

let recruiter, jobSeeker, job, application;

beforeEach(async () => {
  // Clear the database before each test
  await mongoose.connection.db.dropDatabase();

  // Create a recruiter
  recruiter = await request(app).post("/signup").send({
    userType: "recruiter",
    email: "recruiter@example.com",
    password: "password123",
    fullName: "Recruiter 1",
    companyName: "Test Company",
    address: "toronto",
  });

  // Create a job seeker
  jobSeeker = await request(app).post("/signup").send({
    userType: "applicant",
    email: "seeker@example.com",
    password: "password123",
    fullName: "Job Seeker 1",
    companyName: "Seeker Company",
    address: "new york",
  });

  // Create a job
  job = await request(app).post("/jobs/add").send({
    title: "Software Developer",
    company: "Test Company",
    location: "toronto",
    description: "Develop software applications.",
  });

  // Job seeker applies to the job
  application = await request(app).post("/applications/add").send({
    jobId: job.body.insertedId,
    userId: jobSeeker.body.userId,
    resumeData: "sample resume data",
    applyDate: new Date().toISOString(),
  });
});

describe("Favorites Functionality", () => {
  describe("Favouriting jobs ", () => {
    it("should add a job to favorites", async () => {
      const response = await request(app)
        .post("/favorites/add")
        .send({ userId: jobSeeker.body.userId, jobId: job.body.insertedId });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Job added to favorites");

      const userResponse = await request(app).get(
        `/user/${jobSeeker.body.userId}`,
      );
      expect(userResponse.status).to.equal(200);
      expect(userResponse.body.favorites).to.include(job.body.insertedId);
    });

    it("should remove a job from favorites", async () => {
      await request(app)
        .post("/favorites/add")
        .send({ userId: jobSeeker.body.userId, jobId: job.body.insertedId });

      const response = await request(app)
        .post("/favorites/remove")
        .send({ userId: jobSeeker.body.userId, jobId: job.body.insertedId });

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal("Job removed from favorites");

      const userResponse = await request(app).get(
        `/user/${jobSeeker.body.userId}`,
      );
      expect(userResponse.status).to.equal(200);
      expect(userResponse.body.favorites).to.not.include(job.body.insertedId);
    });
  });

  describe("Favouriting applicants", () => {
    it("should allow a recruiter to favorite an applicant", async () => {
      const addToFavoritesResponse = await request(app)
        .post("/favorites/add")
        .send({
          userId: recruiter.body.userId,
          itemId: jobSeeker.body.userId,
          type: "user",
        });

      expect(addToFavoritesResponse.status).to.equal(200);
      expect(addToFavoritesResponse.body).to.have.property(
        "message",
        "Applicant added to favorites",
      );

      const updatedRecruiter = await request(app).get(
        `/favorites/${recruiter.body.userId}`,
      );

      expect(updatedRecruiter.body).to.be.an("array").that.is.not.empty;
      expect(
        updatedRecruiter.body.some(
          (fav) => fav._id.toString() === jobSeeker.body.userId,
        ),
      ).to.be.true;
    });

    it("should allow a recruiter to remove an applicant from favorites", async () => {
      await request(app).post("/favorites/add").send({
        userId: recruiter.body.userId,
        itemId: jobSeeker.body.userId,
        type: "user",
      });

      const res = await request(app).post("/favorites/remove").send({
        userId: recruiter.body.userId,
        itemId: jobSeeker.body.userId,
        type: "user",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "message",
        "Applicant removed from favorites",
      );

      const updatedRecruiter = await request(app).get(
        `/favorites/${recruiter.body.userId}`,
      );
      expect(updatedRecruiter.body).to.be.an("array").that.is.empty;
    });
  });
});
