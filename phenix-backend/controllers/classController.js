const ClassModel = require('../models/Class');

exports.getAllClasses = async (req, res) => {
    try {
        const classes = await ClassModel.findAll();
        res.json(classes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getClassById = async (req, res) => {
    try {
        const classObj = await ClassModel.findByPk(req.params.id);
        if (!classObj) return res.status(404).json({ error: 'Class not found' });
        res.json(classObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { name, level } = req.body;
        const classObj = await ClassModel.create({ name, level });
        res.status(201).json(classObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const classObj = await ClassModel.findByPk(req.params.id);
        if (!classObj) return res.status(404).json({ error: 'Class not found' });
        await classObj.update(req.body);
        res.json(classObj);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const classObj = await ClassModel.findByPk(req.params.id);
        if (!classObj) return res.status(404).json({ error: 'Class not found' });
        await classObj.destroy();
        res.json({ message: 'Class deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
