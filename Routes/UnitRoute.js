const express = require('express');
const router = express.Router();
const unitController = require('../Controllers/UnitController');

router.post('/add', unitController.addUnit);
router.delete('/delete/:unitId', unitController.deleteUnit);
router.put('/update/:unitId', unitController.updateUnit);
router.post('/add-lesson/:unitId', unitController.addLessonToUnit);
router.post('/add-quiz/:unitId', unitController.addQuizToUnit);

module.exports = router;