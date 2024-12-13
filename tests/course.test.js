const express = require("express");
const request = require("supertest");
const router = require("../Routes/CourseRoutes");
const Course = require("../Models/Course");

jest.mock("../Models/Course");

describe("GET /get_courses_by_category/:category", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 200 and a list of courses for a valid category", async () => {
    const mockCourses = [
      { id: 1, name: "JavaScript Basics", category: "FrontEnd Development" },
      { id: 2, name: "Python for Beginners", category: "FrontEnd Development" },
    ];

    // Mock the Course.find method
    Course.find.mockResolvedValue(mockCourses);

    const response = await request(app).get(
      "/get_courses_by_category/FrontEnd Development"
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCourses);
    expect(Course.find).toHaveBeenCalledWith({
      category: "FrontEnd Development",
    });
  });

  test("should return 500 and an error message when an error occurs", async () => {
    const errorMessage = "Database error";

    Course.find.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get(
      "/get_courses_by_category/FrontEnd Development"
    );

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
    expect(Course.find).toHaveBeenCalledWith({
      category: "FrontEnd Development",
    });
  });
});
