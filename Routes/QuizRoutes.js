const quizController = require("../Controllers/QuizController");
const Router = require("express");
const router = Router();


router.post("/addQuiz", quizController.add_quiz);
router.get("/getAllQuizzes", quizController.get_all_quizzes);
router.get("/getQuiz/:quizID", quizController.get_one_quiz);

router.get("/get_quiz/:courseID", quizController.getQuizByCourseId);
router.delete("/delete_quiz/:quizID", quizController.delete_Quiz);
router.patch("/update_quiz/:quizID", quizController.update_quiz);

module.exports = router;


