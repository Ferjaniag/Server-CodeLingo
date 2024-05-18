const Enrollment = require('../Models/Enrollement');
const Course=require('../Controllers/CourseController')

async function createEnrollment(req, res) {
    try {
        const { idUser, idCourse, progress } = req.body;
        const enrollment = new Enrollment({ idUser, idCourse, progress });
        await enrollment.save();
        res.status(201).json({message:"Successfully enrolled !", enrollment:enrollment});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


async function getCoursesByUserId(req, res) {
    try {
        const userId = req.params.userId;
        const enrollments = await Enrollment.find({ idUser: userId });
        
        const coursesData = [];

        for (const enrollment of enrollments) {
            const course = await Course.get_one_course(enrollment.courseId);
            if (course) {
                coursesData.push({
                    courseId: course._id,
                    courseName: course.title
                });
            }
        }

        res.json(coursesData);
    } catch (err) {
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

const getEnrollmentsWithCourseNames = async (req, res) => {
    try {
        // Fetch all enrollments
        const enrollments = await Enrollment.find();

        // Fetch all courses
        const courses = await Course.get_all_courses();

        // Create a map of course IDs to course titles
        const courseIdToTitleMap = {};
        courses.forEach(course => {
            courseIdToTitleMap[course._id.toString()] = course.title;
        });

        // Map enrollments to include course names
        const enrollmentsWithCourseNames = enrollments.map(enrollment => ({
            idEnrollment: enrollment._id.toString(),
            progress: enrollment.progress,
            idCourse: enrollment.courseId,
            courseTitle: enrollment.courseId ? courseIdToTitleMap[enrollment.courseId.toString()] : 'N/A'
        }));

        return res.json(enrollmentsWithCourseNames);
    } catch (error) {
        console.error("Error fetching enrollments with course names:", error);
        res.status(500).json({ error: error.message });
        throw error;
    }
}



module.exports={getEnrollmentsByUserId,deleteEnrollment,createEnrollment,getEnrollmentsWithCourseNames} ;