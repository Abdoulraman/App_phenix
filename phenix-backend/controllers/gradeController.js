const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');

exports.getAllGrades = async (req, res) => {
    try {
        const grades = await Grade.findAll({
            include: [
                { model: Student, include: ['User'] },
                { model: Subject },
                { model: Teacher, include: ['User'] }
            ]
        });
        res.json(grades);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGradeById = async (req, res) => {
    try {
        const grade = await Grade.findByPk(req.params.id, {
            include: [
                { model: Student, include: ['User'] },
                { model: Subject },
                { model: Teacher, include: ['User'] }
            ]
        });
        if (!grade) return res.status(404).json({ error: 'Grade not found' });
        res.json(grade);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createGrade = async (req, res) => {
    try {
        const { student_id, subject_id, teacher_id, sequence, score } = req.body;
        const grade = await Grade.create({ student_id, subject_id, teacher_id, sequence, score });
        res.status(201).json(grade);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateGrade = async (req, res) => {
    try {
        const grade = await Grade.findByPk(req.params.id);
        if (!grade) return res.status(404).json({ error: 'Grade not found' });
        await grade.update(req.body);
        res.json(grade);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteGrade = async (req, res) => {
    try {
        const grade = await Grade.findByPk(req.params.id);
        if (!grade) return res.status(404).json({ error: 'Grade not found' });
        await grade.destroy();
        res.json({ message: 'Grade deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Grades par élève
exports.getGradesByStudent = async (req, res) => {
    try {
        const grades = await Grade.findAll({ where: { student_id: req.params.studentId } });
        res.json(grades);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Grades par classe et séquence
exports.getGradesByClassAndSequence = async (req, res) => {
    try {
        const { classId, sequence } = req.params;
        const grades = await Grade.findAll({
            include: [{
                model: Student,
                where: { class_id: classId }
            }],
            where: { sequence }
        });
        res.json(grades);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
