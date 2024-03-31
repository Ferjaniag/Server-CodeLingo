const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: [],
    },
    correctOption: {
      type: String,
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: false,
    },
    

  },
  {}
);

module.exports = mongoose.model("Question", QuestionSchema);
