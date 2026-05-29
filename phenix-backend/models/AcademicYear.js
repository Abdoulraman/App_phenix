const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AcademicYear = sequelize.define('AcademicYear', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label: { type: DataTypes.STRING, allowNull: false, unique: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'academic_years',
    timestamps: false
});

module.exports = AcademicYear;
