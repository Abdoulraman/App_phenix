require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Ajoutez cette ligne
const path = require('path');
const sequelize = require('./config/db');

// IMPORTANT: Charger les modèles avant les routes
const models = require('./models');

const app = express();

// ============================================
// MIDDLEWARES
// ============================================

// Configuration CORS
app.use(cors());

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de fileUpload pour les images
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    abortOnLimit: true,
    responseOnLimit: 'Fichier trop volumineux (max 5MB)',
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// Servir les fichiers statiques du frontend
// Important: Ce chemin doit correspondre à votre structure
app.use('/images', express.static(path.join(__dirname, '../phenix-frontend/public/images')));

// Alternative: Si vous utilisez src/images (développement)
app.use('/src/images', express.static(path.join(__dirname, '../phenix-frontend/src/images')));

// ============================================
// ROUTES API
// ============================================

// Routes d'upload (doivent venir avant les autres routes)
app.use('/api/upload', require('./routes/upload'));

// Autres routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/login', require('./routes/login'));
app.use('/api/students', require('./routes/students'));
app.use('/api/parents', require('./routes/parents'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/stats', require('./routes/stats'));

// ============================================
// ROUTE TEST
// ============================================
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 Backend Centre Phénix actif !',
        endpoints: {
            upload: '/api/upload',
            students: '/api/students',
            parents: '/api/parents',
            login: '/api/login'
        }
    });
});

// ============================================
// CONNEXION BASE DE DONNÉES
// ============================================
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connexion DB établie !');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('✅ Modèles synchronisés avec la DB');
    })
    .catch((err) => {
        console.error('❌ Erreur DB :', err);
    });

// ============================================
// MIDDLEWARE GLOBAL D'ERREURS
// ============================================
app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err.stack);
    res.status(500).json({ 
        success: false,
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ============================================
// DÉMARRAGE SERVEUR
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Images servies depuis: ${path.join(__dirname, '../phenix-frontend/public/images')}`);
    console.log(`📤 Endpoint upload: http://localhost:${PORT}/api/upload`);
});