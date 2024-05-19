const Enrollment = require('../Models/Enrollement');
const Course=require('../Models/Course')

async function createEnrollment(req, res) {
    try {
        const { idUser, idCourse, progress } = req.body;

        // Log the incoming data
        console.log('Received data:', { idUser, idCourse, progress });

        // Check if the enrollment already exists
        const existingEnrollment = await Enrollment.findOne({ idUser, idCourse });

        if (existingEnrollment) {
            return res.status(400).send({ message: "You have already enrolled in this course" });
        }

        // Create a new enrollment if it does not exist
        const enrollment = new Enrollment({ idUser, idCourse, progress });
        const savedEnrollment = await enrollment.save();

        res.status(201).json({ message: "Successfully enrolled!", enrollment: savedEnrollment });
    } catch (err) {
        // Log the error
        console.error('Error creating new enrollment:', err);
        res.status(400).json({ message: err.message });
    }
}




async function getCoursesByUserId(req, res) {
    try {
        const userId = req.params.userId;
        console.log(`Fetching enrollments for user: ${userId}`);
        const enrollments = await Enrollment.find({ idUser: userId });
        
        console.log('Enrollments:', enrollments);

        if (!enrollments || enrollments.length === 0) {
            return res.status(404).json({ message: 'No enrollments found for this user.' });
        }

        const coursesData = [];

        for (const enrollment of enrollments) {
            console.log(`Fetching course for idCourse: ${enrollment.idCourse}`);
            const course = await Course.findById(enrollment.idCourse);
            if (course) {
                coursesData.push({
                    idEnrollment:enrollment._id,
                    idCourse: course._id,
                    progress:enrollment.progress.toString() ,
                    courseName: course.title,
                });
            } else {
                console.log(`Course not found for idCourse: ${enrollment.idCourse}`);
            }
        }

        console.log('Courses Data:', coursesData);

        res.json(coursesData);
    } catch (err) {
        console.error('Error fetching courses by user ID:', err);
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
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        const course = await Course.findById(enrollment.idCourse);
        const enrollmentData = {
            idEnrollment: enrollment._id,
            progress: enrollment.progress,
            idUser: enrollment.idUser,
            idCourse: course ? course._id : null,
            courseName: course ? course.title : 'N/A'
        };

        res.json(enrollmentData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}




module.exports={getEnrollmentsByUserId,deleteEnrollment,
    createEnrollment,getCoursesByUserId, getEnrollmentById} ;