// Create result quiz means the use successfully taked a quiz
const mongoose = require("mongoose");
const { createResult } = require("../Controllers/ResultController");
const Result = require("../Models/Result");
const badgeController = require("../Controllers/BadgeController");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Mock the badgeController.awardBadge method
jest.mock("../Controllers/BadgeController", () => ({
  awardBadge: jest.fn(),
}));

let mongoServer;

// Set up MongoMemoryServer before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clean up and close the database after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Tests for createResult function
describe("createResult", () => {
  it("should create a new result and award a badge if resultStatus is 'Success'", async () => {
    const req = {
      body: {
        quizId: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        points: 80,
        answers: ["A", "B", "C"],
        resultStatus: "Success",
        quizName: "Test Quiz",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock Result save method
    const saveMock = jest.fn().mockResolvedValue(req.body);
    Result.prototype.save = saveMock;

    // Call createResult
    await createResult(req, res);

    // Assertions
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
    expect(badgeController.awardBadge).toHaveBeenCalledWith(
      req.body.userId,
      req.body.quizId
    );
  });
});
