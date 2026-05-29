const express = require('express');
const router = express.Router();

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const User = require('../models/User'); // ← décommente

router.get('/', async (req, res) => {
  try {
    const students = await Student.count();
    const teachers = await Teacher.count();
    const users = await User.count(); // ← ajout

    res.json({
      students,
      teachers,
      users
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;