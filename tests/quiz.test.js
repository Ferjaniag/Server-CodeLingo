const express = require("express");
const request = require("supertest");
const router = require("../Routes/QuizRoutes"); // Import the router
const Quiz = require("../Models/Quiz"); // Mock the Quiz model

jest.mock("../Models/Quiz");

describe("GET /get_quiz/:courseID", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use("/", router); // Mount the quiz route
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should return quizzes for the given course ID", async () => {
    // Mock Quiz.find to return some quizzes
    Quiz.find.mockResolvedValue([
      { idCourse: "course1", title: "Quiz 1" },
      { idCourse: "course1", title: "Quiz 2" },
    ]);

    const response = await request(app).get("/get_quiz/course1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { idCourse: "course1", title: "Quiz 1" },
      { idCourse: "course1", title: "Quiz 2" },
    ]);
  });

  it("should return an empty array if no quizzes are found", async () => {
    // Mock Quiz.find to return an empty array
    Quiz.find.mockResolvedValue([]);

    const response = await request(app).get("/get_quiz/course2");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); // No quizzes found
  });

  it("should return an error if there's an internal server error", async () => {
    // Mock Quiz.find to simulate an error
    Quiz.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/get_quiz/course1");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error");
  });
});
