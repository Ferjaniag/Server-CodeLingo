const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  unit: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
  ],
  quiz: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      require: false,
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
