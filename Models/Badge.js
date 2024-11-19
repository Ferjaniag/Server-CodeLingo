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
dateAwarded:{
  type: Date,
  default: Date.now,
}

});

module.exports = mongoose.model("Badge", BadgeSchema);
