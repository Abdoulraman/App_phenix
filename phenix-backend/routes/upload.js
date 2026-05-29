// routes/upload.js - VERSION COMPLÈTE AVEC GESTION DU LOGO
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

console.log('🔍 Chargement de upload.js...');

// Importer le middleware d'authentification
const { authenticate } = require('../middlewares/auth');
console.log('✅ authenticate importé, type:', typeof authenticate);

// ============================================
// GESTION DES PHOTOS D'ÉLÈVES
// ============================================

// Route pour uploader la photo d'un élève
router.post('/student-photo', authenticate, async (req, res) => {
  console.log('📸 Route /student-photo appelée');
  console.log('👤 Utilisateur authentifié:', req.user?.email);
  
  try {
    // Vérifier si des fichiers ont été uploadés
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucune photo fournie' 
      });
    }

    const photo = req.files.photo;
    const studentId = req.body.studentId;
    
    console.log(`📝 Student ID: ${studentId}, File: ${photo.name}, Size: ${photo.size} bytes`);
    
    if (!studentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de l\'élève manquant' 
      });
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(photo.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Format non supporté. Utilisez JPG, PNG, GIF ou WEBP' 
      });
    }
    
    // Vérifier la taille (max 5MB)
    if (photo.size > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image trop grande (max 5MB)' 
      });
    }

    // Chemin de destination pour les photos d'élèves
    const uploadDir = path.join(__dirname, '../../phenix-frontend/src/images/students');
    
    console.log(`📁 Dossier destination: ${uploadDir}`);
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('✅ Dossier élèves créé:', uploadDir);
    }
    
    // Déterminer l'extension
    const ext = path.extname(photo.name).toLowerCase();
    const finalExt = ext === '.jpeg' ? '.jpg' : ext;
    const filename = `student-${studentId}${finalExt}`;
    const filepath = path.join(uploadDir, filename);
    
    // Supprimer l'ancienne photo si elle existe (même ID, extension différente)
    const existingFiles = fs.readdirSync(uploadDir).filter(f => f.startsWith(`student-${studentId}.`));
    existingFiles.forEach(file => {
      const oldPath = path.join(uploadDir, file);
      fs.unlinkSync(oldPath);
      console.log(`🗑️ Ancienne photo supprimée: ${file}`);
    });
    
    // Déplacer le nouveau fichier
    await photo.mv(filepath);
    
    console.log(`✅ Photo uploadée: ${filename}`);
    
    res.json({ 
      success: true, 
      message: 'Photo téléchargée avec succès',
      filename: filename,
      path: `/images/students/${filename}`
    });
    
  } catch (error) {
    console.error('❌ Erreur upload photo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de l\'upload de la photo'
    });
  }
});

// Route pour supprimer une photo d'élève
router.delete('/student-photo/:studentId', authenticate, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    if (!studentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de l\'élève manquant' 
      });
    }

    const uploadDir = path.join(__dirname, '../../phenix-frontend/src/images/students');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({ 
        success: true, 
        message: 'Aucune photo trouvée (dossier inexistant)',
        deleted: false 
      });
    }
    
    // Chercher le fichier avec différentes extensions
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    let deleted = false;
    let deletedFilename = '';
    
    for (const ext of extensions) {
      const filename = `student-${studentId}${ext}`;
      const filepath = path.join(uploadDir, filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`🗑️ Photo supprimée: ${filename}`);
        deleted = true;
        deletedFilename = filename;
        break;
      }
    }
    
    res.json({ 
      success: true, 
      message: deleted ? 'Photo supprimée' : 'Aucune photo trouvée',
      deleted: deleted,
      filename: deletedFilename || null
    });
    
  } catch (error) {
    console.error('❌ Erreur suppression photo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la suppression de la photo'
    });
  }
});

// Route pour vérifier si une photo d'élève existe
router.get('/student-photo/:studentId', authenticate, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    if (!studentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de l\'élève manquant' 
      });
    }

    const uploadDir = path.join(__dirname, '../../phenix-frontend/src/images/students');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({ 
        success: true, 
        exists: false,
        message: 'Dossier élèves non trouvé' 
      });
    }
    
    // Chercher le fichier avec différentes extensions
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    let found = false;
    let foundFilename = '';
    
    for (const ext of extensions) {
      const filename = `student-${studentId}${ext}`;
      const filepath = path.join(uploadDir, filename);
      
      if (fs.existsSync(filepath)) {
        found = true;
        foundFilename = filename;
        break;
      }
    }
    
    res.json({ 
      success: true, 
      exists: found,
      filename: foundFilename || null,
      path: foundFilename ? `/images/students/${foundFilename}` : null
    });
    
  } catch (error) {
    console.error('❌ Erreur vérification photo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la vérification de la photo'
    });
  }
});

