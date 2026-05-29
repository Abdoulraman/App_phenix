const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// GET /api/classes
router.get('/', classController.getAllClasses);

// GET /api/classes/:id
router.get('/:id', classController.getClassById);

// POST /api/classes
router.post('/', classController.createClass);

// PUT /api/classes/:id
router.put('/:id', classController.updateClass);

// DELETE /api/classes/:id
router.delete('/:id', classController.deleteClass);

module.exports = router;
