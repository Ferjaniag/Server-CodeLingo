const course_controllers = require('../Controllers/CourseController');
const Router = require('express');
const router = Router();

router.post('/add_course', course_controllers.add_course);
router.get('/get_all_courses', course_controllers.get_all_courses);
router.delete('/delete_course/:courseID',course_controllers.delete_course);

module.exports = router;