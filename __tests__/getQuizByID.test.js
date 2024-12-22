const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Course = require("../Models/Course");
const Quiz = require("../Models/Quiz");
const { get_one_quiz } = require("../Controllers/QuizController");

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

describe("Get one quiz by id course", () => {
  it("should retrieve the details of a quiz by its ID", async () => {
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

    const quiz = new Quiz(quizData);
    await quiz.save();

    const req = { params: { quizID: quiz._id.toString() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await get_one_quiz(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    console.log("Actual response from res.json:", res.json.mock.calls[0][0]);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: quiz._id,
        quizName: "Test Quiz",
        quizDuration: quiz.quizDuration,
        totalMarks: quiz.totalMarks,
        passingMarks: quiz.passingMarks,
        idCourse: quiz.idCourse,
        questions: expect.arrayContaining([]),
        __v: 0,
      })
    );
  });
});
