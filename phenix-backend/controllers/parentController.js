// controllers/parentController.js
const { Parent, User, Student, Class } = require('../models/Parent');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

// GET tous les parents
exports.getAllParents = async (req, res) => {
    try {
        const parents = await Parent.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'is_active']
                },
                {
                    model: Student,
                    include: [{
                        model: Class,
                        attributes: ['id', 'name', 'level']
                    }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            count: parents.length,
            parents
        });

    } catch (error) {
        console.error('❌ Erreur getAllParents:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};

// GET un parent par ID
exports.getParentById = async (req, res) => {
    try {
        const parent = await Parent.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'is_active']
                },
                {
                    model: Student,
                    include: [{
                        model: Class,
                        attributes: ['id', 'name', 'level']
                    }]
                }
            ]
        });

        if (!parent) {
            return res.status(404).json({
                success: false,
                message: "Parent non trouvé"
            });
        }

        res.json({
            success: true,
            parent
        });

    } catch (error) {
        console.error('❌ Erreur getParentById:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};

// GET parent par user_id
exports.getParentByUserId = async (req, res) => {
    try {
        const parent = await Parent.findOne({
            where: { user_id: req.params.userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'is_active']
                },
                {
                    model: Student,
                    include: [{
                        model: Class,
                        attributes: ['id', 'name', 'level']
                    }]
                }
            ]
        });

        if (!parent) {
            return res.status(404).json({
                success: false,
                message: "Parent non trouvé pour cet utilisateur"
            });
        }

        res.json({
            success: true,
            parent
        });

    } catch (error) {
        console.error('❌ Erreur getParentByUserId:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};

// POST créer un parent
exports.createParent = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { 
            first_name, 
            last_name, 
            email, 
            password,
            phone,
            profession,
            address
        } = req.body;

        // Validation
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                success: false,
                message: "Prénom, nom et email sont requis"
            });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ 
            where: { email },
            transaction 
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Cet email est déjà utilisé"
            });
        }

        // Générer un mot de passe si non fourni
        const finalPassword = password || generatePassword();
        const hashedPassword = await bcrypt.hash(finalPassword, 10);

        // 1. Créer l'utilisateur (role_id = 4 pour PARENT)
        const newUser = await User.create({
            role_id: 4,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone: phone || null,
            is_active: true
        }, { transaction });

        // 2. Créer l'entrée dans la table parents
        const newParent = await Parent.create({
            user_id: newUser.id,
            profession: profession || null,
            address: address || null
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: "Parent créé avec succès",
            parent: {
                id: newParent.id,
                user_id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone: newUser.phone,
                profession: newParent.profession,
                address: newParent.address
            },
            credentials: {
                email: newUser.email,
                password: finalPassword // À afficher une seule fois
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Erreur createParent:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la création"
        });
    }
};

// PUT modifier un parent
exports.updateParent = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const parentId = req.params.id;
        const { 
            first_name, 
            last_name, 
            email,
            phone,
            profession,
            address,
            is_active
        } = req.body;

        // Trouver le parent
        const parent = await Parent.findByPk(parentId, { 
            include: [{ model: User }],
            transaction 
        });
        
        if (!parent) {
            return res.status(404).json({
                success: false,
                message: "Parent non trouvé"
            });
        }

        // Mettre à jour l'utilisateur
        if (parent.User) {
            await parent.User.update({
                first_name: first_name || parent.User.first_name,
                last_name: last_name || parent.User.last_name,
                email: email || parent.User.email,
                phone: phone || parent.User.phone,
                is_active: is_active !== undefined ? is_active : parent.User.is_active
            }, { transaction });
        }

        // Mettre à jour le parent
        await parent.update({
            profession: profession !== undefined ? profession : parent.profession,
            address: address !== undefined ? address : parent.address
        }, { transaction });

        await transaction.commit();

        res.json({
            success: true,
            message: "Parent modifié avec succès",
            parent: {
                id: parent.id,
                user_id: parent.user_id,
                first_name: first_name || parent.User?.first_name,
                last_name: last_name || parent.User?.last_name,
                email: email || parent.User?.email,
                phone: phone || parent.User?.phone,
                profession: profession || parent.profession,
                address: address || parent.address,
                is_active: is_active !== undefined ? is_active : parent.User?.is_active
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Erreur updateParent:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};

// DELETE supprimer un parent
exports.deleteParent = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const parentId = req.params.id;

        // Trouver le parent
        const parent = await Parent.findByPk(parentId, { 
            include: [{ model: User }],
            transaction 
        });
        
        if (!parent) {
            return res.status(404).json({
                success: false,
                message: "Parent non trouvé"
            });
        }

        // Vérifier si le parent a des enfants
        const childrenCount = await Student.count({
            where: { parent_id: parentId },
            transaction
        });

        if (childrenCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Impossible de supprimer ce parent car il a des enfants inscrits"
            });
        }

        // Supprimer le parent
        await parent.destroy({ transaction });

        // Supprimer l'utilisateur associé
        if (parent.User) {
            await parent.User.destroy({ transaction });
        }

        await transaction.commit();

        res.json({
            success: true,
            message: "Parent supprimé avec succès"
        });

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Erreur deleteParent:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
};

// Fonction utilitaire pour générer un mot de passe
function generatePassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password + "123";
}