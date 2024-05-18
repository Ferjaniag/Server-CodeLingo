const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({

    quizId: {
        type: String,
        required: true,
    },
    quizName: {
        type: String,

    },
    userId: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
    },
    answers: {
        type: Array,
        default: [],
    },
    resultStatus: {
        type: String,
        required: true,
        default:'Fail'
    },


}, { timestamps: true });



module.exports = mongoose.model("Result", ResultSchema);

