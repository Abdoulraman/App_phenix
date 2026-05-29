// src/components/common/StudentForm.js
import React, { useState, useRef, useEffect } from 'react';

const StudentForm = ({ 
  student, 
  classes = [], 
  parents = [], 
  onSubmit, 
  onCancel, 
  generatePassword,
  loading = false,
  API_URL = 'http://localhost:5000'
}) => {
  const [formData, setFormData] = useState({
    first_name: student?.first_name || '',
    last_name: student?.last_name || '',
    email: student?.email || '',
    password: '',
    class_id: student?.class_id || '',
    parent_id: student?.parent_id || '',
    birth_date: student?.birth_date?.split('T')[0] || '',
    phone: student?.phone || '',
    is_active: student?.is_active !== undefined ? student.is_active : true,
    createNewParent: false,
    newParent: {
      first_name: '', 
      last_name: '', 
      email: '', 
      phone: '', 
      profession: ''
    }
  });

  const [createNewParent, setCreateNewParent] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  // Si c'est une modification, charger la photo existante
  useEffect(() => {
    if (student?.id) {
      const checkExistingPhoto = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/api/upload/student-photo/${student.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.exists) {
            setPhotoPreview(`${API_URL}${data.path}`);
          }
        } catch (error) {
          console.error('Erreur vérification photo:', error);
        }
      };
      checkExistingPhoto();
    }
  }, [student?.id, API_URL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNewParentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      newParent: { ...prev.newParent, [name]: value }
    }));
  };

  // Gérer la sélection de photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 2MB');
        return;
      }

      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Upload de la photo
  const uploadPhoto = async (studentId) => {
    if (!photoFile) return { success: true };

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('studentId', studentId);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/upload/student-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 1000);
        return { success: true, filename: data.filename };
      } else {
        throw new Error(data.message || 'Erreur upload');
      }
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      return { success: false, error: error.message };
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation de base
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.class_id) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Préparer les données pour l'envoi
    const submitData = { 
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      class_id: parseInt(formData.class_id),
      date_of_birth: formData.birth_date || null,
      phone: formData.phone || null
    };

    // Ajouter parent_id seulement si sélectionné
    if (formData.parent_id && !createNewParent) {
      submitData.parent_id = parseInt(formData.parent_id);
    }

    // Ajouter le mot de passe seulement pour la création
    if (!student) {
      submitData.password = formData.password || generatePassword();
    }

    // Ajouter le statut pour la modification
    if (student) {
      submitData.is_active = formData.is_active;
    }

    // Ajouter les données du nouveau parent si nécessaire
    if (createNewParent && formData.newParent.first_name && formData.newParent.last_name && formData.newParent.email) {
      submitData.createNewParent = true;
      submitData.newParent = {
        first_name: formData.newParent.first_name,
        last_name: formData.newParent.last_name,
        email: formData.newParent.email,
        phone: formData.newParent.phone || null,
        profession: formData.newParent.profession || null
      };
    }
    
    console.log('📤 Données envoyées:', submitData);
    
    // Soumettre le formulaire
    const result = await onSubmit(submitData, student?.id);
    console.log('📥 Résultat reçu:', result);
    
    // Gérer l'upload de photo
    if (result?.success && photoFile) {
      const studentId = result.studentId || student?.id;
      if (studentId) {
        const uploadResult = await uploadPhoto(studentId);
        
        if (uploadResult?.success) {
          alert(`✅ Opération réussie !\n📸 Photo ${student ? 'mise à jour' : 'téléchargée'}`);
        } else {
          alert(`✅ Opération réussie mais la photo n'a pas pu être ${student ? 'mise à jour' : 'téléchargée'}.`);
        }
      }
    } else if (result?.success) {
      alert(`✅ Opération réussie !`);
    }
  };

  return (
    <div className="form-container">
      <h3>{student ? 'Modifier' : 'Ajouter'} un élève</h3>
      
      {/* Section Photo */}
      <div className="photo-upload-section" style={{
        marginBottom: '20px',
        padding: '20px',
        background: '#f8fafc',
        borderRadius: '10px',
        border: '2px dashed #805ad5',
        textAlign: 'center'
      }}>
        <h4 style={{ marginBottom: '15px', color: '#2d3748' }}>
          📸 Photo de l'élève
        </h4>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '10px',
            background: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '2px solid #805ad5'
          }}>
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Prévisualisation" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '48px', color: '#a0aec0' }}>📷</span>
            )}
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              style={{ display: 'none' }}
              id="student-photo-input"
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '8px 15px' }}
                disabled={isUploading}
              >
                {photoPreview ? '🔄 Changer' : '📷 Choisir une photo'}
              </button>
              {photoPreview && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleRemovePhoto}
                  style={{ padding: '8px 15px' }}
                  disabled={isUploading}
                >
                  🗑️ Supprimer
                </button>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '10px' }}>
              Formats: JPG, PNG, GIF (max 2MB)
            </p>
          </div>
        </div>

        {isUploading && (
          <div style={{ marginTop: '15px' }}>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              background: '#e2e8f0', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${uploadProgress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #805ad5, #6b46c1)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Prénom *</label>
            <input 
              type="text" 
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={loading || isUploading}
            />
          </div>

          <div className="form-group">
            <label>Nom *</label>
            <input 
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              disabled={loading || isUploading}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading || isUploading}
            />
          </div>

          {!student && (
            <div className="form-group">
              <label>Mot de passe</label>
              <input 
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Laisser vide pour générer"
                disabled={loading || isUploading}
              />
            </div>
          )}

          {student && (
            <div className="form-group">
              <label>Statut</label>
              <select
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
                disabled={loading || isUploading}
              >
                <option value={true}>Actif</option>
                <option value={false}>Inactif</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Classe *</label>
            <select 
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              required
              disabled={loading || isUploading}
            >
              <option value="">Sélectionner</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date naissance</label>
            <input 
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              disabled={loading || isUploading}
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading || isUploading}
            />
          </div>
        </div>

        {!student && (
          <div className="form-group full-width">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={createNewParent}
                onChange={(e) => {
                  setCreateNewParent(e.target.checked);
                  setFormData({...formData, createNewParent: e.target.checked});
                }}
                disabled={loading || isUploading}
              />
              <span>Créer un nouveau parent</span>
            </label>
          </div>
        )}

        {!student && !createNewParent && (
          <div className="form-group">
            <label>Parent existant</label>
            <select 
              name="parent_id"
              value={formData.parent_id}
              onChange={handleChange}
              disabled={loading || isUploading}
            >
              <option value="">Aucun parent</option>
              {parents.map(p => (
                <option key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {createNewParent && !student && (
          <div className="new-parent-section" style={{
            marginTop: '20px',
            padding: '20px',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginBottom: '15px', color: '#2d3748' }}>Informations du parent</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Prénom *</label>
                <input 
                  type="text"
                  name="first_name"
                  value={formData.newParent.first_name}
                  onChange={handleNewParentChange}
                  required
                  disabled={loading || isUploading}
                />
              </div>
              <div className="form-group">
                <label>Nom *</label>
                <input 
                  type="text"
                  name="last_name"
                  value={formData.newParent.last_name}
                  onChange={handleNewParentChange}
                  required
                  disabled={loading || isUploading}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.newParent.email}
                  onChange={handleNewParentChange}
                  required
                  disabled={loading || isUploading}
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.newParent.phone}
                  onChange={handleNewParentChange}
                  disabled={loading || isUploading}
                />
              </div>
              <div className="form-group">
                <label>Profession</label>
                <input 
                  type="text"
                  name="profession"
                  value={formData.newParent.profession}
                  onChange={handleNewParentChange}
                  disabled={loading || isUploading}
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || isUploading}
          >
            {loading || isUploading ? '⏳ Traitement...' : (student ? 'Mettre à jour' : 'Créer')}
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onCancel} 
            disabled={loading || isUploading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;