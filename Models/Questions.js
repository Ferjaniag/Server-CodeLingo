const mongoose = require("mongoose");

const QuestionsSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
  },
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
  
    

  },
  {}
);

module.exports = mongoose.model("Questions", QuestionsSchema);
