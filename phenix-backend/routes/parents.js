// routes/parents.js
const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticate, authorize } = require('../middlewares/auth');

// Toutes les routes parents nécessitent d'être authentifié
router.use(authenticate);

// GET /api/parents - liste tous les parents (accessible à ADMIN, SECRETARY)
router.get('/', authorize(1, 2), parentController.getAllParents);

// GET /api/parents/:id - détail d'un parent
router.get('/:id', authorize(1, 2, 4), parentController.getParentById);

// GET /api/parents/user/:userId - parent par user_id
router.get('/user/:userId', authorize(1, 2, 4), parentController.getParentByUserId);

// POST /api/parents - créer un parent (ADMIN, SECRETARY)
router.post('/', authorize(1, 2), parentController.createParent);

// PUT /api/parents/:id - modifier un parent
router.put('/:id', authorize(1, 2), parentController.updateParent);

// DELETE /api/parents/:id - supprimer un parent
router.delete('/:id', authorize(1), parentController.deleteParent);

module.exports = router;