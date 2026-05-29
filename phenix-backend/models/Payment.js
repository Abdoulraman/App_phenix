const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    description: { type: DataTypes.STRING }
}, {
    tableName: 'payments',
    timestamps: false
});

Payment.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = Payment;
