const Subject = require('../models/Subject');

exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createSubject = async (req, res) => {
    try {
        const { name, coefficient } = req.body;
        const subject = await Subject.create({ name, coefficient });
        res.status(201).json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        await subject.update(req.body);
        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        await subject.destroy();
        res.json({ message: 'Subject deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
