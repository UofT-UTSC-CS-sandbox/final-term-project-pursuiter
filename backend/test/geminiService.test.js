import request from "supertest";
import { expect } from "chai";
import { app } from "../server.js";
import mongoose from "mongoose";
import GeminiService from "../geminiService.js";
import sinon from "sinon";
import "./setup.js";

describe("Gemini Service", () => {
  before(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe("POST /generateResponse", () => {
    let stub;

    // Stub the method and restore it after each test
    beforeEach(() => {
      stub = sinon.stub(GeminiService, "generateResponse");
    });
    afterEach(() => {
      stub.restore();
    });

    it("should generate a response for a valid prompt", async () => {
      const prompt = "Tell me a joke";
      const fakeResponse = "Why did the scarecrow win an award? Because he was outstanding in his field!";
      
      // Stub the response
      stub.resolves(fakeResponse);

      const res = await request(app)
        .post("/generateResponse")
        .send({ prompt });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("response", fakeResponse);
    });

    it("should return an error for an empty prompt", async () => {
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
      stub.rejects(new Error("Failed to generate response"));

      const res = await request(app)
        .post("/generateResponse")
        .send({ prompt });

      // Expecting a 500 status code
      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("message", "Error generating response");
    });
  });
});