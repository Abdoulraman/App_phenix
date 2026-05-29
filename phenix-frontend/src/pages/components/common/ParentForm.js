import React, { useState } from 'react';

const ParentForm = ({ parent, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: parent?.first_name || '',
    last_name: parent?.last_name || '',
    email: parent?.email || '',
    phone: parent?.phone || '',
    profession: parent?.profession || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h3>Ajouter un parent</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Prénom *</label>
            <input 
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Nom *</label>
            <input 
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input 
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Profession</label>
            <input 
              type="text"
              value={formData.profession}
              onChange={(e) => setFormData({...formData, profession: e.target.value})}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Créer le parent</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default ParentForm;