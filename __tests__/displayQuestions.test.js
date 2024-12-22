const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Course = require("../Models/Course");
const Quiz = require("../Models/Quiz");
const Question = require("../Models/Questions"); // Assuming you have a Question model
const { getAllQuestions } = require("../Controllers/QuestionController");

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

describe("Get All Questions for a Quiz", () => {
  it("should retrieve all questions for a given quiz", async () => {
    // Create a course
    const course = new Course({
      title: "Test Course",
      description: "This is a test course",
      category: "FrontEnd Development",
    });
    await course.save();

    // Create a quiz associated with the course
    const quizData = {
      quizName: "Test Quiz",
      quizDuration: 60,
      totalMarks: 100,
      passingMarks: 50,
      idCourse: course._id,
    };
    const quiz = new Quiz(quizData);
    await quiz.save();

    // Create some questions associated with the quiz
    const question1 = new Question({
      content: "What is React?",
      options: ["Library", "Framework", "Language"],
      correctOption: "Library",
      quizId: quiz._id,
    });
    const question2 = new Question({
      content: "What is JSX?",
      options: ["JavaScript", "HTML", "XML"],
      correctOption: "JavaScript",
      quizId: quiz._id,
    });

    await question1.save();
    await question2.save();

    // Prepare the request and response mocks
    const req = { params: { quizId: quiz._id.toString() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the getAllQuestions controller
    await getAllQuestions(req, res);

    // Check if the response status is 200 and if questions are returned
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          content: "What is React?",
          options: ["Library", "Framework", "Language"],
          correctOption: "Library",
        }),
        expect.objectContaining({
          content: "What is JSX?",
          options: ["JavaScript", "HTML", "XML"],
          correctOption: "JavaScript",
        }),
      ])
    );
  });

  it("should return an empty array if no questions exist for the quiz", async () => {
    // Create a course and a quiz, but no questions
    const course = new Course({
      title: "Test Course",
      description: "This is a test course",
      category: "FrontEnd Development",
    });
    await course.save();

    const quizData = {
      quizName: "Test Quiz with No Questions",
      quizDuration: 60,
      totalMarks: 100,
      passingMarks: 50,
      idCourse: course._id,
      questions: [],
    };
    const quiz = new Quiz(quizData);
    await quiz.save();

    // Prepare the request and response mocks
    const req = { params: { quizId: quiz._id.toString() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the getAllQuestions controller
    await getAllQuestions(req, res);

    // Check if the response status is 200 and if an empty array is returned
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("should return 404 if the quiz is not found", async () => {
    // Prepare the request with a non-existent quiz ID
    const nonExistentQuizId = new mongoose.Types.ObjectId(); // Non-existent quiz ID
    const req = { params: { quizId: nonExistentQuizId.toString() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the getAllQuestions controller
    await getAllQuestions(req, res);

    // Check if the response status is 404 and the error message is correct
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Quiz not found" });
  });
});
