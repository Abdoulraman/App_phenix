const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');
const ClassModel = require('./Class');

const Attendance = sequelize.define('Attendance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('Present','Absent','Retard'), defaultValue: 'Present' }
}, {
    tableName: 'attendances',
    timestamps: false
});

Attendance.belongsTo(Student, { foreignKey: 'student_id' });
Attendance.belongsTo(ClassModel, { foreignKey: 'class_id' });

module.exports = Attendance;
