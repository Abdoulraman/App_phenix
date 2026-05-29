// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// Note: On n'importe plus Role ici car l'association sera dans index.js

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false
    },
    role_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        validate: {
            notNull: {
                msg: "Le rôle est requis"
            },
            isInt: {
                msg: "L'ID du rôle doit être un nombre entier"
            },
            isIn: {
                args: [[1, 2, 3, 4, 5]],
                msg: "Rôle invalide"
            }
        }
    },
    first_name: { 
        type: DataTypes.STRING(100), 
        allowNull: false,
        validate: {
            notNull: {
                msg: "Le prénom est requis"
            },
            notEmpty: {
                msg: "Le prénom ne peut pas être vide"
            },
            len: {
                args: [2, 100],
                msg: "Le prénom doit contenir entre 2 et 100 caractères"
            }
        }
    },
    last_name: { 
        type: DataTypes.STRING(100), 
        allowNull: false,
        validate: {
            notNull: {
                msg: "Le nom est requis"
            },
            notEmpty: {
                msg: "Le nom ne peut pas être vide"
            },
            len: {
                args: [2, 100],
                msg: "Le nom doit contenir entre 2 et 100 caractères"
            }
        }
    },
    email: { 
        type: DataTypes.STRING(150), 
        allowNull: false, 
        unique: true,
        validate: {
            notNull: {
                msg: "L'email est requis"
            },
            notEmpty: {
                msg: "L'email ne peut pas être vide"
            },
            isEmail: {
                msg: "Format d'email invalide"
            }
        }
    },
    password: { 
        type: DataTypes.STRING(255), 
        allowNull: false,
        validate: {
            notNull: {
                msg: "Le mot de passe est requis"
            },
            notEmpty: {
                msg: "Le mot de passe ne peut pas être vide"
            },
            len: {
                args: [6, 255],
                msg: "Le mot de passe doit contenir au moins 6 caractères"
            }
        }
    },
    phone: { 
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^[0-9+\-\s()]{8,20}$/,
                msg: "Format de téléphone invalide"
            }
        }
    },
    is_active: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true,
        validate: {
            isIn: {
                args: [[true, false]],
                msg: "is_active doit être true ou false"
            }
        }
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
    
    hooks: {
        beforeCreate: async (user, options) => {
            console.log(`📝 Création de l'utilisateur: ${user.email}`);
        },
        beforeUpdate: async (user, options) => {
            console.log(`📝 Mise à jour de l'utilisateur: ${user.email}`);
        },
        afterCreate: (user, options) => {
            console.log(`✅ Utilisateur créé avec l'ID: ${user.id}`);
        }
    },

    indexes: [
        {
            name: 'idx_user_email',
            unique: true,
            fields: ['email']
        },
        {
            name: 'idx_user_role',
            fields: ['role_id']
        },
        {
            name: 'idx_user_active',
            fields: ['is_active']
        }
    ],

    defaultScope: {
        attributes: { exclude: ['password'] }
    },
    scopes: {
        withPassword: {
            attributes: { include: ['password'] }
        },
        active: {
            where: { is_active: true }
        },
        byRole: (roleId) => ({
            where: { role_id: roleId }
        })
    }
});

// ============================================
// SUPPRIMEZ L'ASSOCIATION ICI !
// PLUS DE : User.belongsTo(Role, { ... })
// ============================================

// Méthodes d'instance
User.prototype.getFullName = function() {
    return `${this.first_name} ${this.last_name}`.trim();
};

User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

// Méthodes statiques
User.findByEmail = function(email) {
    return this.findOne({
        where: { email }
    });
};

User.findActive = function() {
    return this.scope('active').findAll();
};

User.findByRole = function(roleId) {
    return this.scope('byRole', roleId).findAll();
};

User.findWithDetails = function(userId) {
    return this.findByPk(userId, {
        include: [
            { association: 'role' },
            { association: 'student' },
            { association: 'teacher' },
            { association: 'parent' }
        ]
    });
};

User.authenticate = async function(email, password) {
    const user = await this.scope('withPassword').findOne({ where: { email } });
    if (!user) return null;
    
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) return null;
    
    delete user.dataValues.password;
    return user;
};

module.exports = User;