const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ClassModel = require('./Class');
const Subject = require('./Subject');

const ClassSubject = sequelize.define('ClassSubject', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    subject_id: { type: DataTypes.INTEGER, allowNull: false },
    coefficient: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
    tableName: 'class_subjects',
    timestamps: false
});

ClassSubject.belongsTo(ClassModel, { foreignKey: 'class_id' });
ClassSubject.belongsTo(Subject, { foreignKey: 'subject_id' });

module.exports = ClassSubject;
