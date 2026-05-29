// ParentDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [parentInfo, setParentInfo] = useState(null);
  const [children, setChildren] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showChildDetails, setShowChildDetails] = useState(false);

  // Données simulées - À remplacer par des appels API réels
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      // Vérifier que c'est bien un PARENT (role_id = 4)
      if (userData.role_id !== 4) {
        navigate('/dashboard');
        return;
      }
      setUser(userData);
      
      // Simuler le chargement des données du parent
      setTimeout(() => {
        setParentInfo({
          id: 1,
          user_id: userData.id,
          profession: 'Ingénieur',
          phone: userData.phone,
          email: userData.email,
          address: 'Yaoundé, Cameroun'
        });

        setChildren([
          {
            id: 1,
            first_name: 'Thomas',
            last_name: 'Martin',
            class_id: 3,
            class_name: '3ème A',
            date_of_birth: '2010-05-15',
            age: 14,
            avatar: '👦',
            grades: [
              { subject: 'Mathématiques', grade: 15.5, teacher: 'M. Dupont', date: '2024-03-01' },
              { subject: 'Français', grade: 14.0, teacher: 'Mme Martin', date: '2024-02-28' },
              { subject: 'Anglais', grade: 16.5, teacher: 'Mme Bernard', date: '2024-02-27' },
              { subject: 'Physique', grade: 13.5, teacher: 'M. Durand', date: '2024-02-26' },
              { subject: 'Histoire', grade: 15.0, teacher: 'Mme Petit', date: '2024-02-25' }
            ],
            average: 14.9,
            attendance: 95,
            homework: [
              { subject: 'Mathématiques', description: 'Exercices page 45', due: '2024-03-05', status: 'pending' },
              { subject: 'Français', description: 'Rédaction', due: '2024-03-06', status: 'completed' }
            ],
            schedule: [
              { day: 'Lundi', courses: ['Mathématiques', 'Français', 'Anglais'] },
              { day: 'Mardi', courses: ['Physique', 'Histoire', 'EPS'] },
              { day: 'Mercredi', courses: ['Mathématiques', 'Anglais'] },
              { day: 'Jeudi', courses: ['Français', 'Physique', 'Histoire'] },
              { day: 'Vendredi', courses: ['Mathématiques', 'Anglais', 'EPS'] }
            ],
            payments: [
              { month: 'Janvier 2024', amount: 75000, status: 'paid', date: '2024-01-05' },
              { month: 'Février 2024', amount: 75000, status: 'paid', date: '2024-02-03' },
              { month: 'Mars 2024', amount: 75000, status: 'pending', date: null }
            ]
          },
          {
            id: 2,
            first_name: 'Emma',
            last_name: 'Martin',
            class_id: 5,
            class_name: '5ème B',
            date_of_birth: '2012-08-22',
            age: 12,
            avatar: '👧',
            grades: [
              { subject: 'Mathématiques', grade: 16.0, teacher: 'Mme Petit', date: '2024-03-01' },
              { subject: 'Français', grade: 15.5, teacher: 'M. Martin', date: '2024-02-28' },
              { subject: 'Anglais', grade: 17.0, teacher: 'Mme Bernard', date: '2024-02-27' },
              { subject: 'Sciences', grade: 14.5, teacher: 'M. Durand', date: '2024-02-26' }
            ],
            average: 15.8,
            attendance: 98,
            homework: [
              { subject: 'Mathématiques', description: 'Exercices page 30', due: '2024-03-04', status: 'pending' }
            ],
            schedule: [
              { day: 'Lundi', courses: ['Mathématiques', 'Français', 'Sciences'] },
              { day: 'Mardi', courses: ['Anglais', 'Histoire', 'EPS'] },
              { day: 'Mercredi', courses: ['Mathématiques', 'Anglais'] },
              { day: 'Jeudi', courses: ['Français', 'Sciences', 'Arts'] },
              { day: 'Vendredi', courses: ['Mathématiques', 'Anglais', 'EPS'] }
            ],
            payments: [
              { month: 'Janvier 2024', amount: 65000, status: 'paid', date: '2024-01-05' },
              { month: 'Février 2024', amount: 65000, status: 'paid', date: '2024-02-03' },
              { month: 'Mars 2024', amount: 65000, status: 'paid', date: '2024-03-01' }
            ]
          }
        ]);

        setLoading(false);
      }, 1000);

    } catch (e) {
      console.error('Erreur:', e);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="parent-dashboard">
      {/* Sidebar */}
      <div className="parent-sidebar">
        <div className="sidebar-header">
          <div className="parent-avatar">
            <span>👨‍👩‍👧‍👦</span>
          </div>
          <div className="parent-info">
            <h3>{user?.full_name || 'Parent'}</h3>
            <p>{parentInfo?.profession || 'Parent d\'élève'}</p>
            <span className="badge parent-badge">PARENT</span>
          </div>
        </div>

        <div className="parent-stats-mini">
          <div className="stat">
            <span className="stat-value">{children.length}</span>
            <span className="stat-label">Enfants</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {children.reduce((sum, child) => sum + (child.payments?.filter(p => p.status === 'pending').length || 0), 0)}
            </span>
            <span className="stat-label">Paiements</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span>Vue d'ensemble</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'children' ? 'active' : ''}`}
            onClick={() => setActiveTab('children')}
          >
            <span className="nav-icon">👧👦</span>
            <span>Mes enfants</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => setActiveTab('grades')}
          >
            <span className="nav-icon">📝</span>
            <span>Notes</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <span className="nav-icon">📋</span>
            <span>Présences</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <span className="nav-icon">📅</span>
            <span>Emploi du temps</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'homework' ? 'active' : ''}`}
            onClick={() => setActiveTab('homework')}
          >
            <span className="nav-icon">📚</span>
            <span>Devoirs</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span className="nav-icon">💰</span>
            <span>Paiements</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'communications' ? 'active' : ''}`}
            onClick={() => setActiveTab('communications')}
          >
            <span className="nav-icon">💬</span>
            <span>Communications</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="parent-main">
        {/* Header */}
        <div className="main-header">
          <div>
            <h1>Espace Parent</h1>
            <p className="welcome-text">Bonjour {user?.first_name}, voici le suivi de vos enfants</p>
          </div>
          <div className="header-actions">
            <div className="date">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <button className="notification-btn">
              <span>🔔</span>
              <span className="badge">2</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="content-area">
          {activeTab === 'overview' && (
            <OverviewTab 
              children={children}
              formatCurrency={formatCurrency}
              onSelectChild={(child) => {
                setSelectedChild(child);
                setShowChildDetails(true);
              }}
            />
          )}
          
          {activeTab === 'children' && (
            <ChildrenTab 
              children={children}
              onSelectChild={(child) => {
                setSelectedChild(child);
                setShowChildDetails(true);
              }}
            />
          )}
          
          {activeTab === 'grades' && (
            <GradesTab children={children} />
          )}
          
          {activeTab === 'attendance' && (
            <AttendanceTab children={children} />
          )}
          
          {activeTab === 'schedule' && (
            <ScheduleTab children={children} />
          )}
          
          {activeTab === 'homework' && (
            <HomeworkTab children={children} />
          )}
          
          {activeTab === 'payments' && (
            <PaymentsTab 
              children={children}
              formatCurrency={formatCurrency}
            />
          )}
          
          {activeTab === 'communications' && (
            <CommunicationsTab />
          )}
        </div>
      </div>

      {/* Modal Détails Enfant */}
      {showChildDetails && selectedChild && (
        <ChildDetailsModal 
          child={selectedChild}
          onClose={() => setShowChildDetails(false)}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

// ==================== OVERVIEW TAB ====================
const OverviewTab = ({ children, formatCurrency, onSelectChild }) => {
  const totalPaymentsPending = children.reduce(
    (sum, child) => sum + (child.payments?.filter(p => p.status === 'pending').length || 0), 
    0
  );

  return (
    <div className="overview-tab">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👧👦</div>
          <div className="stat-info">
            <h3>{children.length}</h3>
            <p>Enfants inscrits</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>
              {(children.reduce((sum, child) => sum + child.average, 0) / children.length).toFixed(1)}/20
            </h3>
            <p>Moyenne générale</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>
              {(children.reduce((sum, child) => sum + child.attendance, 0) / children.length).toFixed(0)}%
            </h3>
            <p>Présence moyenne</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{totalPaymentsPending}</h3>
            <p>Paiements en attente</p>
          </div>
        </div>
      </div>

      {/* Children Overview */}
      <h2 className="section-title">Vue rapide de vos enfants</h2>
      <div className="children-overview">
        {children.map(child => (
          <div key={child.id} className="child-overview-card">
            <div className="child-overview-header">
              <div className="child-avatar">{child.avatar}</div>
              <div className="child-info">
                <h3>{child.first_name} {child.last_name}</h3>
                <p className="child-class">{child.class_name}</p>
              </div>
              <button 
                className="view-details-btn"
                onClick={() => onSelectChild(child)}
              >
                Voir détails
              </button>
            </div>

            <div className="child-stats-mini">
              <div className="mini-stat">
                <span className="label">Moyenne</span>
                <span className={`value ${child.average >= 14 ? 'good' : child.average >= 12 ? 'average' : 'poor'}`}>
                  {child.average}/20
                </span>
              </div>
              <div className="mini-stat">
                <span className="label">Présence</span>
                <span className="value">{child.attendance}%</span>
              </div>
            </div>

            <div className="recent-grades-mini">
              <h4>Dernières notes</h4>
              {child.grades.slice(0, 3).map((grade, index) => (
                <div key={index} className="grade-row">
                  <span className="subject">{grade.subject}</span>
                  <span className={`grade ${grade.grade >= 14 ? 'good' : grade.grade >= 12 ? 'average' : 'poor'}`}>
                    {grade.grade}/20
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== CHILDREN TAB ====================
const ChildrenTab = ({ children, onSelectChild }) => {
  return (
    <div className="children-tab">
      <div className="tab-header">
        <h2>Mes enfants</h2>
        <button className="btn-primary">➕ Inscrire un enfant</button>
      </div>

      <div className="children-grid">
        {children.map(child => (
          <div key={child.id} className="child-card">
            <div className="child-card-header">
              <div className="child-avatar-large">{child.avatar}</div>
              <h3>{child.first_name} {child.last_name}</h3>
              <p className="child-class-badge">{child.class_name}</p>
            </div>

            <div className="child-card-body">
              <div className="info-row">
                <span className="info-label">🎂 Date de naissance:</span>
                <span>{new Date(child.date_of_birth).toLocaleDateString('fr-FR')} ({child.age} ans)</span>
              </div>
              <div className="info-row">
                <span className="info-label">📊 Moyenne:</span>
                <span className={`grade-value ${child.average >= 14 ? 'good' : child.average >= 12 ? 'average' : 'poor'}`}>
                  {child.average}/20
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">📋 Présence:</span>
                <span>{child.attendance}%</span>
              </div>
            </div>

            <div className="child-card-footer">
              <button 
                className="btn-view"
                onClick={() => onSelectChild(child)}
              >
                Voir le profil
              </button>
              <button className="btn-contact">✉️ Contacter</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== GRADES TAB ====================
const GradesTab = ({ children }) => {
  const [selectedChild, setSelectedChild] = useState(children[0]?.id);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const child = children.find(c => c.id === selectedChild);

  return (
    <div className="grades-tab">
      <div className="tab-header">
        <h2>Notes et évaluations</h2>
        <div className="tab-actions">
          <select 
            className="filter-select"
            value={selectedChild}
            onChange={(e) => setSelectedChild(Number(e.target.value))}
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.first_name} {child.last_name}
              </option>
            ))}
          </select>
          <select 
            className="filter-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="all">Toute l'année</option>
            <option value="trim1">1er Trimestre</option>
            <option value="trim2">2ème Trimestre</option>
            <option value="trim3">3ème Trimestre</option>
          </select>
        </div>
      </div>

      {child && (
        <div className="grades-container">
          <div className="grades-summary">
            <div className="summary-card">
              <span className="label">Moyenne générale</span>
              <span className={`value large ${child.average >= 14 ? 'good' : child.average >= 12 ? 'average' : 'poor'}`}>
                {child.average}/20
              </span>
            </div>
            <div className="summary-card">
              <span className="label">Meilleure note</span>
              <span className="value large good">
                {Math.max(...child.grades.map(g => g.grade))}/20
              </span>
            </div>
            <div className="summary-card">
              <span className="label">Plus faible note</span>
              <span className="value large poor">
                {Math.min(...child.grades.map(g => g.grade))}/20
              </span>
            </div>
          </div>

          <table className="grades-table">
            <thead>
              <tr>
                <th>Matière</th>
                <th>Note</th>
                <th>Appréciation</th>
                <th>Enseignant</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {child.grades.map((grade, index) => (
                <tr key={index}>
                  <td className="subject-cell">{grade.subject}</td>
                  <td>
                    <span className={`grade-badge ${
                      grade.grade >= 16 ? 'excellent' :
                      grade.grade >= 14 ? 'good' :
                      grade.grade >= 12 ? 'average' : 'poor'
                    }`}>
                      {grade.grade}/20
                    </span>
                  </td>
                  <td>
                    {grade.grade >= 16 ? 'Excellent' :
                     grade.grade >= 14 ? 'Très bien' :
                     grade.grade >= 12 ? 'Bien' :
                     grade.grade >= 10 ? 'Passable' : 'Insuffisant'}
                  </td>
                  <td>{grade.teacher}</td>
                  <td>{new Date(grade.date).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==================== ATTENDANCE TAB ====================
const AttendanceTab = ({ children }) => {
  const [selectedChild, setSelectedChild] = useState(children[0]?.id);
  const [selectedMonth, setSelectedMonth] = useState('2024-03');

  const child = children.find(c => c.id === selectedChild);

  // Simuler des données de présence
  const attendanceData = [
    { date: '2024-03-01', status: 'present' },
    { date: '2024-02-29', status: 'present' },
    { date: '2024-02-28', status: 'present' },
    { date: '2024-02-27', status: 'absent' },
    { date: '2024-02-26', status: 'present' },
    { date: '2024-02-23', status: 'late' },
    { date: '2024-02-22', status: 'present' },
  ];

  return (
    <div className="attendance-tab">
      <div className="tab-header">
        <h2>Suivi des présences</h2>
        <div className="tab-actions">
          <select 
            className="filter-select"
            value={selectedChild}
            onChange={(e) => setSelectedChild(Number(e.target.value))}
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>
                {child.first_name} {child.last_name}
              </option>
            ))}
          </select>
          <input 
            type="month" 
            className="month-input"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {child && (
        <div className="attendance-container">
          <div className="attendance-stats">
            <div className="stat-card">
              <span className="stat-label">Taux de présence</span>
              <span className="stat-value">{child.attendance}%</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Présent</span>
              <span className="stat-value success">15 jours</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Absent</span>
              <span className="stat-value danger">1 jour</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Retard</span>
              <span className="stat-value warning">1 jour</span>
            </div>
          </div>

          <div className="attendance-calendar">
            <h3>Calendrier de présence - {selectedMonth}</h3>
            <div className="calendar-grid">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="calendar-header">{day}</div>
              ))}
              {attendanceData.map((day, index) => (
                <div 
                  key={index} 
                  className={`calendar-day ${day.status}`}
                >
                  <span className="day-number">{index + 1}</span>
                  <span className="day-status">
                    {day.status === 'present' && '✓'}
                    {day.status === 'absent' && '✗'}
                    {day.status === 'late' && '⏰'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== SCHEDULE TAB ====================
const ScheduleTab = ({ children }) => {
  const [selectedChild, setSelectedChild] = useState(children[0]?.id);

  const child = children.find(c => c.id === selectedChild);
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  return (
    <div className="schedule-tab">
      <div className="tab-header">
        <h2>Emploi du temps</h2>
        <select 
          className="filter-select"
          value={selectedChild}
          onChange={(e) => setSelectedChild(Number(e.target.value))}
        >
          {children.map(child => (
            <option key={child.id} value={child.id}>
              {child.first_name} {child.last_name}
            </option>
          ))}
        </select>
      </div>

      {child && (
        <div className="schedule-container">
          <div className="schedule-grid">
            {days.map(day => {
              const daySchedule = child.schedule.find(s => s.day === day);
              return (
                <div key={day} className="schedule-day">
                  <h3>{day}</h3>
                  <div className="courses-list">
                    {daySchedule?.courses.map((course, idx) => (
                      <div key={idx} className="course-item">
                        <span className="course-name">{course}</span>
                      </div>
                    )) || <p className="no-course">Pas de cours</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== HOMEWORK TAB ====================
const HomeworkTab = ({ children }) => {
  const [selectedChild, setSelectedChild] = useState(children[0]?.id);

  const child = children.find(c => c.id === selectedChild);

  return (
    <div className="homework-tab">
      <div className="tab-header">
        <h2>Devoirs à faire</h2>
        <select 
          className="filter-select"
          value={selectedChild}
          onChange={(e) => setSelectedChild(Number(e.target.value))}
        >
          {children.map(child => (
            <option key={child.id} value={child.id}>
              {child.first_name} {child.last_name}
            </option>
          ))}
        </select>
      </div>

      {child && (
        <div className="homework-container">
          <div className="homework-list">
            <h3>Devoirs en cours</h3>
            {child.homework.filter(h => h.status === 'pending').map((hw, index) => (
              <div key={index} className="homework-item pending">
                <div className="homework-icon">📝</div>
                <div className="homework-content">
                  <h4>{hw.subject}</h4>
                  <p>{hw.description}</p>
                  <span className="due-date">À rendre le {new Date(hw.due).toLocaleDateString('fr-FR')}</span>
                </div>
                <span className="status-badge pending">À faire</span>
              </div>
            ))}

            <h3 className="completed-title">Devoirs terminés</h3>
            {child.homework.filter(h => h.status === 'completed').map((hw, index) => (
              <div key={index} className="homework-item completed">
                <div className="homework-icon">✅</div>
                <div className="homework-content">
                  <h4>{hw.subject}</h4>
                  <p>{hw.description}</p>
                  <span className="due-date">Terminé</span>
                </div>
                <span className="status-badge completed">Fait</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== PAYMENTS TAB ====================
const PaymentsTab = ({ children, formatCurrency }) => {
  const [selectedChild, setSelectedChild] = useState('all');

  const filteredChildren = selectedChild === 'all' 
    ? children 
    : children.filter(c => c.id === selectedChild);

  const allPayments = filteredChildren.flatMap(child => 
    child.payments.map(p => ({
      ...p,
      childName: `${child.first_name} ${child.last_name}`,
      childClass: child.class_name
    }))
  ).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const totalPaid = allPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = allPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-tab">
      <div className="tab-header">
        <h2>Paiements de scolarité</h2>
        <select 
          className="filter-select"
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
        >
          <option value="all">Tous les enfants</option>
          {children.map(child => (
            <option key={child.id} value={child.id}>
              {child.first_name} {child.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="payments-summary">
        <div className="summary-card">
          <span className="label">Total payé</span>
          <span className="value paid">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="summary-card">
          <span className="label">Total à payer</span>
          <span className="value pending">{formatCurrency(totalPending)}</span>
        </div>
      </div>

      <table className="payments-table">
        <thead>
          <tr>
            <th>Enfant</th>
            <th>Classe</th>
            <th>Mois</th>
            <th>Montant</th>
            <th>Date de paiement</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {allPayments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.childName}</td>
              <td>{payment.childClass}</td>
              <td>{payment.month}</td>
              <td>{formatCurrency(payment.amount)}</td>
              <td>{payment.date || '-'}</td>
              <td>
                <span className={`payment-status ${payment.status}`}>
                  {payment.status === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== COMMUNICATIONS TAB ====================
const CommunicationsTab = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      from: 'Administration', 
      subject: 'Réunion parents-professeurs', 
      content: 'La réunion aura lieu le samedi 15 mars à 10h...',
      date: '2024-03-01', 
      read: false 
    },
    { 
      id: 2, 
      from: 'M. Dupont (Mathématiques)', 
      subject: 'Progression de Thomas', 
      content: 'Thomas fait de bons progrès en mathématiques...',
      date: '2024-02-28', 
      read: true 
    },
    { 
      id: 3, 
      from: 'Mme Martin (Français)', 
      subject: 'Devoir à rendre', 
      content: 'Les élèves doivent rendre leur rédaction...',
      date: '2024-02-25', 
      read: true 
    }
  ]);

  const [showCompose, setShowCompose] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: ''
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    console.log('Message envoyé:', newMessage);
    setShowCompose(false);
    setNewMessage({ to: '', subject: '', content: '' });
    alert('Message envoyé avec succès !');
  };

  return (
    <div className="communications-tab">
      <div className="tab-header">
        <h2>Communications</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowCompose(!showCompose)}
        >
          {showCompose ? '✖ Annuler' : '✉️ Nouveau message'}
        </button>
      </div>

      {showCompose && (
        <div className="compose-message">
          <h3>Nouveau message</h3>
          <form onSubmit={handleSendMessage}>
            <div className="form-group">
              <label>Destinataire</label>
              <select 
                value={newMessage.to}
                onChange={(e) => setNewMessage({...newMessage, to: e.target.value})}
                required
              >
                <option value="">Sélectionner</option>
                <option value="teacher">Enseignant</option>
                <option value="administration">Administration</option>
                <option value="direction">Direction</option>
              </select>
            </div>

            <div className="form-group">
              <label>Sujet</label>
              <input 
                type="text"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="5"
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Envoyer</button>
              <button type="button" className="btn-secondary" onClick={() => setShowCompose(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="messages-list">
        {messages.map(message => (
          <div key={message.id} className={`message-item ${!message.read ? 'unread' : ''}`}>
            <div className="message-icon">
              {!message.read && <span className="unread-dot"></span>}
            </div>
            <div className="message-content">
              <h4>{message.subject}</h4>
              <p className="message-from">De: {message.from}</p>
              <p className="message-preview">{message.content.substring(0, 100)}...</p>
            </div>
            <div className="message-date">{new Date(message.date).toLocaleDateString('fr-FR')}</div>
            <button className="message-action">👁️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== CHILD DETAILS MODAL ====================
const ChildDetailsModal = ({ child, onClose, formatCurrency }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Profil de {child.first_name} {child.last_name}</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">
          <div className="child-profile-header">
            <div className="profile-avatar-large">{child.avatar}</div>
            <div className="profile-info">
              <h3>{child.first_name} {child.last_name}</h3>
              <p className="class-name">{child.class_name}</p>
              <p className="birth-date">Né(e) le {new Date(child.date_of_birth).toLocaleDateString('fr-FR')} ({child.age} ans)</p>
            </div>
          </div>

          <div className="profile-tabs">
            <button className="tab-btn active">Notes</button>
            <button className="tab-btn">Présences</button>
            <button className="tab-btn">Emploi du temps</button>
            <button className="tab-btn">Paiements</button>
          </div>

          <div className="profile-content">
            <h4>Dernières notes</h4>
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Matière</th>
                  <th>Note</th>
                  <th>Enseignant</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {child.grades.map((grade, index) => (
                  <tr key={index}>
                    <td>{grade.subject}</td>
                    <td>
                      <span className={`grade-badge ${
                        grade.grade >= 16 ? 'excellent' :
                        grade.grade >= 14 ? 'good' :
                        grade.grade >= 12 ? 'average' : 'poor'
                      }`}>
                        {grade.grade}/20
                      </span>
                    </td>
                    <td>{grade.teacher}</td>
                    <td>{new Date(grade.date).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;