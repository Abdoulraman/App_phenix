import React, { useState, useEffect } from 'react';
import StudentForm from '../common/StudentForm';
import StudentPhoto from '../common/StudentPhoto';
import ConfirmationModal from '../common/ConfirmationModal';
import Notification from '../common/Notification';

const StudentsTab = ({ 
  students = [], 
  classes = [], 
  parents = [], 
  onAdd, 
  onUpdate, 
  onDelete, 
  searchTerm, 
  setSearchTerm, 
  generatePassword,
  API_URL 
}) => {
  // ============================================
  // FONCTIONS DE RÉCUPÉRATION DES DONNÉES
  // ============================================
  
  const getStudentFirstName = (student) => {
    return student.student_user?.first_name || student.first_name || '';
  };

  const getStudentLastName = (student) => {
    return student.student_user?.last_name || student.last_name || '';
  };

  const getStudentFullName = (student) => {
    const firstName = getStudentFirstName(student);
    const lastName = getStudentLastName(student);
    return `${firstName} ${lastName}`.trim() || 'Nom inconnu';
  };

  const getStudentEmail = (student) => {
    return student.student_user?.email || student.email || '-';
  };

  const getStudentPhone = (student) => {
    return student.student_user?.phone || student.phone || '-';
  };

  const getStudentStatus = (student) => {
    return student.student_user?.is_active;
  };

  const getClassName = (student) => {
    if (student.class?.name) return student.class.name;
    const foundClass = classes.find(c => c.id === student.class_id);
    return foundClass?.name || '-';
  };

  const getClassLevel = (student) => {
    if (student.class?.level) return student.class.level;
    const foundClass = classes.find(c => c.id === student.class_id);
    return foundClass?.level || '';
  };

  const getParentName = (student) => {
    if (student.parent?.user) {
      return `${student.parent.user.first_name || ''} ${student.parent.user.last_name || ''}`.trim();
    }
    if (student.parent) {
      return `${student.parent.first_name || ''} ${student.parent.last_name || ''}`.trim();
    }
    const parent = parents.find(p => p.id === student.parent_id);
    if (parent) {
      return `${parent.first_name || ''} ${parent.last_name || ''}`.trim();
    }
    return '-';
  };

  const getParentPhone = (student) => {
    if (student.parent?.user?.phone) return student.parent.user.phone;
    if (student.parent?.phone) return student.parent.phone;
    const parent = parents.find(p => p.id === student.parent_id);
    return parent?.phone || '-';
  };

  const getStudentPhotoPath = (student) => {
    return `${API_URL || 'http://localhost:5000'}/src/images/students/student-${student.id}.jpg`;
  };

  // ============================================
  // ÉTATS
  // ============================================
  
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byClass: {}
  });

  // ============================================
  // EFFETS
  // ============================================
  
  useEffect(() => {
    if (students.length > 0) {
      console.log('📦 Premier élève:', students[0]);
      calculateStats();
    }
  }, [students]);

  // ============================================
  // FONCTIONS DE TRAITEMENT
  // ============================================
  
  const calculateStats = () => {
    const active = students.filter(s => getStudentStatus(s) !== false).length;
    const inactive = students.length - active;
    
    const byClass = {};
    students.forEach(student => {
      const className = getClassName(student);
      byClass[className] = (byClass[className] || 0) + 1;
    });

    setStats({
      total: students.length,
      active,
      inactive,
      byClass
    });
  };

  // Vérifier que students est un tableau
  const studentsArray = Array.isArray(students) ? students : [];
  
  // Filtrer et trier les élèves
  const filteredStudents = studentsArray
    .filter(s => {
      // Filtre par recherche textuelle
      const firstName = getStudentFirstName(s).toLowerCase();
      const lastName = getStudentLastName(s).toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const email = getStudentEmail(s).toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = fullName.includes(searchLower) || 
                           email.includes(searchLower) ||
                           s.id.toString().includes(searchTerm);
      
      // Filtre par classe
      const matchesClass = !selectedClass || s.class_id === parseInt(selectedClass);
      
      // Filtre par statut
      const status = getStudentStatus(s);
      const matchesStatus = !selectedStatus || 
        (selectedStatus === 'active' && status !== false) ||
        (selectedStatus === 'inactive' && status === false);
      
      return matchesSearch && matchesClass && matchesStatus;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch(sortBy) {
        case 'name':
          aVal = `${getStudentLastName(a)} ${getStudentFirstName(a)}`;
          bVal = `${getStudentLastName(b)} ${getStudentFirstName(b)}`;
          break;
        case 'class':
          aVal = getClassName(a);
          bVal = getClassName(b);
          break;
        case 'id':
          aVal = a.id;
          bVal = b.id;
          break;
        default:
          aVal = a.id;
          bVal = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleSubmit = async (formData, id) => {
    setLoading(true);
    let result;
    
    try {
      console.log('📤 Soumission formulaire:', { id, formData });
      
      if (id) {
        // MODIFICATION
        result = await onUpdate(id, formData);
      } else {
        // CRÉATION
        result = await onAdd(formData);
      }
      
      console.log('📥 Résultat reçu:', result);
      
      if (result?.success) {
        setShowForm(false);
        setEditingStudent(null);
        showNotification('success', id ? 'Élève modifié avec succès' : 'Élève créé avec succès');
        
        // Retourner le résultat pour l'upload de photo
        return result;
      } else {
        showNotification('error', result?.message || 'Une erreur est survenue');
        return result;
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      showNotification('error', 'Erreur lors de l\'opération');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    console.log('✏️ Édition élève:', student);
    
    const studentData = {
      id: student.id,
      first_name: getStudentFirstName(student),
      last_name: getStudentLastName(student),
      email: getStudentEmail(student),
      class_id: student.class?.id || student.class_id,
      parent_id: student.parent?.id || student.parent_id,
      birth_date: student.date_of_birth,
      phone: getStudentPhone(student),
      is_active: getStudentStatus(student) !== false
    };
    
    setEditingStudent(studentData);
    setShowForm(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    
    setLoading(true);
    try {
      const result = await onDelete(studentToDelete.id);
      if (result?.success) {
        showNotification('success', 'Élève supprimé avec succès');
        setShowDeleteModal(false);
        setStudentToDelete(null);
      } else {
        showNotification('error', result?.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      showNotification('error', 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPhoto = (student) => {
    setSelectedStudent(student);
    setShowPhotoModal(true);
  };

  const closePhotoModal = () => {
    setShowPhotoModal(false);
    setSelectedStudent(null);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Classe', 'Parent', 'Statut'];
      const data = filteredStudents.map(s => [
        s.id,
        getStudentFirstName(s),
        getStudentLastName(s),
        getStudentEmail(s),
        getStudentPhone(s),
        getClassName(s),
        getParentName(s),
        getStudentStatus(s) === false ? 'Inactif' : 'Actif'
      ]);

      const csvContent = [headers, ...data]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `eleves_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('success', 'Fichier CSV exporté avec succès');
    } catch (error) {
      console.error('❌ Erreur export CSV:', error);
      showNotification('error', 'Erreur lors de l\'export CSV');
    }
  };

  // ============================================
  // RENDU
  // ============================================
  
  return (
    <div className="students-tab">
      {/* Notification */}
      {notification.show && (
        <Notification 
          type={notification.type} 
          message={notification.message}
          onClose={() => setNotification({ show: false, type: '', message: '' })}
        />
      )}

      {/* En-tête avec statistiques */}
      <div className="stats-bar" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div className="stat-card mini" style={{
          background: 'white',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '1.2rem', color: '#805ad5' }}>📊 Total</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div className="stat-card mini" style={{
          background: 'white',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '1.2rem', color: '#48bb78' }}>✅ Actifs</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.active}</div>
        </div>
        <div className="stat-card mini" style={{
          background: 'white',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '1.2rem', color: '#f56565' }}>⏸️ Inactifs</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stats.inactive}</div>
        </div>
        <div className="stat-card mini" style={{
          background: 'white',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '1.2rem', color: '#805ad5' }}>📚 Classes</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{Object.keys(stats.byClass).length}</div>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="tab-header">
        <h2>Gestion des élèves</h2>
        <div className="tab-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ minWidth: '250px' }}
          />
          
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="filter-select"
            style={{ width: '150px' }}
          >
            <option value="">Toutes classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
            style={{ width: '120px' }}
          >
            <option value="">Tous</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
            style={{ width: '120px' }}
          >
            <option value="name">Nom</option>
            <option value="class">Classe</option>
            <option value="id">ID</option>
          </select>

          <button 
            className="btn-secondary" 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{ padding: '12px' }}
          >
            {sortOrder === 'asc' ? '⬆️' : '⬇️'}
          </button>

          <button 
            className="btn-primary" 
            onClick={() => {
              setShowForm(!showForm);
              setEditingStudent(null);
            }}
          >
            {showForm ? '✖ Annuler' : '➕ Nouvel élève'}
          </button>

          <button 
            className="btn-secondary" 
            onClick={handleExportCSV}
            style={{ padding: '12px' }}
            title="Exporter en CSV"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          classes={classes}
          parents={parents}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
          generatePassword={generatePassword}
          loading={loading}
          API_URL={API_URL}
        />
      )}

      {/* Tableau des élèves */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>ID</th>
              <th>Nom complet</th>
              <th>Classe</th>
              <th>Parent</th>
              <th>Contact</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <StudentPhoto 
                      student={student}
                      size="small"
                      onClick={() => handleViewPhoto(student)}
                    />
                  </td>
                  <td>#{student.id}</td>
                  <td>
                    <strong>{getStudentFullName(student)}</strong>
                  </td>
                  <td>
                    {getClassName(student)}
                    {getClassLevel(student) && (
                      <span style={{color: '#718096', fontSize: '0.8rem', marginLeft: '5px'}}>
                        ({getClassLevel(student)})
                      </span>
                    )}
                  </td>
                  <td>
                    {getParentName(student)}
                    {student.parent && (
                      <div style={{fontSize: '0.8rem', color: '#718096'}}>
                        {getParentPhone(student)}
                      </div>
                    )}
                  </td>
                  <td>
                    <div>{getStudentEmail(student)}</div>
                    <div style={{fontSize: '0.8rem', color: '#718096'}}>{getStudentPhone(student)}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStudentStatus(student) === false ? 'inactive' : 'active'}`}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        background: getStudentStatus(student) === false ? '#fed7d7' : '#c6f6d5',
                        color: getStudentStatus(student) === false ? '#f56565' : '#38a169'
                      }}>
                      {getStudentStatus(student) === false ? 'Inactif' : 'Actif'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="icon-btn" 
                      onClick={() => handleEdit(student)} 
                      title="Modifier"
                      disabled={loading}
                    >
                      ✏️
                    </button>
                    <button 
                      className="icon-btn" 
                      onClick={() => handleDeleteClick(student)} 
                      title="Supprimer"
                      disabled={loading}
                    >
                      🗑️
                    </button>
                    <button 
                      className="icon-btn" 
                      onClick={() => handleViewPhoto(student)} 
                      title="Voir la photo"
                    >
                      📸
                    </button>
                    <button 
                      className="icon-btn" 
                      onClick={() => window.open(`/student-card/${student.id}`, '_blank')} 
                      title="Carte scolaire"
                    >
                      🪪
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  {studentsArray.length === 0 ? (
                    <div style={{padding: '40px', textAlign: 'center'}}>
                      <p style={{marginBottom: '20px', fontSize: '1.1rem', color: '#718096'}}>
                        📭 Aucun élève trouvé
                      </p>
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          setShowForm(true);
                          setEditingStudent(null);
                        }}
                      >
                        ➕ Ajouter un élève
                      </button>
                    </div>
                  ) : (
                    <p style={{color: '#718096'}}>Aucun élève ne correspond aux filtres</p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pied de tableau */}
      {filteredStudents.length > 0 && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#f8fafc',
          borderRadius: '10px',
          color: '#4a5568',
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>{filteredStudents.length}</strong> élève(s) affiché(s)
            {filteredStudents.length !== studentsArray.length && (
              <span> sur <strong>{studentsArray.length}</strong> total</span>
            )}
          </div>
          <div>
            <button 
              className="btn-secondary" 
              style={{ padding: '5px 10px', fontSize: '0.8rem', marginRight: '10px' }}
              onClick={() => window.print()}
            >
              🖨️ Imprimer
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && studentToDelete && (
        <ConfirmationModal
          title="Supprimer l'élève"
          message={`Êtes-vous sûr de vouloir supprimer ${getStudentFullName(studentToDelete)} ?`}
          warning="Cette action supprimera également son compte utilisateur et toutes ses données associées (notes, paiements, présences)."
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setStudentToDelete(null);
          }}
          loading={loading}
        />
      )}

      {/* Modal pour afficher la photo en grand */}
      {showPhotoModal && selectedStudent && (
        <div className="modal-overlay" onClick={closePhotoModal}>
          <div className="modal-container" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{getStudentFullName(selectedStudent)}</h3>
              <button className="modal-close" onClick={closePhotoModal}>✖</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                width: '300px',
                height: '300px',
                margin: '0 auto',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '3px solid #805ad5',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}>
                <img 
                  src={getStudentPhotoPath(selectedStudent)}
                  alt={getStudentFullName(selectedStudent)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `
                      <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #805ad5, #6b46c1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 80px;
                        font-weight: bold;
                      ">
                        ${getStudentFirstName(selectedStudent)[0] || ''}${getStudentLastName(selectedStudent)[0] || ''}
                      </div>
                    `;
                  }}
                />
              </div>
              <p style={{ marginTop: '20px', color: '#4a5568' }}>
                <strong>ID:</strong> {selectedStudent.id} | <strong>Classe:</strong> {getClassName(selectedStudent)}
              </p>
              <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                📧 {getStudentEmail(selectedStudent)} | 📞 {getStudentPhone(selectedStudent)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsTab;