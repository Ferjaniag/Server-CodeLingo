const Course = require("../Models/Course");

exports.add_course = async (req, res) => {
  try {
    const { title, description, category, unit } = req.body;
    const data = { title, description, category, unit };
    const new_course = await Course.create(data);
    res.status(200).send(new_course);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.get_all_courses = async (req, res) => {
  try {
    await Course.find({}).then((courses) => {
      if (courses) {
        res.status(200).send(courses);
      } else {
        res.status(404).send("Courses not found");
      }
    });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};

exports.get_frontend_courses = async (req, res) => {
  try {
    const frontendCourses = await Course.find({ category: 'FrontEnd Development' });
    res.status(200).send(frontendCourses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.get_backend_courses = async (req, res) => {
  try {
    const backendCourses = await Course.find({ category: 'BackEnd Development' });
    res.status(200).send(backendCourses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.get_programming_Languages_courses = async (req, res) => {
  try {
    const programmingLanguages = await Course.find({ category: 'Programming  Language' });
    res.status(200).send(programmingLanguages);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.get_courses_by_category = async (req, res) => {
  try {
    const programmingLanguages = await Course.find({ category: req.params.category });
    res.status(200).send(programmingLanguages);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

exports.delete_course = async (req, res) => {
  try {
    const result = await Course.findByIdAndDelete({ _id: req.params.courseID });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

//! function to update a course

module.exports.update_course = async (req, res) => {
  try {
    const UpdatedCourse = await Course.findByIdAndUpdate(
      req.params.courseID,
      req.body,
      { new: true, runValidators: true }
    );
    if (!UpdatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(UpdatedCourse);
  } catch (err) {
    res.status(400).json(err);
  }
};

//! get one course
module.exports.get_one_course = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseID);
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    res.status(400).json(err);
  }
};