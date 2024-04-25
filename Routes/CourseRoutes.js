const course_controllers = require('../Controllers/CourseController');
const Router = require('express');
const router = Router();

router.post('/add_course', course_controllers.add_course);
router.get('/get_all_courses', course_controllers.get_all_courses);
router.get('/get_FrontEnd_courses', course_controllers.get_frontend_courses);
router.get('/get_BackEnd_courses', course_controllers.get_backend_courses);
router.get('/get_courses_by_category/:category', course_controllers.get_courses_by_category);
router.get('/get_ProgrammingLanguages_courses', course_controllers.get_programming_Languages_courses);
router.get('/get_course/:courseID', course_controllers.get_one_course);
router.delete('/delete_course/:courseID',course_controllers.delete_course);
router.patch('/update_course/:courseID',course_controllers.update_course);

module.exports = router;