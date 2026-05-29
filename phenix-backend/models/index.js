// models/index.js
const User = require('./User');
const Role = require('./Role');
const Student = require('./Student');
const Parent = require('./Parent');
const Class = require('./Class');

// Vérification que tous les modèles sont bien chargés
console.log('📦 Modèles chargés:');
console.log('- User:', User ? '✅' : '❌');
console.log('- Role:', Role ? '✅' : '❌');
console.log('- Student:', Student ? '✅' : '❌');
console.log('- Parent:', Parent ? '✅' : '❌');
console.log('- Class:', Class ? '✅' : '❌');

// ============================================
// DÉFINITION DE TOUTES LES ASSOCIATIONS AVEC ALIAS
// ============================================

// Relations User - Role
User.belongsTo(Role, { 
    foreignKey: 'role_id', 
    as: 'role'  // AJOUT DE L'ALIAS
});
Role.hasMany(User, { 
    foreignKey: 'role_id', 
    as: 'users'  // AJOUT DE L'ALIAS
});

// Relations User - Student
User.hasOne(Student, { 
    foreignKey: 'user_id', 
    as: 'student'  // ALIAS: 'student' pour User -> Student
});
Student.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user'  // ALIAS: 'user' pour Student -> User (TRÈS IMPORTANT)
});

// Relations Student - Class
Student.belongsTo(Class, { 
    foreignKey: 'class_id', 
    as: 'class'  // ALIAS: 'class' pour Student -> Class
});
Class.hasMany(Student, { 
    foreignKey: 'class_id', 
    as: 'students'  // ALIAS: 'students' pour Class -> Student
});

// Relations Student - Parent
Student.belongsTo(Parent, { 
    foreignKey: 'parent_id', 
    as: 'parent'  // ALIAS: 'parent' pour Student -> Parent
});
Parent.hasMany(Student, { 
    foreignKey: 'parent_id', 
    as: 'students'  // ALIAS: 'students' pour Parent -> Student
});

// Relations Parent - User
Parent.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user'  // ALIAS: 'user' pour Parent -> User
});
User.hasOne(Parent, { 
    foreignKey: 'user_id', 
    as: 'parent'  // ALIAS: 'parent' pour User -> Parent
});

// ============================================
// VÉRIFICATION DÉTAILLÉE DES ASSOCIATIONS
// ============================================

console.log('🔗 Associations configurées:');

// Vérification User associations
console.log('\n📊 Associations de User:');
if (User.associations) {
    console.log('- role:', User.associations.role ? '✅' : '❌');
    console.log('- student:', User.associations.student ? '✅' : '❌');
    console.log('- parent:', User.associations.parent ? '✅' : '❌');
}

// Vérification Student associations
console.log('\n📊 Associations de Student:');
if (Student.associations) {
    console.log('- user:', Student.associations.user ? '✅' : '❌');
    console.log('- class:', Student.associations.class ? '✅' : '❌');
    console.log('- parent:', Student.associations.parent ? '✅' : '❌');
}

// Vérification Parent associations
console.log('\n📊 Associations de Parent:');
if (Parent.associations) {
    console.log('- user:', Parent.associations.user ? '✅' : '❌');
    console.log('- students:', Parent.associations.students ? '✅' : '❌');
}

// Vérification Class associations
console.log('\n📊 Associations de Class:');
if (Class.associations) {
    console.log('- students:', Class.associations.students ? '✅' : '❌');
}

// Vérification Role associations
console.log('\n📊 Associations de Role:');
if (Role.associations) {
    console.log('- users:', Role.associations.users ? '✅' : '❌');
}

console.log('\n✅ Toutes les associations sont configurées avec les bons alias!');

module.exports = {
    User,
    Role,
    Student,
    Parent,
    Class
};