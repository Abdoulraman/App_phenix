const Teacher = require('../models/Teacher');
const User = require('../models/User');

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            include: [{ model: User, attributes: ['first_name','last_name','email'] }]
        });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['first_name','last_name','email'] }]
        });
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createTeacher = async (req, res) => {
    try {
        const { user_id, specialty } = req.body;
        const teacher = await Teacher.create({ user_id, specialty });
        res.status(201).json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
        await teacher.update(req.body);
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
        await teacher.destroy();
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
