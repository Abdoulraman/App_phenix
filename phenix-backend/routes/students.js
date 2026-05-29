const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET /api/students - liste tous les élèves
router.get('/', studentController.getAllStudents);

// GET /api/students/:id - détail d’un élève
router.get('/:id', studentController.getStudentById);

// POST /api/students - ajouter un élève
router.post('/', studentController.createStudent);

// PUT /api/students/:id - modifier un élève
router.put('/:id', studentController.updateStudent);

// DELETE /api/students/:id - supprimer un élève
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
