import React, { useState } from 'react';
import ParentForm from '../common/ParentForm';

const ParentsTab = ({ parents, students, onAdd }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="parents-tab">
      <div className="tab-header">
        <h2>Gestion des parents</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✖ Annuler' : '➕ Nouveau parent'}
        </button>
      </div>

      {showForm && (
        <ParentForm
          onSubmit={(data) => {
            onAdd(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="parents-grid">
        {parents.map(parent => {
          const children = students.filter(s => s.parent_id === parent.id);
          return (
            <div key={parent.id} className="parent-card">
              <div className="parent-header">
                <div className="parent-avatar">
                  {parent.first_name?.[0]}{parent.last_name?.[0]}
                </div>
                <div className="parent-info">
                  <h3>{parent.first_name} {parent.last_name}</h3>
                  <p>{parent.email}</p>
                  <p>{parent.phone}</p>
                  {parent.profession && <p className="profession">{parent.profession}</p>}
                </div>
              </div>
              <div className="parent-children">
                <h4>Enfants ({children.length})</h4>
                {children.map(child => (
                  <div key={child.id} className="child-tag">
                    {child.first_name} {child.last_name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParentsTab;