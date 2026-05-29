// models/Student.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('Student', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false
    },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "L'ID utilisateur est requis"
            },
            isInt: {
                msg: "L'ID utilisateur doit être un nombre entier"
            }
        }
        // SUPPRIMÉ: references - sera géré par les associations dans index.js
    },
    class_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate: {
            notNull: {
                msg: "L'ID de la classe est requis"
            },
            isInt: {
                msg: "L'ID de la classe doit être un nombre entier"
            }
        }
        // SUPPRIMÉ: references
    },
    parent_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        validate: {
            isInt: {
                msg: "L'ID du parent doit être un nombre entier"
            }
        }
        // SUPPRIMÉ: references
    },
    date_of_birth: { 
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: "La date de naissance doit être une date valide"
            },
            isBefore: {
                args: new Date().toISOString().split('T')[0],
                msg: "La date de naissance doit être dans le passé"
            }
        }
    }
}, {
    // Configuration de la table
    tableName: 'students',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true, // Utilise la notation snake_case pour les colonnes
    
    // Configuration supplémentaire
    hooks: {
        beforeValidate: (student, options) => {
            // Vous pouvez ajouter des hooks ici si nécessaire
            console.log('Validation de l\'élève...');
        },
        afterCreate: (student, options) => {
            console.log(`✅ Élève créé avec l'ID: ${student.id}`);
        }
    },

    // Index pour améliorer les performances
    indexes: [
        {
            name: 'idx_student_user_id',
            fields: ['user_id']
        },
        {
            name: 'idx_student_class_id',
            fields: ['class_id']
        },
        {
            name: 'idx_student_parent_id',
            fields: ['parent_id']
        }
    ]
});

// ============================================
// ATTENTION: AUCUNE ASSOCIATION DÉFINIE ICI !
// Toutes les associations seront définies DANS index.js
// ============================================
// NE PAS AJOUTER:
// - Student.belongsTo(User)
// - Student.belongsTo(Class)
// - Student.belongsTo(Parent)
// 
// Ces associations seront définies dans models/index.js
// pour éviter les conflits d'alias
// ============================================

// Méthodes d'instance (optionnelles)
Student.prototype.getFullName = function() {
    // Note: Cette méthode nécessite que l'association User soit chargée
    return this.user ? `${this.user.first_name} ${this.user.last_name}` : 'Nom non disponible';
};

Student.prototype.getAge = function() {
    if (!this.date_of_birth) return null;
    const today = new Date();
    const birthDate = new Date(this.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Méthodes statiques (optionnelles)
Student.findByUserId = function(userId) {
    return this.findOne({
        where: { user_id: userId }
    });
};

Student.findByClass = function(classId) {
    return this.findAll({
        where: { class_id: classId }
    });
};

Student.findWithDetails = function() {
    return this.findAll({
        include: [
            { association: 'user' },
            { association: 'class' },
            { association: 'parent' }
        ]
    });
};

module.exports = Student;