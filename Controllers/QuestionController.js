const Question = require("../Models/Questions");
const Quiz = require("../Models/Quiz");

module.exports = {
  addQuestion: async (req, res, next) => {
    try {
      const { quizId, content, options, correctOption } = req.body;

      if (
        !req.body.quizId ||
        !req.body.content ||
        !req.body.options ||
        !req.body.correctOption
      ) {
        return next(e.errorHandler(400, "Please provide all required fields"));
      }

      if (!options.includes(correctOption)) {
        return next(
          e.errorHandler(
            400,
            "The correct option must be one of the provided options"
          )
        );
      }

      const newQuestion = new Question({
        quizId,
        content,
        options,
        correctOption,
      });
      await newQuestion.save();

      res.status(200).json(newQuestion);
    } catch (error) {
      next(error);
    }
  },

  getAllQuestions: async (req, res, next) => {
    const { quizId } = req.params;
    try {
      // Check if the quiz exists
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const questions = await Question.find({ quizId });

      res.status(200).json(questions);
    } catch (error) {
      next(error);
    }
  },

  getOneQuestion: async (req, res, next) => {
    try {
      const { questionId } = req.params;
      const question = await Question.findById(questionId);
      if (!question) {
        return next(e.errorHandler(404, "Question not found"));
      }
      res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  },
  updatequestion: async (req, res, next) => {
    // if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    //     return next(e.errorHandler(403, 'You are not allowed to update this question'));
    //     }
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.questionId,
        {
          $set: {
            content: req.body.content,
            options: req.body.options,
            correctOption: req.body.correctOption,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedQuestion);
    } catch (error) {
      next(error);
    }
  },
  deletequestion: async (req, res, next) => {
    // if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    //     return next(e.errorHandler(403, 'You are not allowed to delete this question'));
    //     }
    try {
      await Question.findByIdAndDelete(req.params.questionId);
      res.status(200).json("The question has been deleted");
    } catch (error) {
      next(error);
    }
  },
};
