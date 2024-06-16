import request from "supertest";
import { expect } from "chai";
import app from "../server.js";
import mongoose from "mongoose";
import "./setup.js"; // Ensure this file sets up and tears down the database correctly

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
  describe("Recruiter Favoriting an Applicant", () => {
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
  });

  describe("Recruiter Favoriting a Job", () => {
    it("should allow a recruiter to favorite a job", async () => {
      const addToFavoritesResponse = await request(app)
        .post("/favorites/add")
        .send({
          userId: recruiter.body.userId,
          itemId: job.body.insertedId,
          type: "job",
        });

      expect(addToFavoritesResponse.status).to.equal(200);
      expect(addToFavoritesResponse.body).to.have.property(
        "message",
        "Job added to favorites",
      );

      const updatedRecruiter = await request(app).get(
        `/favorites/${recruiter.body.userId}`,
      );
      expect(updatedRecruiter.body).to.be.an("array").that.is.not.empty;
      expect(
        updatedRecruiter.body.some(
          (fav) => fav._id.toString() === job.body.insertedId,
        ),
      ).to.be.true;
    });
  });

  describe("Removing Favorites", () => {
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

    it("should allow a job seeker to remove a job from favorites", async () => {
      await request(app).post("/favorites/add").send({
        userId: jobSeeker.body.userId,
        itemId: job.body.insertedId,
        type: "job",
      });

      const res = await request(app).post("/favorites/remove").send({
        userId: jobSeeker.body.userId,
        itemId: job.body.insertedId,
        type: "job",
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property(
        "message",
        "Job removed from favorites",
      );

      const updatedJobSeeker = await request(app).get(
        `/favorites/${jobSeeker.body.userId}`,
      );
      expect(updatedJobSeeker.body).to.be.an("array").that.is.empty;
    });
  });
});
