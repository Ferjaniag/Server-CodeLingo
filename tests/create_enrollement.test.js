const express = require("express");
const request = require("supertest");
const router = require("../Routes/EnrollementRoutes");
const Enrollment = require("../Models/Enrollement");

jest.mock("../Models/Enrollement");

describe("POST /enrollment_student", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new enrollment and return 201", async () => {
    Enrollment.findOne.mockResolvedValue(null);
    Enrollment.prototype.save.mockResolvedValue({
      idUser: "123",
      idCourse: "456",
      progress: [],
    });

    const response = await request(app)
      .post("/enrollment_student")
      .send({ idUser: "123", idCourse: "456", units: [] });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Successfully enrolled!");
    expect(response.body.enrollment).toBeDefined();
    expect(response.body.enrollment.idUser).toBe("123");
    expect(response.body.enrollment.idCourse).toBe("456");
  });
});
