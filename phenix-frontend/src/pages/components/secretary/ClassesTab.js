import React, { useState } from 'react';

const ClassesTab = ({ classes, students, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    academic_year_id: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setShowForm(false);
    setFormData({ name: '', level: '', academic_year_id: 1 });
  };

  return (
    <div className="classes-tab">
      <div className="tab-header">
        <h2>Gestion des classes</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✖ Annuler' : '➕ Nouvelle classe'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>Ajouter une classe</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nom *</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: 6ème A"
                  required
                />
              </div>
              <div className="form-group">
                <label>Niveau *</label>
                <select 
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="6ème">6ème</option>
                  <option value="5ème">5ème</option>
                  <option value="4ème">4ème</option>
                  <option value="3ème">3ème</option>
                  <option value="2nde">2nde</option>
                  <option value="1ère">1ère</option>
                  <option value="Tle">Terminale</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Créer</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="classes-grid">
        {classes.map(cls => {
          const classStudents = students.filter(s => s.class_id === cls.id);
          return (
            <div key={cls.id} className="class-card">
              <div className="class-header">
                <h3>{cls.name}</h3>
                <span className="class-level">{cls.level}</span>
              </div>
              <div className="class-info">
                <p>🎓 {classStudents.length} élèves</p>
              </div>
              <div className="class-actions">
                <button className="action-btn">✏️ Modifier</button>
                <button 
                  className="action-btn delete"
                  onClick={() => onDelete && onDelete(cls.id)}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassesTab;