const express = require("express");
const request = require("supertest");
const router = require("../Routes/EnrollementRoutes");
const Enrollment = require("../Models/Enrollement");

jest.mock("../Models/Enrollement");

describe("PUT /enrollement/updateLessonProgress", () => {
  beforeAll(() => {
    app = express();

    app.use(express.json());
    app.use("/", router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  /*
  test("should update lesson progress and return updated enrollment", async () => {
    const mockEnrollment = {
      idUser: "user123",
      idCourse: "course123",
      progress: [
        {
          unitId: "unit123",
          unitCompleted: false,
          percentage: 0,
          lessons: [
            {
              lessonId: "lesson123",
              completed: false,
              percentage: 0,
              lastAccessed: new Date(),
            },
          ],
        },
      ],
      overallProgress: 0,
      save: jest.fn().mockResolvedValue(true), // Mock save
    };

    Enrollment.findOne.mockResolvedValue(mockEnrollment);

    const response = await request(app)
      .put("/enrollement/updateLessonProgress")
      .send({
        userId: "user123",
        courseId: "course123",
        unitId: "unit123",
        lessonId: "lesson123",
        percentage: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Lesson progress updated");
    expect(mockEnrollment.save).toHaveBeenCalledTimes(2);
    expect(mockEnrollment.progress[0].lessons[0].percentage).toBe(100);
    expect(mockEnrollment.progress[0].lessons[0].completed).toBe(true);
  });
*/
  test("should return 404 if enrollment not found", async () => {
    Enrollment.findOne.mockResolvedValue(null);

    const response = await request(app)
      .put("/enrollement/updateLessonProgress")
      .send({
        userId: "user123",
        courseId: "course123",
        unitId: "unit123",
        lessonId: "lesson123",
        percentage: 100,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Enrollment not found");
  });

  test("should return 404 if unit not found", async () => {
    const mockEnrollment = {
      idUser: "user123",
      idCourse: "course123",
      progress: [],
      save: jest.fn(),
    };

    Enrollment.findOne.mockResolvedValue(mockEnrollment);

    const response = await request(app)
      .put("/enrollement/updateLessonProgress")
      .send({
        userId: "user123",
        courseId: "course123",
        unitId: "unit123",
        lessonId: "lesson123",
        percentage: 100,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Unit not found");
  });
});
