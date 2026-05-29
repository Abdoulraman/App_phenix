// scripts/seedStudents.js
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { User, Student, Parent, Class } = require('../models');

// Données de test
const classes = [
    { id: 1, name: '6ème A' },
    { id: 2, name: '6ème B' },
    { id: 3, name: '5ème A' },
    { id: 4, name: '5ème B' },
    { id: 5, name: '4ème A' },
    { id: 6, name: '4ème B' },
    { id: 7, name: '3ème A' },
    { id: 8, name: '3ème B' },
    { id: 9, name: 'Seconde C' },
    { id: 10, name: 'Première D' }
];

// Noms et prénoms pour générer des données réalistes
const firstNames = [
    'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Kevin', 'Laura', 'Mike', 'Nancy', 'Oscar', 'Patricia', 'Quentin', 'Rachel', 'Steve', 'Tina',
    'Ulysses', 'Victoria', 'Walter', 'Xena', 'Yannick', 'Zoe', 'Adam', 'Brigitte', 'Christian', 'Danielle',
    'Emmanuel', 'Françoise', 'Gérard', 'Hélène', 'Isabelle', 'Jacques', 'Karine', 'Laurent', 'Monique', 'Nicolas',
    'Olivier', 'Pascale', 'Quentin', 'René', 'Sophie', 'Thierry', 'Ursule', 'Véronique', 'William', 'Xavier',
    'Yves', 'Agnès', 'Benoît', 'Catherine', 'Didier', 'Élodie', 'Fabien', 'Gaëlle', 'Hervé', 'Irène'
];

const lastNames = [
    'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
    'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier',
    'Morel', 'Girard', 'Andre', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'Francois', 'Martinez',
    'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas',
    'Perrin', 'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin'
];

const professions = [
    'Enseignant', 'Médecin', 'Ingénieur', 'Avocat', 'Commerçant', 'Fonctionnaire',
    'Infirmier', 'Architecte', 'Consultant', 'Entrepreneur', 'Banquier', 'Journaliste',
    'Artiste', 'Agriculteur', 'Policier', 'Pompier', 'Pharmacien', 'Dentiste',
    'Informaticien', 'Électricien', 'Plombier', 'Chauffeur', 'Secrétaire', 'Comptable'
];

const domains = [
    'gmail.com', 'yahoo.fr', 'hotmail.com', 'outlook.com', 'orange.fr',
    'live.fr', 'icloud.com', 'bbox.fr', 'free.fr', 'laposte.net'
];

// Fonction pour générer un email
function generateEmail(firstName, lastName) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const random = Math.floor(Math.random() * 100);
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${random}@${domain}`;
}

// Fonction pour générer un numéro de téléphone
function generatePhone() {
    const prefixes = ['6', '2', '3'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let number = prefix;
    for (let i = 0; i < 8; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

// Fonction pour générer une date de naissance aléatoire pour un élève
function generateBirthDate(level) {
    const now = new Date();
    let minAge, maxAge;
    
    switch(level) {
        case '6ème': minAge = 10; maxAge = 12; break;
        case '5ème': minAge = 11; maxAge = 13; break;
        case '4ème': minAge = 12; maxAge = 14; break;
        case '3ème': minAge = 13; maxAge = 15; break;
        case 'Seconde': minAge = 14; maxAge = 16; break;
        case 'Première': minAge = 15; maxAge = 17; break;
        default: minAge = 10; maxAge = 18;
    }
    
    const age = minAge + Math.floor(Math.random() * (maxAge - minAge + 1));
    const year = now.getFullYear() - age;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    
    return new Date(year, month, day);
}

// Fonction pour créer un parent
async function createParent(transaction) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = generateEmail(firstName, lastName);
    const password = await bcrypt.hash('password123', 10);
    const phone = generatePhone();
    const profession = professions[Math.floor(Math.random() * professions.length)];

    // Créer l'utilisateur parent
    const user = await User.create({
        role_id: 4, // PARENT
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone: phone,
        is_active: true
    }, { transaction });

    // Créer l'entrée dans la table parents
    const parent = await Parent.create({
        user_id: user.id,
        profession: profession
    }, { transaction });

    return { user, parent };
}

// Fonction principale pour créer les élèves
async function seedStudents() {
    const transaction = await User.sequelize.transaction();
    
    try {
        console.log('🌱 Début du seeding des élèves...\n');

        // Récupérer les classes existantes
        const existingClasses = await Class.findAll({ transaction });
        
        if (existingClasses.length === 0) {
            console.log('❌ Aucune classe trouvée. Veuillez d\'abord créer les classes.');
            return;
        }

        console.log(`📚 ${existingClasses.length} classes trouvées\n`);

        let totalStudents = 0;
        let totalParents = 0;

        // Pour chaque classe, créer 10 élèves
        for (const cls of existingClasses) {
            console.log(`📖 Classe: ${cls.name} (ID: ${cls.id})`);
            
            // Créer 10 élèves par classe
            for (let i = 1; i <= 10; i++) {
                // Créer un parent pour chaque élève
                const { user: parentUser, parent } = await createParent(transaction);
                totalParents++;

                // Générer les données de l'élève
                const studentFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const studentLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const studentEmail = generateEmail(studentFirstName, studentLastName);
                const studentPassword = await bcrypt.hash('password123', 10);
                const studentPhone = generatePhone();
                const birthDate = generateBirthDate(cls.name.split(' ')[0]);

                // Créer l'utilisateur élève
                const studentUser = await User.create({
                    role_id: 5, // STUDENT
                    first_name: studentFirstName,
                    last_name: studentLastName,
                    email: studentEmail,
                    password: studentPassword,
                    phone: studentPhone,
                    is_active: true
                }, { transaction });

                // Créer l'élève
                const student = await Student.create({
                    user_id: studentUser.id,
                    class_id: cls.id,
                    parent_id: parent.id,
                    date_of_birth: birthDate
                }, { transaction });

                totalStudents++;

                console.log(`   ✅ Élève ${i}: ${studentFirstName} ${studentLastName} -> Parent: ${parentUser.first_name} ${parentUser.lastName}`);
            }
            console.log(''); // Ligne vide entre les classes
        }

        await transaction.commit();

        console.log('🎉 Seeding terminé avec succès !');
        console.log(`📊 Résumé:`);
        console.log(`   - Classes: ${existingClasses.length}`);
        console.log(`   - Élèves créés: ${totalStudents}`);
        console.log(`   - Parents créés: ${totalParents}`);
        console.log(`   - Total utilisateurs: ${totalStudents + totalParents}`);

    } catch (error) {
        await transaction.rollback();
        console.error('❌ Erreur lors du seeding:', error);
    }
}

// Exécuter le script
if (require.main === module) {
    seedStudents().then(() => {
        console.log('\n✨ Script terminé');
        process.exit(0);
    }).catch(error => {
        console.error('💥 Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = seedStudents;