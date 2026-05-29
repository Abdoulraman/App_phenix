const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// GET /api/teachers
router.get('/', teacherController.getAllTeachers);

// GET /api/teachers/:id
router.get('/:id', teacherController.getTeacherById);

// POST /api/teachers
router.post('/', teacherController.createTeacher);

// PUT /api/teachers/:id
router.put('/:id', teacherController.updateTeacher);

// DELETE /api/teachers/:id
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
