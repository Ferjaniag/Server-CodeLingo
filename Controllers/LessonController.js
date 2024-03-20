const Lesson = require("../Models/Lesson");
const Unit = require("../Models/Unit");

exports.add_lesson = async (req, res) => {
  try {
    const { title, content, idUnit } = req.body;
    const data = { title, content, idUnit };
    const newLesson = await Lesson.create(data);

    // Find the unit by id
    const unit = await Unit.findById(idUnit);
    if (!unit) {
      return res.status(404).send({ message: "Unit not found" });
    }

    // Add the new lesson's id to the unit's lessons array
    unit.lessons.push(newLesson._id);
    await unit.save();

    res.status(200).send(newLesson);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.get_all_lessons = async (req, res) => {
  try {
    await Lesson.find({}).then((lessons) => {
      if (lessons) {
        res.status(200).send(lessons);
      } else {
        res.status(404).send("lessons not found");
      }
    });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};

exports.delete_Lesson = async (req, res) => {
  try {
    const result = await Lesson.findByIdAndDelete({ _id: req.params.lessonID });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Lesson not found" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

//! function to update a lesson

module.exports.update_lesson = async (req, res) => {
  try {
    const UpdatedLesson = await Lesson.findByIdAndUpdate(
      req.params.lessonID,
      req.body,
      { new: true, runValidators: true }
    );
    if (!UpdatedLesson) {
      return res.status(404).json({ message: "lesson not found" });
    }

    res.status(200).json(UpdatedLesson);
  } catch (err) {
    res.status(400).json(err);
  }
};

//! get one lesson's details
module.exports.get_one_lesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonID);
    if (!lesson) {
      return res.status(404).json({ message: "lesson not found" });
    }

    res.status(200).json(lesson);
  } catch (err) {
    res.status(400).json(err);
  }
};

//! getting lessons with unit title

// module.exports.getLessonsWithUnitsNames = async (req, res) => {
//   try {
//     // Fetch all units
//     const units = await Unit.find();

//     // Fetch all lessons
//     const lessons = await Lesson.find();

//     // Create a map of units IDs to units titles
//     const unitIdToTitleMap = {};
//     units.forEach((unit) => {
//       unitIdToTitleMap[unit._id.toString()] = unit.title;
//     });

//     // Map lessons to include units names
//     const lessonsWithUnitsNames = lessons.map((lesson) => ({
//       lessonTitle: lesson.title,
//       idUnit: lesson.idUnit,
//       unitTitle: lesson.idUnit
//         ? unitIdToTitleMap[lesson.idUnit.toString()]
//         : "defaultUnit",
//       courseName: lesson.idUnit.idCourse ? lesson.idUnit.idCourse.title : 'No course',
//     }));

//     return res.json(lessonsWithUnitsNames);
//   } catch (error) {
//     console.error("Error fetching lessons with units names:", error);
//     res.status(500).json({ error: error.message });
//     throw error;
//   }
// };

module.exports.getLessonsWithUnitsNames = async (req, res) => {
  try {
    // Fetch all lessons with unit information populated
    const lessons = await Lesson.find().populate({
      path: "idUnit",
      model: "Unit",
      populate: {
        path: "idCourse",
        model: "Course",
      },
    });

    // Map lessons to include unit and course names
    const lessonsWithUnitsAndCourses = lessons.map((lesson) => {
      const lessonObj = {
        lessonID:lesson._id,
        lessonTitle: lesson.title,
        unitTitle: lesson.idUnit ? lesson.idUnit.title : "defaultUnit",
      };

      // Check if the unit's course information is available and populated
      if (lesson.idUnit && lesson.idUnit.idCourse) {
        lessonObj.courseName = lesson.idUnit.idCourse.title;
      } else {
        lessonObj.courseName = "No course";
      }

      return lessonObj;
    });

    return res.json(lessonsWithUnitsAndCourses);
  } catch (error) {
    console.error("Error fetching lessons with units names:", error);
    res.status(500).json({ error: error.message });
  }
};
//! get lessons with Units ID
module.exports.getLessonsByIdUnit = async (req, res) => {
  try {
    const unitID = req.params.unitID;
    const lessons = await Lesson.find({ idUnit: unitID });
    res.status(200).json(lessons); // Send units as JSON response
  } catch (error) {
    console.error("Error fetching lessons by unit ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
