// models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Role = require('./Role');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Parent = require('./Parent');
const Class = require('./Class');
const Subject = require('./Subject');
const Grade = require('./Grade');
const Payment = require('./Payment');
const Attendance = require('./Attendance');
const AcademicYear = require('./AcademicYear');
const TeachingAssignment = require('./TeachingAssignment');

// Définir toutes les associations
// User - Role
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

// Student - User
Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Student, { foreignKey: 'user_id' });

// Student - Class
Student.belongsTo(Class, { foreignKey: 'class_id' });
Class.hasMany(Student, { foreignKey: 'class_id' });

// Student - Parent
Student.belongsTo(Parent, { foreignKey: 'parent_id' });
Parent.hasMany(Student, { foreignKey: 'parent_id' });

// Teacher - User
Teacher.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Teacher, { foreignKey: 'user_id' });

// Parent - User
Parent.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Parent, { foreignKey: 'user_id' });

// Teaching Assignments
TeachingAssignment.belongsTo(Teacher, { foreignKey: 'teacher_id' });
TeachingAssignment.belongsTo(Subject, { foreignKey: 'subject_id' });
TeachingAssignment.belongsTo(Class, { foreignKey: 'class_id' });
Teacher.hasMany(TeachingAssignment, { foreignKey: 'teacher_id' });
Subject.hasMany(TeachingAssignment, { foreignKey: 'subject_id' });
Class.hasMany(TeachingAssignment, { foreignKey: 'class_id' });

// Grades
Grade.belongsTo(Student, { foreignKey: 'student_id' });
Grade.belongsTo(Subject, { foreignKey: 'subject_id' });
Grade.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Student.hasMany(Grade, { foreignKey: 'student_id' });
Subject.hasMany(Grade, { foreignKey: 'subject_id' });
Teacher.hasMany(Grade, { foreignKey: 'teacher_id' });

// Payments
Payment.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Payment, { foreignKey: 'student_id' });

// Attendances
Attendance.belongsTo(Student, { foreignKey: 'student_id' });
Attendance.belongsTo(Class, { foreignKey: 'class_id' });
Student.hasMany(Attendance, { foreignKey: 'student_id' });
Class.hasMany(Attendance, { foreignKey: 'class_id' });

// Class - AcademicYear
Class.belongsTo(AcademicYear, { foreignKey: 'academic_year_id' });
AcademicYear.hasMany(Class, { foreignKey: 'academic_year_id' });

// Exporter tous les modèles
module.exports = {
    sequelize,
    User,
    Role,
    Student,
    Teacher,
    Parent,
    Class,
    Subject,
    Grade,
    Payment,
    Attendance,
    AcademicYear,
    TeachingAssignment
};