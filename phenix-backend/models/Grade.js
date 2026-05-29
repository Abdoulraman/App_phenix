const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');
const Subject = require('./Subject');
const Teacher = require('./Teacher');
const ClassModel = require('./Class');

const Grade = sequelize.define('Grade', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    subject_id: { type: DataTypes.INTEGER, allowNull: false },
    teacher_id: { type: DataTypes.INTEGER, allowNull: false },
    sequence: { type: DataTypes.STRING, allowNull: false },
    score: { type: DataTypes.DECIMAL(5,2), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'grades',
    timestamps: false
});

Grade.belongsTo(Student, { foreignKey: 'student_id' });
Grade.belongsTo(ClassModel, { foreignKey: 'class_id' });
Grade.belongsTo(Subject, { foreignKey: 'subject_id' });
Grade.belongsTo(Teacher, { foreignKey: 'teacher_id' });

module.exports = Grade;
