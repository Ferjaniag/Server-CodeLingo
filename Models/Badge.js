const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
  badgeName: {
    type: String,
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
},

});

module.exports = mongoose.model("Badge", BadgeSchema);
