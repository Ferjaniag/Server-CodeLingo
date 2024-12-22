const resultController = require("../Controllers/ResultController");
const Router = require("express");
const router = Router();

router.post("/createResult", resultController.createResult);


router.get("/getResults", resultController.getAllResults);
router.get("/getUserResults/:userId", resultController.getUserResults);
router.get("/getOneResult/:userId/:quizId", resultController.getOneResult);
router.patch("/updateResult/:userId/:quizId", resultController.updateresult);

module.exports = router;
