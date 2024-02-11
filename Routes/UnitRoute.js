const express = require('express');
const router = express.Router();
const unitController = require('../Controllers/UnitController');

router.post('/add_unit', unitController.addUnit);
router.get('/get_units',unitController.getUnitsWithCourseNames);
router.delete('/delete_unit/:unitId', unitController.deleteUnit);
router.put('/update_unit/:unitId', unitController.updateUnit);
router.post('/add_lesson/:unitId', unitController.addLessonToUnit);
router.post('/add_quiz/:unitId', unitController.addQuizToUnit);

module.exports = router;