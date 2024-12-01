const Enrollment = require("../Models/Enrollement");
const Course = require("../Models/Course");

async function createEnrollment(req, res) {
  try {
    const { idUser, idCourse, units } = req.body;
    const progress = units.map((unit) => ({
      unitId: unit._id,
      unitCompleted: false,
      lessons: unit.lessons.map((lessonId) => ({
        lessonId: lessonId,
        completed: false,
        percentage: 0,
        lastAccessed: new Date(),
      })),
    }));

    // Log the incoming data
    //  console.log('Received data:', { idUser, idCourse });

    // Check if the enrollment already exists
    const existingEnrollment = await Enrollment.findOne({ idUser, idCourse });

    if (existingEnrollment) {
      return res
        .status(400)
        .send({ message: "You have already enrolled in this course" });
    }

    // Create a new enrollment if it does not exist
    const enrollment = new Enrollment({ idUser, idCourse, progress });
    const savedEnrollment = await enrollment.save();

    res
      .status(201)
      .json({ message: "Successfully enrolled!", enrollment: savedEnrollment });
  } catch (err) {
    // Log the error
    console.error("Error creating new enrollment:", err);
    res.status(400).json({ message: err.message });
  }
}

async function handleProgressEnrollement(req, res) {
  const { userId, courseId, unitId, lessonId, percentage } = req.body;

  try {
    // Find the user's enrollment for the course
    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (enrollment) {
      // Find the specific unit progress
      const unitProgress = enrollment.progress.find(
        (p) => p.unitId.toString() === unitId
      );

      if (unitProgress) {
        // Find the specific lesson progress within the unit
        const lessonProgress = unitProgress.lessons.find(
          (l) => l.lessonId.toString() === lessonId
        );

        if (lessonProgress) {
          // Update the progress for the lesson
          lessonProgress.percentage = percentage;
          lessonProgress.completed = percentage === 100;
          lessonProgress.lastAccessed = new Date();
        } else {
          // If the lesson progress doesn't exist, add it
          unitProgress.lessons.push({
            lessonId,
            percentage,
            completed: percentage === 100,
            lastAccessed: new Date(),
          });
        }

        // Check if all lessons in the unit are completed
        const allLessonsCompleted = unitProgress.lessons.every(
          (l) => l.completed === true
        );
        unitProgress.unitCompleted = allLessonsCompleted;

        await enrollment.save();
        res
          .status(200)
          .json({ message: "Progress updated successfully", enrollment });
      } else {
        // If the unit progress doesn't exist, add it with the lesson
        enrollment.progress.push({
          unitId,
          lessons: [
            {
              lessonId,
              percentage,
              completed: percentage === 100,
              lastAccessed: new Date(),
            },
          ],
          unitCompleted: percentage === 100, // Only mark unit completed if lesson is 100%
        });

        await enrollment.save();
        res
          .status(200)
          .json({ message: "Progress updated successfully", enrollment });
      }
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
}

async function getCoursesByUserId(req, res) {
  try {
    const userId = req.params.userId;
    console.log(`Fetching enrollments for user: ${userId}`);
    const enrollments = await Enrollment.find({ idUser: userId });

    console.log("Enrollments:", enrollments);

    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrollments found for this user." });
    }

    const coursesData = [];

    for (const enrollment of enrollments) {
      console.log(`Fetching course for idCourse: ${enrollment.idCourse}`);
      const course = await Course.findById(enrollment.idCourse);
      if (course) {
        coursesData.push({
          idEnrollment: enrollment._id,
          idCourse: course._id,
          overalProgress: enrollment.overallProgress,
          courseName: course.title,
        });
      } else {
        console.log(`Course not found for idCourse: ${enrollment.idCourse}`);
      }
    }

    console.log("Courses Data:", coursesData);

    res.json(coursesData);
  } catch (err) {
    console.error("Error fetching courses by user ID:", err);
    res.status(500).json({ message: err.message });
  }
}

async function deleteEnrollment(req, res) {
  try {
    const enrollmentId = req.params.enrollmentId;
    await Enrollment.findByIdAndDelete(enrollmentId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getEnrollmentsByUserId(req, res) {
  try {
    const userId = req.params.userId;
    const enrollments = await Enrollment.find({ idUser: userId });
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getEnrollmentById(req, res) {
  try {
    const enrollmentId = req.params.idE;
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const course = await Course.findById(enrollment.idCourse);
    const enrollmentData = {
      idEnrollment: enrollment._id,
      progress: enrollment.progress,
      idUser: enrollment.idUser,
      idCourse: course ? course._id : null,
      courseName: course ? course.title : "N/A",
    };

    res.json(enrollmentData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getEnrollmentByIdCourse(req, res) {
  try {
    const { courseId, userId } = req.params; // Extract parameters from the query string
    console.log("Data received via query:", req.params);
    const enrollment = await Enrollment.findOne({
      idCourse: courseId,
      idUser: userId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    //   res.json(enrollmentData);
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const updateUnitAndCourseProgress = async (enrollment) => {
  let totalPercentage = 0;
  let totalUnits = enrollment.progress.length;

  // Iterate through units to calculate unit completion and track course progress
  enrollment.progress.forEach((unit) => {
    const totalLessons = unit.lessons.length;
    const completedLessons = unit.lessons.filter((l) => l.completed).length;

    // Mark unit as completed if all lessons are completed
    unit.unitCompleted = completedLessons === totalLessons;

    // Calculate unit's percentage (average of lesson percentages)
    const unitPercentage =
      unit.lessons.reduce((acc, lesson) => acc + lesson.percentage, 0) /
      totalLessons;

    unit.percentage = unitPercentage;
    totalPercentage += unitPercentage;
  });

  // Update overall course progress as the average progress across all units
  enrollment.overallProgress = totalPercentage / totalUnits;

  // Save the enrollment document
  await enrollment.save();
};

const updateLessonProgress = async (req, res) => {
  try {
    const { userId, courseId, unitId, lessonId, percentage } = req.body;

    const enrollment = await Enrollment.findOne({
      idUser: userId,
      idCourse: courseId,
    });
    if (!enrollment)
      return res.status(404).json({ message: "Enrollment not found" });

    // Find the relevant unit and lesson
    const unit = enrollment.progress.find((u) => u.unitId.equals(unitId));
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    const lesson = unit.lessons.find((l) => l.lessonId.equals(lessonId));
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Update lesson progress
    lesson.percentage = percentage;
    lesson.lastAccessed = new Date();
    lesson.completed = percentage >= 100;

    // Save the document
    await enrollment.save();

    // Update unit and course progress
    await updateUnitAndCourseProgress(enrollment);

    res.json({ message: "Lesson progress updated", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Error updating lesson progress", error });
  }
};

module.exports = {
  getEnrollmentsByUserId,
  deleteEnrollment,
  createEnrollment,
  getCoursesByUserId,
  getEnrollmentById,
  handleProgressEnrollement,
  updateLessonProgress,
  getEnrollmentByIdCourse,
};
