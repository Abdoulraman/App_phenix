import React, { useState, useEffect } from 'react';

const PaymentForm = ({ students = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    payment_type: 'SCOLARITE',
    payment_method: 'ESPECES',
    payment_date: new Date().toISOString().split('T')[0]
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Filtrer les élèves en fonction de la recherche
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = students.filter(student => {
        const firstName = student.student_user?.first_name || student.first_name || '';
        const lastName = student.student_user?.last_name || student.last_name || '';
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        const className = student.class?.name?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || 
               className.includes(searchLower) ||
               student.id.toString().includes(searchTerm);
      }).slice(0, 10); // Limiter à 10 résultats
      
      setFilteredStudents(filtered);
      setShowDropdown(true);
    } else {
      setFilteredStudents([]);
      setShowDropdown(false);
    }
  }, [searchTerm, students]);

  // Sélectionner un élève
  const selectStudent = (student) => {
    setFormData({ ...formData, student_id: student.id });
    const fullName = getStudentFullName(student);
    setSearchTerm(`${fullName} - ${student.class?.name || ''}`);
    setShowDropdown(false);
  };

  // Obtenir le nom complet de l'élève
  const getStudentFullName = (student) => {
    if (student.student_user) {
      return `${student.student_user.first_name} ${student.student_user.last_name}`;
    }
    return `${student.first_name || ''} ${student.last_name || ''}`.trim();
  };

  // Obtenir la classe de l'élève
  const getStudentClass = (student) => {
    return student.class?.name || '-';
  };

  // Types de paiement
  const paymentTypes = [
    { value: 'SCOLARITE', label: 'Scolarité', icon: '📚' },
    { value: 'INSCRIPTION', label: 'Inscription', icon: '📝' },
    { value: 'TRANSPORT', label: 'Transport', icon: '🚌' },
    { value: 'CANTINE', label: 'Cantine', icon: '🍽️' },
    { value: 'UNIFORME', label: 'Uniforme', icon: '👔' },
    { value: 'LIVRES', label: 'Livres', icon: '📖' },
    { value: 'ACTIVITES', label: 'Activités', icon: '⚽' },
    { value: 'AUTRE', label: 'Autre', icon: '📌' }
  ];

  // Modes de paiement
  const paymentMethods = [
    { value: 'ESPECES', label: 'Espèces', icon: '💵' },
    { value: 'ORANGE_MONEY', label: 'Orange Money', icon: '📱' },
    { value: 'MTN_MOMO', label: 'MTN MoMo', icon: '📱' },
    { value: 'CHEQUE', label: 'Chèque', icon: '📄' },
    { value: 'VIREMENT', label: 'Virement', icon: '🏦' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.student_id) {
      alert('Veuillez sélectionner un élève');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) < 100) {
      alert('Veuillez saisir un montant valide (minimum 100 FCFA)');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="form-container">
      <h3>💰 Enregistrer un paiement</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Section Recherche d'élève */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>🔍 Rechercher un élève *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Tapez le nom de l'élève ou son ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="search-input"
                autoComplete="off"
              />
              
              {/* Dropdown des résultats */}
              {showDropdown && filteredStudents.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {filteredStudents.map(student => (
                    <div
                      key={student.id}
                      onClick={() => selectStudent(student)}
                      style={{
                        padding: '12px 15px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #e2e8f0',
                        transition: 'background 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{getStudentFullName(student)}</strong>
                          <span style={{ color: '#718096', marginLeft: '10px', fontSize: '0.9rem' }}>
                            #{student.id}
                          </span>
                        </div>
                        <span style={{ 
                          background: '#805ad5', 
                          color: 'white', 
                          padding: '3px 10px', 
                          borderRadius: '15px',
                          fontSize: '0.8rem'
                        }}>
                          {getStudentClass(student)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showDropdown && filteredStudents.length === 0 && searchTerm.length >= 2 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                  color: '#718096'
                }}>
                  Aucun élève trouvé
                </div>
              )}
            </div>
          </div>

          {/* Montant */}
          <div className="form-group">
            <label>💰 Montant (FCFA) *</label>
            <input
              type="number"
              min="100"
              step="100"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="Ex: 25000"
              required
              style={{ fontSize: '1.1rem', fontWeight: 'bold' }}
            />
          </div>

          {/* Type de paiement */}
          <div className="form-group">
            <label>📋 Type de paiement</label>
            <select
              value={formData.payment_type}
              onChange={(e) => setFormData({...formData, payment_type: e.target.value})}
              style={{ fontSize: '1rem' }}
            >
              {paymentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mode de paiement */}
          <div className="form-group">
            <label>💳 Mode de paiement</label>
            <select
              value={formData.payment_method}
              onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
              style={{ fontSize: '1rem' }}
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.icon} {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date de paiement */}
          <div className="form-group">
            <label>📅 Date de paiement</label>
            <input
              type="date"
              value={formData.payment_date}
              onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Résumé de la transaction */}
        {formData.student_id && formData.amount && (
          <div style={{
            background: '#f8fafc',
            padding: '15px',
            borderRadius: '10px',
            marginTop: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{ marginBottom: '10px', color: '#2d3748' }}>📋 Résumé de la transaction</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div><strong>Élève:</strong> {searchTerm}</div>
              <div><strong>Montant:</strong> {parseInt(formData.amount).toLocaleString()} FCFA</div>
              <div><strong>Type:</strong> {paymentTypes.find(t => t.value === formData.payment_type)?.icon} {formData.payment_type}</div>
              <div><strong>Mode:</strong> {paymentMethods.find(m => m.value === formData.payment_method)?.icon} {formData.payment_method.replace('_', ' ')}</div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
            💾 Confirmer le paiement
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;