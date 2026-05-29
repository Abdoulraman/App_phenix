import React, { useState, useEffect } from 'react';

const LogoUploader = ({ onLogoChange }) => {
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Charger le logo actuel au montage
  useEffect(() => {
    fetchCurrentLogo();
  }, []);

  const fetchCurrentLogo = async () => {
    try {
      const res = await fetch(`${API_URL}/api/upload/logo`);
      const data = await res.json();
      
      if (data.success && data.exists) {
        setCurrentLogo(data.path);
        if (onLogoChange) onLogoChange(data.path);
      }
    } catch (error) {
      console.error('❌ Erreur chargement logo:', error);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!logo) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('logo', logo);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/upload/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Logo mis à jour avec succès !');
        setCurrentLogo(data.path);
        if (onLogoChange) onLogoChange(data.path);
        setLogo(null);
        setLogoPreview(null);
      } else {
        alert('❌ Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="logo-uploader" style={{
      padding: '20px',
      background: '#f8fafc',
      borderRadius: '10px',
      border: '2px dashed #805ad5',
      textAlign: 'center'
    }}>
      <h4 style={{ marginBottom: '15px', color: '#2d3748' }}>
        🖼️ Logo du centre
      </h4>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
        {/* Aperçu du logo actuel ou nouveau */}
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '10px',
          background: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '2px solid #805ad5'
        }}>
          {logoPreview ? (
            <img 
              src={logoPreview} 
              alt="Nouveau logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : currentLogo ? (
            <img 
              src={currentLogo} 
              alt="Logo actuel" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ fontSize: '40px', color: '#a0aec0' }}>🏫</span>
          )}
        </div>

        {/* Boutons */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ display: 'none' }}
            id="logo-input"
          />
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => document.getElementById('logo-input').click()}
            >
              {logoPreview ? '🔄 Changer' : '📁 Choisir un logo'}
            </button>
            
            {logoPreview && (
              <button
                type="button"
                className="btn-success"
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                {uploading ? '⏳ Upload...' : '💾 Enregistrer'}
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '10px' }}>
            Formats: JPG, PNG, SVG (max 2MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoUploader;