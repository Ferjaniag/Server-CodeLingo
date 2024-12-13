const Quiz = require("../Models/Quiz");
const Course = require("../Models/Course");

exports.add_quiz = async (req, res) => {
  try {
    const { quizName, quizDuration, totalMarks, passingMarks, idCourse } =
      req.body;
    const data = { quizName, quizDuration, totalMarks, passingMarks, idCourse };
    const newQuiz = await Quiz.create(data);

    // Find the course by id
    const course = await Course.findById(idCourse);
    if (!course) {
      return res.status(404).send({ message: "course not found" });
    }

    course.quiz.push(newQuiz._id);
    await course.save();

    res.status(200).send(newQuiz);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.get_all_quizzes = async (req, res) => {
  try {
    await Quiz.find({}).then((quizzes) => {
      if (quizzes) {
        res.status(200).send(quizzes);
      } else {
        res.status(404).send("quizzes not found");
      }
    });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};

exports.delete_Quiz = async (req, res) => {
  try {
    const result = await Quiz.findByIdAndDelete({ _id: req.params.quizID });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Quiz not found" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

//! function to update a quiz

module.exports.update_quiz = async (req, res) => {
  try {
    const UpdatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.quizID,
      req.body,
      { new: true, runValidators: true }
    );
    if (!UpdatedQuiz) {
      return res.status(404).json({ message: "quiz not found" });
    }

    res.status(200).json(UpdatedQuiz);
  } catch (err) {
    res.status(400).json(err);
  }
};

//! get one quiz's details
module.exports.get_one_quiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizID);
    if (!quiz) {
      return res.status(404).json({ message: "quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (err) {
    res.status(400).json(err);
  }
};

//! get quizzes with courses ID
module.exports.getQuizByCourseId = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const quizzes = await Quiz.find({ idCourse: courseID });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes by course ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//! get quiz
