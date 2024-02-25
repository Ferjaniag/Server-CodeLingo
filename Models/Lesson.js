const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    idUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: false,
    },
  },
  {}
);

module.exports = mongoose.model("Lesson", lessonSchema);
