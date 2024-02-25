const lesson_controllers = require("../Controllers/LessonController");
const Router = require("express");
const router = Router();

router.post("/add_lesson", lesson_controllers.add_lesson);
router.get("/get_all_lessons", lesson_controllers.get_all_lessons);
router.get("/get_lesson/:lessonID", lesson_controllers.get_one_lesson);
router.get("/get_lessons", lesson_controllers.getLessonsWithUnitsNames);

router.get('/get_lessons/:unitID',lesson_controllers.getLessonsByIdUnit);
router.delete("/delete_lesson/:lessonID", lesson_controllers.delete_Lesson);
router.patch("/update_lesson/:lessonID", lesson_controllers.update_lesson);

module.exports = router;
