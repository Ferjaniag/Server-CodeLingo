const express = require('express');
const router = express.Router();

const Unit = require('../Models/Unit') ;
const Course = require('../Models/Course');
const Lesson=require('../Models/Question' ) ; 
const Quiz=require('../Models/Question') ;

// Add a new unit
const addUnit = async (req, res) => {
    try {
      const { idCourse, title } = req.body;
      const unit = new Unit({ idCourse, title });
      const savedUnit = await unit.save();
      res.json(savedUnit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a unit
  const deleteUnit = async (req, res) => {
    try {
      const deletedUnit = await Unit.findByIdAndDelete(req.params.unitId);
      res.json(deletedUnit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update a unit
  const updateUnit = async (req, res) => {
    try {
      const { idCourse, title } = req.body;
      const updatedUnit = await Unit.findByIdAndUpdate(
        req.params.unitId,
        { idCourse, title },
        { new: true }
      );
      res.json(updatedUnit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Add a lesson to a unit
  const addLessonToUnit = async (req, res) => {
    try {
      const unit = await Unit.findById(req.params.unitId);
      const lesson = new Lesson(req.body);
      unit.lessons.push(lesson);
      await unit.save();
      res.json(unit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Add a quiz to a unit
  const addQuizToUnit = async (req, res) => {
    try {
      const unit = await Unit.findById(req.params.unitId);
      const quiz = new Quiz(req.body);
      unit.quizId = quiz._id;
      await unit.save();
      res.json(unit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  const getUnitsWithCourseNames=async (req,res)=> {
    try {
      // Fetch all units
      const units = await Unit.find();
  
      // Fetch all courses
      const courses = await Course.find();
  
      // Create a map of course IDs to course titles
      const courseIdToTitleMap = {};
      courses.forEach(course => {
        courseIdToTitleMap[course._id.toString()] = course.title;
      });
  
      // Map units to include course names
      const unitsWithCourseNames = units.map(unit => ({
        idUnit:unit._id.toString(),
        unitTitle: unit.title,
        nbLessons : unit.lessons.length,
        idCourse: unit.idCourse,
        courseTitle: unit.idCourse ? courseIdToTitleMap[unit.idCourse.toString()] : 'N/A'
      }));
  
      return res.json(unitsWithCourseNames);
    } catch (error) {
      console.error("Error fetching units with course names:", error);
      res.status(500).json({ error: error.message });
      throw error;
    }
  }
  








  module.exports = {
    addUnit,
    deleteUnit,
    updateUnit,
    addLessonToUnit,
    addQuizToUnit,
    getUnitsWithCourseNames
  };