// ============================================
// GESTION DU LOGO
// ============================================

// Route pour uploader le logo du centre
router.post('/logo', authenticate, async (req, res) => {
  console.log('🖼️ Route /logo appelée');
  console.log('👤 Utilisateur authentifié:', req.user?.email);
  
  try {
    if (!req.files || !req.files.logo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun logo fourni' 
      });
    }

    const logo = req.files.logo;
    
    console.log(`📝 Fichier logo: ${logo.name}, Size: ${logo.size} bytes, Type: ${logo.mimetype}`);

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(logo.mimetype)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Format non supporté. Utilisez JPG, PNG, SVG, GIF ou WEBP' 
      });
    }
    
    // Vérifier la taille (max 2MB pour le logo)
    if (logo.size > 2 * 1024 * 1024) {
      return res.status(400).json({ 
        success: false, 
        message: 'Logo trop grand (max 2MB)' 
      });
    }

    // Chemin de destination pour le logo
    const logoDir = path.join(__dirname, '../../phenix-frontend/src/images/logo');
    
    console.log(`📁 Dossier logo: ${logoDir}`);
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(logoDir)) {
      fs.mkdirSync(logoDir, { recursive: true });
      console.log('✅ Dossier logo créé:', logoDir);
    }
    
    // Déterminer l'extension
    const ext = path.extname(logo.name).toLowerCase();
    // Normaliser .jpeg en .jpg
    const finalExt = ext === '.jpeg' ? '.jpg' : ext;
    const filename = `logo-phoenix${finalExt}`;
    const filepath = path.join(logoDir, filename);
    
    // Supprimer tous les anciens logos (peu importe l'extension)
    if (fs.existsSync(logoDir)) {
      const existingFiles = fs.readdirSync(logoDir).filter(f => f.startsWith('logo-phoenix'));
      existingFiles.forEach(file => {
        const oldPath = path.join(logoDir, file);
        fs.unlinkSync(oldPath);
        console.log(`🗑️ Ancien logo supprimé: ${file}`);
      });
    }
    
    // Déplacer le nouveau fichier
    await logo.mv(filepath);
    
    console.log(`✅ Logo uploadé: ${filename}`);
    
    res.json({ 
      success: true, 
      message: 'Logo téléchargé avec succès',
      filename: filename,
      path: `/images/logo/${filename}`
    });
    
  } catch (error) {
    console.error('❌ Erreur upload logo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de l\'upload du logo'
    });
  }
});

// Route pour récupérer le logo actuel (publique - pas d'authentification nécessaire)
router.get('/logo', async (req, res) => {
  try {
    const logoDir = path.join(__dirname, '../../phenix-frontend/src/images/logo');
    
    if (!fs.existsSync(logoDir)) {
      return res.json({ 
        success: true, 
        exists: false,
        message: 'Dossier logo non trouvé' 
      });
    }
    
    // Chercher le fichier logo avec différentes extensions
    const extensions = ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'];
    let found = false;
    let foundFilename = '';
    
    const files = fs.readdirSync(logoDir);
    for (const file of files) {
      if (file.startsWith('logo-phoenix')) {
        found = true;
        foundFilename = file;
        break;
      }
    }
    
    res.json({ 
      success: true, 
      exists: found,
      filename: foundFilename || null,
      path: foundFilename ? `/images/logo/${foundFilename}` : null
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération logo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la récupération du logo'
    });
  }
});

// Route pour supprimer le logo
router.delete('/logo', authenticate, async (req, res) => {
  try {
    const logoDir = path.join(__dirname, '../../phenix-frontend/src/images/logo');
    
    if (!fs.existsSync(logoDir)) {
      return res.json({ 
        success: true, 
        message: 'Aucun logo trouvé (dossier inexistant)',
        deleted: false 
      });
    }
    
    // Supprimer tous les fichiers commençant par logo-phoenix
    const files = fs.readdirSync(logoDir).filter(f => f.startsWith('logo-phoenix'));
    let deletedCount = 0;
    
    files.forEach(file => {
      const filepath = path.join(logoDir, file);
      fs.unlinkSync(filepath);
      console.log(`🗑️ Logo supprimé: ${file}`);
      deletedCount++;
    });
    
    res.json({ 
      success: true, 
      message: deletedCount > 0 ? `${deletedCount} logo(s) supprimé(s)` : 'Aucun logo trouvé',
      deleted: deletedCount > 0,
      count: deletedCount
    });
    
  } catch (error) {
    console.error('❌ Erreur suppression logo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la suppression du logo'
    });
  }
});

console.log('✅ Routes définies avec succès (élèves + logo)');

module.exports = router;