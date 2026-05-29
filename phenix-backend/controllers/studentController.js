// controllers/studentController.js
const { Student, User, Class, Parent } = require('../models');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

// GET tous les élèves avec leurs informations
exports.getAllStudents = async (req, res) => {
    try {
        console.log('📥 Récupération de tous les élèves...');
        
        const students = await Student.findAll({
            include: [
                { 
                    model: User,
                    as: 'user', // AJOUTER CET ALIAS !
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'is_active']
                },
                { 
                    model: Class,
                    as: 'class', // AJOUTER CET ALIAS !
                    attributes: ['id', 'name', 'level']
                },
                {
                    model: Parent,
                    as: 'parent', // AJOUTER CET ALIAS !
                    attributes: ['id', 'profession'],
                    include: [{
                        model: User,
                        as: 'user', // Garder cet alias
                        attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                    }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        console.log(`✅ ${students.length} élèves trouvés`);

        // Transformer les données pour éviter les conflits de noms
        const formattedStudents = students.map(student => ({
            id: student.id,
            user_id: student.user_id,
            student_user: student.user ? { // Renommé pour éviter confusion
                id: student.user.id,
                first_name: student.user.first_name,
                last_name: student.user.last_name,
                email: student.user.email,
                phone: student.user.phone,
                is_active: student.user.is_active
            } : null,
            class: student.class ? {
                id: student.class.id,
                name: student.class.name,
                level: student.class.level
            } : null,
            parent: student.parent ? {
                id: student.parent.id,
                profession: student.parent.profession,
                user: student.parent.user ? {
                    id: student.parent.user.id,
                    first_name: student.parent.user.first_name,
                    last_name: student.parent.user.last_name,
                    email: student.parent.user.email,
                    phone: student.parent.user.phone
                } : null
            } : null,
            date_of_birth: student.date_of_birth,
            created_at: student.created_at
        }));

        res.json({
            success: true,
            count: students.length,
            students: formattedStudents
        });

    } catch (error) {
        console.error('❌ Erreur getAllStudents:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};

// GET un élève par ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: [
                { 
                    model: User,
                    as: 'user', // AJOUTER CET ALIAS
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'is_active']
                },
                { 
                    model: Class,
                    as: 'class', // AJOUTER CET ALIAS
                    attributes: ['id', 'name', 'level']
                },
                {
                    model: Parent,
                    as: 'parent', // AJOUTER CET ALIAS
                    attributes: ['id', 'profession'],
                    include: [{
                        model: User,
                        as: 'user', // Garder cet alias
                        attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                    }]
                }
            ]
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Élève non trouvé"
            });
        }

        // Formater la réponse
        const formattedStudent = {
            id: student.id,
            user_id: student.user_id,
            student_user: student.user ? {
                id: student.user.id,
                first_name: student.user.first_name,
                last_name: student.user.last_name,
                email: student.user.email,
                phone: student.user.phone,
                is_active: student.user.is_active
            } : null,
            class: student.class ? {
                id: student.class.id,
                name: student.class.name,
                level: student.class.level
            } : null,
            parent: student.parent ? {
                id: student.parent.id,
                profession: student.parent.profession,
                user: student.parent.user ? {
                    id: student.parent.user.id,
                    first_name: student.parent.user.first_name,
                    last_name: student.parent.user.last_name,
                    email: student.parent.user.email,
                    phone: student.parent.user.phone
                } : null
            } : null,
            date_of_birth: student.date_of_birth,
            created_at: student.created_at
        };

        res.json({
            success: true,
            student: formattedStudent
        });

    } catch (error) {
        console.error('❌ Erreur getStudentById:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};

// POST créer un nouvel élève
exports.createStudent = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { 
            first_name, 
            last_name, 
            email, 
            password,
            class_id, 
            parent_id,
            date_of_birth,
            phone,
            createNewParent,
            newParent
        } = req.body;

        // Validation des champs requis
        if (!first_name || !last_name || !email || !class_id) {
            return res.status(400).json({
                success: false,
                message: "Prénom, nom, email et classe sont requis"
            });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ 
            where: { email },
            transaction 
        });

        if (existingUser) {
            await transaction.rollback();
            return res.status(409).json({
                success: false,
                message: "Cet email est déjà utilisé"
            });
        }

        // Générer un mot de passe si non fourni
        const finalPassword = password || generatePassword();
        const hashedPassword = await bcrypt.hash(finalPassword, 10);

        // 1. Créer l'utilisateur (role_id = 5 pour STUDENT)
        const newUser = await User.create({
            role_id: 5,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            phone: phone || null,
            is_active: true
        }, { transaction });

        // 2. Si création d'un nouveau parent demandée
        let finalParentId = parent_id;
        
        if (createNewParent && newParent) {
            // Vérifier si l'email du parent existe déjà
            const existingParentUser = await User.findOne({
                where: { email: newParent.email },
                transaction
            });

            if (existingParentUser) {
                await transaction.rollback();
                return res.status(409).json({
                    success: false,
                    message: "Un parent avec cet email existe déjà"
                });
            }

            // Créer l'utilisateur parent (role_id = 4 pour PARENT)
            const parentPassword = generatePassword();
            const hashedParentPassword = await bcrypt.hash(parentPassword, 10);

            const parentUser = await User.create({
                role_id: 4,
                first_name: newParent.first_name,
                last_name: newParent.last_name,
                email: newParent.email,
                password: hashedParentPassword,
                phone: newParent.phone || null,
                is_active: true
            }, { transaction });

            // Créer l'entrée dans la table parents
            const parent = await Parent.create({
                user_id: parentUser.id,
                profession: newParent.profession || null
            }, { transaction });

            finalParentId = parent.id;
        }

        // 3. Créer l'élève
        const newStudent = await Student.create({
            user_id: newUser.id,
            class_id,
            parent_id: finalParentId || null,
            date_of_birth: date_of_birth || null
        }, { transaction });

        await transaction.commit();

        // Réponse avec les identifiants
        res.status(201).json({
            success: true,
            message: "Élève créé avec succès",
            student: {
                id: newStudent.id,
                user_id: newUser.id,
                first_name,
                last_name,
                email: email,
                class_id: newStudent.class_id,
                parent_id: newStudent.parent_id
            },
            credentials: {
                email: email,
                password: finalPassword
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Erreur createStudent:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur lors de la création",
            error: error.message
        });
    }
};

// PUT modifier un élève
exports.updateStudent = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const studentId = req.params.id;
        const { 
            first_name, 
            last_name, 
            email,
            class_id, 
            parent_id,
            date_of_birth,
            phone,
            is_active
        } = req.body;

        // Trouver l'élève avec son utilisateur
        const student = await Student.findByPk(studentId, { 
            include: [{ model: User, as: 'user' }], // AJOUTER L'ALIAS ICI AUSSI
            transaction 
        });
        
        if (!student) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Élève non trouvé"
            });
        }

        // Mettre à jour l'utilisateur associé
        if (student.user) {
            await student.user.update({
                first_name: first_name || student.user.first_name,
                last_name: last_name || student.user.last_name,
                email: email || student.user.email,
                phone: phone || student.user.phone,
                is_active: is_active !== undefined ? is_active : student.user.is_active
            }, { transaction });
        }

        // Mettre à jour l'élève
        await student.update({
            class_id: class_id || student.class_id,
            parent_id: parent_id !== undefined ? parent_id : student.parent_id,
            date_of_birth: date_of_birth || student.date_of_birth
        }, { transaction });

        await transaction.commit();

        res.json({
            success: true,
            message: "Élève modifié avec succès",
            student: {
                id: student.id,
                user_id: student.user_id,
                first_name: first_name || student.user?.first_name,
                last_name: last_name || student.user?.last_name,
                email: email || student.user?.email,
                class_id: student.class_id,
                parent_id: student.parent_id
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Erreur updateStudent:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
        });
    }
};

// DELETE supprimer un élève
exports.deleteStudent = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const studentId = req.params.id;

        // Trouver l'élève avec son utilisateur
        const student = await Student.findByPk(studentId, { 
            include: [{ model: User, as: 'user' }], // AJOUTER L'ALIAS ICI AUSSI
            transaction 
        });
        
        if (!student) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Élève non trouvé"
            });
        }

        // Supprimer l'élève
        await student.destroy({ transaction });

        // Supprimer l'utilisateur associé
        if (student.user) {
            await student.user.destroy({ transaction });
        }

        await transaction.commit();

        res.json({
            success: true,
            message: "Élève supprimé avec succès"
        });

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Erreur deleteStudent:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur",
            error: error.message
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
    password += "!Aa123";
    return password;
}