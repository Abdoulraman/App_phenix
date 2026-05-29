const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

// GET /api/subjects
router.get('/', subjectController.getAllSubjects);

// GET /api/subjects/:id
router.get('/:id', subjectController.getSubjectById);

// POST /api/subjects
router.post('/', subjectController.createSubject);

// PUT /api/subjects/:id
router.put('/:id', subjectController.updateSubject);

// DELETE /api/subjects/:id
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
