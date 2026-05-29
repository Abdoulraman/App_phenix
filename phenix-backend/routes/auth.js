// routes/auth.js - Version corrigée

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Middleware d'authentification
const { authenticate, authorize } = require('../middlewares/auth');

// Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s]{10,}$/;

// ============================================
// INSCRIPTION PUBLIQUE (PARENT ou ÉLÈVE uniquement)
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { 
            first_name, 
            last_name, 
            email, 
            password, 
            phone,
            user_type // 'parent' ou 'student' (c'est ce que l'utilisateur choisit)
        } = req.body;

        // Validation des champs requis
        if (!first_name || !last_name || !email || !password || !user_type) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires"
            });
        }

        // Validation du type d'utilisateur
        if (!['parent', 'student'].includes(user_type)) {
            return res.status(400).json({
                success: false,
                message: "Type d'utilisateur invalide"
            });
        }

        // Validation email
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Format d'email invalide"
            });
        }

        // Validation mot de passe
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Le mot de passe doit contenir au moins 6 caractères"
            });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Cet email est déjà utilisé"
            });
        }

        // Déterminer le rôle_id en fonction du type d'utilisateur
        let roleId;
        if (user_type === 'parent') {
            const parentRole = await Role.findOne({ where: { name: 'PARENT' } });
            roleId = parentRole ? parentRole.id : 2; // Fallback à 2 si besoin
        } else { // student
            const studentRole = await Role.findOne({ where: { name: 'STUDENT' } });
            roleId = studentRole ? studentRole.id : 4; // Fallback à 4 si besoin
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const newUser = await User.create({
            role_id: roleId,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone: phone || null,
            is_active: true
        });

        // Récupérer le rôle pour le token
        const role = await Role.findByPk(roleId);

        // Générer un token pour connexion automatique
        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                role_id: newUser.role_id,
                role_name: role.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Réponse sans le mot de passe
        res.status(201).json({
            success: true,
            message: "Inscription réussie",
            token,
            user: {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone: newUser.phone,
                user_type: user_type, // On renvoie 'parent' ou 'student' pour le frontend
                is_active: newUser.is_active
                // Pas de role_id exposé !
            }
        });

    } catch (error) {
        console.error('❌ Erreur inscription:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de l'inscription"
        });
    }
});

// ============================================
// CRÉATION D'UTILISATEUR PAR ADMIN (back-office uniquement)
// ============================================
router.post('/users', authenticate, authorize('ADMIN', 'SECRETARY'), async (req, res) => {
    try {
        const {
            role_name, // On utilise le nom du rôle, pas l'ID
            first_name,
            last_name,
            email,
            password,
            phone,
            is_active
        } = req.body;

        // Validation des champs
        if (!role_name || !first_name || !last_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires"
            });
        }

        // Liste des rôles autorisés à la création
        const allowedRoles = ['TEACHER', 'PARENT', 'STUDENT', 'SECRETARY']; // ADMIN exclu volontairement
        if (!allowedRoles.includes(role_name)) {
            return res.status(400).json({
                success: false,
                message: "Rôle non autorisé"
            });
        }

        // Récupérer le rôle par son nom
        const role = await Role.findOne({ where: { name: role_name } });
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Rôle invalide"
            });
        }

        // Validation email
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Format d'email invalide"
            });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Cet email est déjà utilisé"
            });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création
        const newUser = await User.create({
            role_id: role.id,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone: phone || null,
            is_active: is_active !== undefined ? is_active : true
        });

        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            user: {
                id: newUser.id,
                role: role_name, // On renvoie le nom du rôle
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone: newUser.phone,
                is_active: newUser.is_active
            }
        });

    } catch (error) {
        console.error('❌ Erreur création:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
});

module.exports = router;