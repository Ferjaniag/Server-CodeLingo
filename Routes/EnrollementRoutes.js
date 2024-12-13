const express = require("express");
const router = express.Router();

const EnrollementController = require("../Controllers/EnrollementController");

router.post("/enrollment_student", EnrollementController.createEnrollment);

router.get("/enrollments/:userId", EnrollementController.getCoursesByUserId);

router.delete(
  "/enrollment/:enrollmentId",
  EnrollementController.deleteEnrollment
);
// Get Enrollment by User ID
//router.get('/enrollments/:userId', EnrollementController.getEnrollmentsByUserId);

router.get("/enrollment/:idE", EnrollementController.getEnrollmentById);
router.put(
  "/enrollement/updateLessonProgress",
  EnrollementController.updateLessonProgress
);

router.get(
  "/enrollment_idc/:courseId/:userId",
  EnrollementController.getEnrollmentByIdCourse
);
module.exports = router;
