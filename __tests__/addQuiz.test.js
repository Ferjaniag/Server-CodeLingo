const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Course = require("../Models/Course");
const Quiz = require("../Models/Quiz");
const { add_quiz, get_one_quiz } = require("../Controllers/QuizController");

let mongoServer;

beforeAll(async () => {
  // Start an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoURI = mongoServer.getUri();

  // Connect to the in-memory MongoDB server
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  // Close the mongoose connection and stop the in-memory server
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Add Quiz Functionality", () => {
  it("should add a quiz and associate it with a course", async () => {
    // Create a dummy course for testing the quiz addition
    const course = new Course({
      title: "Test Course",
      description: "This is a test course",
      category: "FrontEnd Development",
    });

    await course.save();

    const quizData = {
      quizName: "Test Quiz",
      quizDuration: 60,
      totalMarks: 100,
      passingMarks: 50,
      idCourse: course._id,
    };

    // Simulate the request to add a quiz
    const req = {
      body: quizData,
    };

    const res = {
      status: (statusCode) => {
        return {
          send: (response) => {
            // Assertions to verify the response
            expect(statusCode).toBe(200);
            expect(response).toHaveProperty("_id");
            expect(response.quizName).toBe("Test Quiz");
            expect(response.quizDuration).toBe(60);
            expect(response.totalMarks).toBe(100);
            expect(response.passingMarks).toBe(50);
            expect(response.idCourse.toString()).toBe(course._id.toString());
          },
        };
      },
    };

    // Call the add_quiz function
    await add_quiz(req, res);

    // Verify that the quiz was added to the database
    const quizInDb = await Quiz.findOne({ quizName: "Test Quiz" });
    expect(quizInDb).not.toBeNull();
    expect(quizInDb.quizName).toBe("Test Quiz");
    expect(quizInDb.idCourse.toString()).toBe(course._id.toString());

    // Verify that the quiz was added to the course
    const updatedCourse = await Course.findById(course._id);
    expect(updatedCourse.quiz).toEqual([quizInDb._id]);
  });

  it("should return 404 if the course is not found", async () => {
    const req = {
      body: {
        quizName: "Test Quiz",
        quizDuration: 60,
        totalMarks: 100,
        passingMarks: 50,
        idCourse: new mongoose.Types.ObjectId(), // Non-existent course
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await add_quiz(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ message: "course not found" })
    );
  });
});
