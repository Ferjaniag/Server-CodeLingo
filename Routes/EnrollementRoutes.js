const EnrollementController=require('../Controllers/EnrollementController') ;

const Router = require("express");
const router = Router();


router.post('/enrollment_student', EnrollementController.createEnrollment);
// Get Courses where a Student Enrolled In
router.get('/enrollments/:userId/courses', EnrollementController.getCoursesByUserId);
router.delete('/enrollment/:enrollmentId', EnrollementController.deleteEnrollment) ;
// Get Enrollment by User ID
//router.get('/enrollments/:userId', EnrollementController.getEnrollmentsByUserId);

router.get('/enrollment/:idE', EnrollementController.getEnrollmentById);


module.exports = router;