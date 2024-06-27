import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import GeminiService from "../geminiService.js";
import sinon from "sinon";
import "./setup.js";

describe("Gemini Service", () => {
  let isValidApiKey = true;

  before(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  // Stub the method and restore it after each test
  describe("POST /generateResponse", () => {
    let stub;

    afterEach(() => {
      if (stub) {
        stub.restore();
      }
    });

    it("should generate a response for a valid prompt", async () => {
      if (!process.env.GEMINI_API_KEY) {
        isValidApiKey = false;
        throw new Error("GEMINI_API_KEY is not set");
      }

      const prompt = "Tell me a joke";

      const res = await request(app)
        .post("/generateResponse")
        .send({ prompt });

      if (res.status !== 200) {
        isValidApiKey = false;
      }

      // Expecting a 500 status code
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("response");
    });

    it("should return an error for an empty prompt", async () => {
      // Fail this test if the previous test failed due to an invalid API key
      if (!isValidApiKey) {
        throw new Error("Failed due to invalid API key");
      }

      const res = await request(app)
        .post("/generateResponse")
        .send({ prompt: "" });

      // Expecting a 500 status code
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message", "Prompt is required");
    });

    it("should handle errors from the GeminiService", async () => {
      const prompt = "Tell me a joke";

      // Simulate an error thrown by the service
      stub = sinon.stub(GeminiService, "generateResponse").rejects(new Error("Failed to generate response"));

      const res = await request(app)
        .post("/generateResponse")
        .send({ prompt });

      // Expecting a 500 status code
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message", "Failed to generate response");
    });
  });
});