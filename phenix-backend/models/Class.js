const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Class = sequelize.define('Class', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.STRING, allowNull: false },
    academic_year_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'classes',
    timestamps: false
});

module.exports = Class;
