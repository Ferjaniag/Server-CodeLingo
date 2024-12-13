const express = require("express");
const request = require("supertest");
const router = require("../Routes/EnrollementRoutes");
const Enrollment = require("../Models/Enrollement");
const Course = require("../Models/Course");
// Mock Mongoose method
Course.findById = jest.fn();
// Mock the models
jest.mock("../Models/Enrollement");

describe("GET /enrollments/:userId", () => {
  beforeAll(() => {
    app = express();

    app.use(express.json());
    app.use("/", router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return courses data for a valid user", async () => {
    // Mock data for enrollments
    const mockEnrollments = [
      { _id: "enrollment1", idCourse: "course1", overallProgress: 0.5 },
      { _id: "enrollment2", idCourse: "course2", overallProgress: 0.7 },
    ];

    const mockCourses = {
      course1: { _id: "course1", title: "Course 1" },
      course2: { _id: "course2", title: "Course 2" },
    };

    // Mock database responses
    Enrollment.find.mockResolvedValue(mockEnrollments);
    Course.findById.mockImplementation((id) => mockCourses[id] || null);

    // Send GET request
    const response = await request(app).get("/enrollments/user1");

    // Assert response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        idEnrollment: "enrollment1",
        idCourse: "course1",
        overalProgress: 0.5,
        courseName: "Course 1",
      },
      {
        idEnrollment: "enrollment2",
        idCourse: "course2",
        overalProgress: 0.7,
        courseName: "Course 2",
      },
    ]);
  });

  /*
  it("should return 404 if no enrollments are found", async () => {
    const mockReq = { params: { userId: "user2" } };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    Enrollment.find.mockResolvedValue([]); // No enrollments found

    const response = await request(app).get("/courses/user2");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "No enrollments found for this user.",
    });
  });

  */
});
