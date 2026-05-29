// models/Parent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Parent = sequelize.define('Parent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    profession: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING }
}, {
    tableName: 'parents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Parent.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Parent, { foreignKey: 'user_id' });

module.exports = Parent;