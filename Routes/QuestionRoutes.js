const questionController = require("../Controllers/QuestionController");
const Router = require("express");
const router = Router();

router.post("/createQuestion",questionController.addQuestion);
router.get('/getQuestions/:quizId', questionController.getAllQuestions);
router.get('/getOneQuestion/:questionId',questionController.getOneQuestion);
router.delete('/deleteQuestion/:questionId',questionController.deletequestion);
router.patch('/updateQuestion/:questionId',questionController.updatequestion);




module.exports = router;
