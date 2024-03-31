const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    quizName: {
      type: String,
      required: true,
    },
    quizDuration: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    passingMarks: {
      type: Number,
      required: true,
    },
    questions : [ {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      require:false,
  }] , 

    idCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
  },
  {}
);

module.exports = mongoose.model("Quiz", QuizSchema);
