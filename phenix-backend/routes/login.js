// routes/login.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// IMPORTANT: Importer depuis le dossier models, pas les fichiers individuels
const { User, Role } = require('../models');  // ← CORRECTION ICI !

// ============================================
// CONNEXION UTILISATEUR
// ============================================
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des champs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email et mot de passe requis"
            });
        }

        console.log('🔍 Recherche utilisateur:', email);

        // Recherche de l'utilisateur avec son rôle
        // CORRECTION: Ajout de 'as: "role"' dans l'include
        const user = await User.scope('withPassword').findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    as: 'role',  // ← TRÈS IMPORTANT ! Doit correspondre à l'alias dans index.js
                    attributes: ['id', 'name']
                }
            ]
        });

        // Vérification si l'utilisateur existe
        if (!user) {
            console.log('❌ Utilisateur non trouvé:', email);
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect"
            });
        }

        // Vérification si le compte est actif
        if (!user.is_active) {
            console.log('❌ Compte désactivé:', email);
            return res.status(403).json({
                success: false,
                message: "Compte désactivé. Contactez l'administrateur"
            });
        }

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            console.log('❌ Mot de passe incorrect pour:', email);
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect"
            });
        }

        // Récupérer l'ID du rôle (1-5)
        const roleId = user.role_id;
        const roleName = user.role ? user.role.name : getRoleName(roleId);

        console.log(`✅ Connexion réussie: ${email} (Rôle: ${roleName})`);

        // Définir les permissions selon le rôle
        const permissions = getPermissionsByRole(roleId);

        // Création du token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role_id: roleId,
                role_name: roleName
            },
            process.env.JWT_SECRET || 'dev_secret_key',
            { expiresIn: '24h' }
        );

        // Réponse avec les informations utilisateur
        res.json({
            success: true,
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                role_id: roleId,
                role_name: roleName,
                first_name: user.first_name,
                last_name: user.last_name,
                full_name: `${user.first_name} ${user.last_name}`.trim(),
                email: user.email,
                phone: user.phone || '',
                is_active: user.is_active,
                permissions: permissions
            }
        });

    } catch (error) {
        console.error('❌ Erreur login:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la connexion",
            error: error.message
        });
    }
});

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Fonction pour obtenir le nom du rôle à partir de l'ID
function getRoleName(roleId) {
    const roleNames = {
        1: 'Admin',
        2: 'Secrétaire',
        3: 'Enseignant',
        4: 'Parent',
        5: 'Élève'
    };
    return roleNames[roleId] || 'Utilisateur';
}

// Fonction pour obtenir les permissions selon l'ID du rôle
function getPermissionsByRole(roleId) {
    const permissions = {
        1: [ // ADMIN
            'manage_users',
            'manage_teachers',
            'manage_students',
            'manage_parents',
            'manage_classes',
            'manage_subjects',
            'manage_grades',
            'view_all_data',
            'manage_payments',
            'manage_settings'
        ],
        2: [ // SECRETARY
            'manage_students',
            'manage_parents',
            'manage_classes',
            'manage_payments',
            'view_reports',
            'manage_attendance',
            'manage_badges'
        ],
        3: [ // TEACHER
            'manage_grades',
            'manage_attendance',
            'view_students',
            'view_classes',
            'view_schedule'
        ],
        4: [ // PARENT
            'view_children',
            'view_grades',
            'view_attendance',
            'view_payments',
            'communicate_teachers'
        ],
        5: [ // STUDENT
            'view_own_grades',
            'view_own_attendance',
            'view_own_schedule',
            'view_own_info'
        ]
    };

    return permissions[roleId] || [];
}

module.exports = router;