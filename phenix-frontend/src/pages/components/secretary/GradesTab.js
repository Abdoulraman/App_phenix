import React, { useState } from 'react';
import DataTable from '../common/DataTable';

// Dans GradesTab.js, ajoutez en haut :

const GradesTab = ({ students, classes, subjects, teachers, grades, onAddGrade }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject_id: '',
    score: '',
    sequence: 'SEQ1',
    teacher_id: teachers?.[0]?.id || 1
  });

  const filteredStudents = selectedClass 
    ? students.filter(s => s.class_id === parseInt(selectedClass))
    : students;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddGrade({
      ...formData,
      student_id: parseInt(selectedStudent),
      score: parseFloat(formData.score),
      academic_year_id: 1
    });
    setShowForm(false);
    setFormData({ subject_id: '', score: '', sequence: 'SEQ1', teacher_id: teachers?.[0]?.id || 1 });
  };

  const columns = [
    { label: 'Élève', render: (row) => {
        const student = students.find(s => s.id === row.student_id);
        return student ? `${student.first_name} ${student.last_name}` : '-';
      }
    },
    { label: 'Matière', render: (row) => {
        const subject = subjects?.find(s => s.id === row.subject_id);
        return subject?.name || row.subject || '-';
      }
    },
    { label: 'Note', render: (row) => {
        let gradeClass = 'grade-badge';
        if (row.score >= 16) gradeClass += ' excellent';
        else if (row.score >= 12) gradeClass += ' good';
        else if (row.score >= 10) gradeClass += ' average';
        else gradeClass += ' poor';
        
        return (
          <span className={gradeClass}>
            {row.score}/20
          </span>
        );
      }
    },
    { label: 'Séquence', field: 'sequence' },
    { label: 'Date', render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : '-' }
  ];

  return (
    <div className="grades-tab">
      <div className="tab-header">
        <h2>Saisie des notes</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✖ Annuler' : '➕ Nouvelle note'}
        </button>
      </div>

      <div className="filters">
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les classes</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select 
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="filter-select"
        >
          <option value="">Sélectionner un élève</option>
          {filteredStudents.map(s => (
            <option key={s.id} value={s.id}>
              {s.first_name} {s.last_name}
            </option>
          ))}
        </select>
      </div>

      {showForm && selectedStudent && (
        <div className="form-container">
          <h3>Saisir une note</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Matière *</label>
                <select 
                  value={formData.subject_id}
                  onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                  required
                >
                  <option value="">Sélectionner</option>
                  {subjects?.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Note /20 *</label>
                <input 
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.score}
                  onChange={(e) => setFormData({...formData, score: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Séquence</label>
                <select 
                  value={formData.sequence}
                  onChange={(e) => setFormData({...formData, sequence: e.target.value})}
                >
                  <option value="SEQ1">1ère séquence</option>
                  <option value="SEQ2">2ème séquence</option>
                  <option value="SEQ3">3ème séquence</option>
                  <option value="EXAM">Examen final</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Enregistrer</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {selectedStudent ? (
        <div className="grades-list">
          <h3>Notes de l'élève</h3>
          <DataTable 
            columns={columns}
            data={grades.filter(g => g.student_id === parseInt(selectedStudent))}
          />
        </div>
      ) : (
        <DataTable 
          columns={columns}
          data={grades.slice(0, 20)}
        />
      )}
    </div>
  );
};

export default GradesTab;