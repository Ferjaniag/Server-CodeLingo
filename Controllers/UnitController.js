const express = require('express');
const router = express.Router();

const Unit = require('../Models/Unit') ;
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
  
  module.exports = {
    addUnit,
    deleteUnit,
    updateUnit,
    addLessonToUnit,
    addQuizToUnit,
  };