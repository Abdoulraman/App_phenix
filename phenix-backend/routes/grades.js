const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// GET /api/grades - liste toutes les notes
router.get('/', gradeController.getAllGrades);

// GET /api/grades/:id - détail d’une note
router.get('/:id', gradeController.getGradeById);

// POST /api/grades - ajouter une note
router.post('/', gradeController.createGrade);

// PUT /api/grades/:id - modifier une note
router.put('/:id', gradeController.updateGrade);

// DELETE /api/grades/:id - supprimer une note
router.delete('/:id', gradeController.deleteGrade);

// GET /api/grades/student/:studentId - toutes les notes d’un élève
router.get('/student/:studentId', gradeController.getGradesByStudent);

// GET /api/grades/class/:classId/sequence/:sequence - notes d’une classe pour une séquence
router.get('/class/:classId/sequence/:sequence', gradeController.getGradesByClassAndSequence);

module.exports = router;
