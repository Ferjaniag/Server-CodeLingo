const express = require('express');
const router = express.Router();


const ExerciseController = require('../Controllers/ExerciseController');

router.post('/create_exercise',ExerciseController.createExercise) ; 
router.get('/get_recent_exercises',ExerciseController.getRecentExercises);
router.get('/get_exercises_by_lesson/lessonId',ExerciseController.getExerciseByIdLesson);
router.get('/get_exercise/:id',ExerciseController.getExerciseByIdEx) ;
router.delete('/delete_exercise/:id',ExerciseController.deleteExerciseById);

module.exports=router;