const express = require("express");
const request = require("supertest");
const router = require("../Routes/LessonRoutes");
const Lesson = require("../Models/Lesson"); // Assuming Lesson is the model

// Mock the Lesson model
jest.mock("../Models/Lesson");

describe("GET /get_lessons/:unitID", () => {
  beforeAll(() => {
    app = express();

    app.use(express.json());
    app.use("/", router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return lessons data for a valid unitID", async () => {
    // Mock data for lessons
    const mockLessons = [
      { _id: "lesson1", title: "Lesson 1", idUnit: "unit1" },
      { _id: "lesson2", title: "Lesson 2", idUnit: "unit1" },
    ];

    // Mock database response
    Lesson.find.mockResolvedValue(mockLessons);

    // Send GET request
    const response = await request(app).get("/get_lessons/unit1");

    // Assert response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockLessons);
  });

  it("should return an empty array if no lessons are found for the unitID", async () => {
    // Mock an empty response
    Lesson.find.mockResolvedValue([]);

    // Send GET request
    const response = await request(app).get("/get_lessons/unit2");

    // Assert response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    // Mock a database error
    Lesson.find.mockRejectedValue(new Error("Database error"));

    // Send GET request
    const response = await request(app).get("/get_lessons/unit1");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error") ;
 
  
  });
});
