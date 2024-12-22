const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Enrollment = require("../Models/Enrollement");
const router = require("../Routes/EnrollementRoutes");
const { createEnrollment } = require("../Controllers/EnrollementController");

let mongoServer;
let app;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Set up the Express app
  app = express();
  app.use(express.json());
  app.use("/", router);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("createEnrollment", () => {
  it("should create a new enrollment and return 201", async () => {
    const response = await request(app)
      .post("/enrollment_student")
      .send({
        idUser: new mongoose.Types.ObjectId(),
        idCourse: new mongoose.Types.ObjectId(),
        units: [
          {
            _id: new mongoose.Types.ObjectId(),
            lessons: [
              new mongoose.Types.ObjectId(),
              new mongoose.Types.ObjectId(),
            ],
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Successfully enrolled!");
    expect(response.body.enrollment).toBeDefined();

    const enrollment = response.body.enrollment;
    expect(enrollment.idUser).toBeDefined();
    expect(enrollment.idCourse).toBeDefined();
    expect(enrollment.progress).toHaveLength(1);
    expect(enrollment.progress[0].lessons).toHaveLength(2);

    // Verify the saved data in the database
    const savedEnrollment = await Enrollment.findOne({
      idUser: enrollment.idUser,
      idCourse: enrollment.idCourse,
    });
    expect(savedEnrollment).not.toBeNull();
    expect(savedEnrollment.progress).toHaveLength(1);
    expect(savedEnrollment.progress[0].lessons).toHaveLength(2);
  });

  it("should return an error if there is an exception", async () => {
    const req = {
      body: {
        idUser: null, // Simulate invalid data
        idCourse: "course123",
        units: [],
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };

    await createEnrollment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
});
