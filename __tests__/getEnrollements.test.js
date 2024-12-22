const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const router = require("../Routes/EnrollementRoutes");
const Enrollment = require("../Models/Enrollement");
const Course = require("../Models/Course");

let mongoServer; // To hold the in-memory MongoDB instance
let app;

describe("GET /enrollments/:userId", () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the in-memory MongoDB
    await mongoose.connect(uri);

    // Initialize Express app
    app = express();
    app.use(express.json());
    app.use("/", router);
  });

  afterAll(async () => {
    // Close the mongoose connection and stop the in-memory server
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should return courses data for a valid user", async () => {
    // Insert mock data into the in-memory database
    const mockCourse1 = await Course.create({
      _id: new mongoose.Types.ObjectId(), // Use ObjectId
      title: "Course 1",
      category: "Programming", // Add required field
      description: "Learn the basics of programming.", // Add required field
    });

    const mockCourse2 = await Course.create({
      _id: new mongoose.Types.ObjectId(),
      title: "Course 2",
      category: "Web Development",
      description: "Build modern web applications.",
    });

    let userid = new mongoose.Types.ObjectId();
    const mockEnrollments = await Enrollment.insertMany([
      {
        _id: new mongoose.Types.ObjectId(),
        idCourse: mockCourse1._id,
        overallProgress: 0.5,
        idUser: userid,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        idCourse: mockCourse2._id,
        overallProgress: 0.7,
        idUser: userid,
      },
    ]);

    // Send GET request
    const response = await request(app).get(`/enrollments/${userid}`);

    // Assert response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        idEnrollment: mockEnrollments[0]._id.toString(),
        idCourse: mockCourse1._id.toString(),
        overalProgress: 0.5,
        courseName: mockCourse1.title,
      },
      {
        idEnrollment: mockEnrollments[1]._id.toString(),
        idCourse: mockCourse2._id.toString(),
        overalProgress: 0.7,
        courseName: mockCourse2.title,
      },
    ]);
  });
});
