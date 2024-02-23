const Lesson = require("../Models/Lesson");

exports.add_lesson = async (req, res) => {
  try {
    const { title, content} = req.body;
    const data = { title, content};
    const new_lesson = await Lesson.create(data);
    res.status(200).send(new_lesson);
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