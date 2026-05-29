// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Données simulées - À remplacer par des appels API réels
  const [stats, setStats] = useState({
    totalTeachers: 45,
    totalStudents: 850,
    totalParents: 352,
    totalClasses: 32,
    totalRevenue: 2450000,
    pendingPayments: 350000,
    attendanceRate: 94,
    successRate: 92
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, user: 'Jean Dupont', action: 'Nouvel enseignant inscrit', time: 'Il y a 10 min', type: 'teacher' },
    { id: 2, user: 'Marie Martin', action: 'Paiement effectué', time: 'Il y a 25 min', type: 'payment' },
    { id: 3, user: 'Classe de 3ème', action: 'Emploi du temps modifié', time: 'Il y a 1h', type: 'schedule' },
    { id: 4, user: 'Sophie Bernard', action: 'Nouvelle inscription', time: 'Il y a 2h', type: 'student' },
    { id: 5, user: 'Pierre Durand', action: 'Demande de congé', time: 'Il y a 3h', type: 'leave' }
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Jean Dupont', subject: 'Mathématiques', classes: 4, students: 120, status: 'active' },
    { id: 2, name: 'Marie Martin', subject: 'Français', classes: 3, students: 90, status: 'active' },
    { id: 3, name: 'Pierre Durand', subject: 'Physique', classes: 3, students: 85, status: 'active' },
    { id: 4, name: 'Sophie Bernard', subject: 'Anglais', classes: 4, students: 110, status: 'inactive' },
    { id: 5, name: 'Lucas Petit', subject: 'Histoire-Géo', classes: 3, students: 95, status: 'active' }
  ]);

  const [classes, setClasses] = useState([
    { id: 1, name: '6ème A', students: 45, teacher: 'Jean Dupont', avgGrade: 14.5 },
    { id: 2, name: '5ème B', students: 42, teacher: 'Marie Martin', avgGrade: 13.8 },
    { id: 3, name: '4ème C', students: 38, teacher: 'Pierre Durand', avgGrade: 12.9 },
    { id: 4, name: '3ème A', students: 40, teacher: 'Sophie Bernard', avgGrade: 14.2 },
    { id: 5, name: '2nde B', students: 35, teacher: 'Lucas Petit', avgGrade: 13.5 }
  ]);

  const [payments, setPayments] = useState([
    { id: 1, student: 'Thomas Martin', parent: 'Marie Martin', amount: 75000, date: '2024-03-01', status: 'paid' },
    { id: 2, student: 'Emma Bernard', parent: 'Sophie Bernard', amount: 75000, date: '2024-03-01', status: 'paid' },
    { id: 3, student: 'Lucas Petit', parent: 'Pierre Petit', amount: 75000, date: '2024-02-28', status: 'pending' },
    { id: 4, student: 'Chloé Dubois', parent: 'Jean Dubois', amount: 75000, date: '2024-02-28', status: 'paid' },
    { id: 5, student: 'Hugo Thomas', parent: 'Marie Thomas', amount: 75000, date: '2024-02-27', status: 'overdue' }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      // Vérifier que c'est bien un ADMIN (role_id = 1)
      if (userData.role_id !== 1) {
        navigate('/dashboard');
        return;
      }
      setUser(userData);
      setLoading(false);
    } catch (e) {
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
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-avatar">
            <span>👨‍💼</span>
          </div>
          <div className="admin-info">
            <h3>{user?.full_name || 'Admin'}</h3>
            <p>Administrateur</p>
            <span className="badge admin-badge">ADMIN</span>
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
            className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`}
            onClick={() => setActiveTab('teachers')}
          >
            <span className="nav-icon">👨‍🏫</span>
            <span>Enseignants</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <span className="nav-icon">🎓</span>
            <span>Élèves</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'parents' ? 'active' : ''}`}
            onClick={() => setActiveTab('parents')}
          >
            <span className="nav-icon">👪</span>
            <span>Parents</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            <span className="nav-icon">📚</span>
            <span>Classes</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span className="nav-icon">💰</span>
            <span>Paiements</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <span className="nav-icon">📅</span>
            <span>Emploi du temps</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span className="nav-icon">📈</span>
            <span>Rapports</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span>Paramètres</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="main-header">
          <div>
            <h1>Tableau de bord Administrateur</h1>
            <p className="welcome-text">Bon retour parmi nous, {user?.first_name} !</p>
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
              <span className="badge">3</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="content-area">
          {activeTab === 'overview' && (
            <OverviewTab 
              stats={stats} 
              activities={recentActivities}
              formatCurrency={formatCurrency}
            />
          )}
          
          {activeTab === 'teachers' && (
            <TeachersTab 
              teachers={teachers}
              setTeachers={setTeachers}
            />
          )}
          
          {activeTab === 'students' && <StudentsTab />}
          
          {activeTab === 'parents' && <ParentsTab />}
          
          {activeTab === 'classes' && (
            <ClassesTab 
              classes={classes}
              teachers={teachers}
            />
          )}
          
          {activeTab === 'payments' && (
            <PaymentsTab 
              payments={payments}
              formatCurrency={formatCurrency}
            />
          )}
          
          {activeTab === 'schedule' && <ScheduleTab />}
          
          {activeTab === 'reports' && <ReportsTab />}
          
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

// ==================== OVERVIEW TAB ====================
const OverviewTab = ({ stats, activities, formatCurrency }) => {
  return (
    <div className="overview-tab">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-info">
            <h3>{stats.totalTeachers}</h3>
            <p>Enseignants</p>
          </div>
          <span className="trend">+3</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Élèves</p>
          </div>
          <span className="trend">+12</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👪</div>
          <div className="stat-info">
            <h3>{stats.totalParents}</h3>
            <p>Parents</p>
          </div>
          <span className="trend">+8</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.totalClasses}</h3>
            <p>Classes</p>
          </div>
          <span className="trend">+1</span>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="stats-row">
        <div className="stat-card secondary">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Revenus totaux</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.pendingPayments)}</h3>
            <p>Paiements en attente</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.attendanceRate}%</h3>
            <p>Taux de présence</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>{stats.successRate}%</h3>
            <p>Taux de réussite</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Répartition des élèves par classe</h3>
          <div className="chart-container">
            <div className="bar-chart">
              <div className="bar" style={{height: '80%'}}>6ème</div>
              <div className="bar" style={{height: '70%'}}>5ème</div>
              <div className="bar" style={{height: '65%'}}>4ème</div>
              <div className="bar" style={{height: '75%'}}>3ème</div>
              <div className="bar" style={{height: '60%'}}>2nde</div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Activités récentes</h3>
          <div className="activity-list">
            {activities.map(activity => (
              <div key={activity.id} className={`activity-item ${activity.type}`}>
                <div className="activity-icon">
                  {activity.type === 'teacher' && '👨‍🏫'}
                  {activity.type === 'payment' && '💰'}
                  {activity.type === 'schedule' && '📅'}
                  {activity.type === 'student' && '🎓'}
                  {activity.type === 'leave' && '✈️'}
                </div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-user">Par {activity.user}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Actions rapides</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span>Nouvel enseignant</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📝</span>
            <span>Nouvelle classe</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">💰</span>
            <span>Enregistrer paiement</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>Générer rapport</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== TEACHERS TAB ====================
const TeachersTab = ({ teachers, setTeachers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="teachers-tab">
      <div className="tab-header">
        <h2>Gestion des enseignants</h2>
        <div className="tab-actions">
          <input
            type="text"
            placeholder="Rechercher un enseignant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✖ Annuler' : '➕ Nouvel enseignant'}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-form">
          <h3>Ajouter un enseignant</h3>
          <form className="form-grid">
            <div className="form-group">
              <label>Nom complet</label>
              <input type="text" placeholder="Jean Dupont" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="jean@email.com" />
            </div>
            <div className="form-group">
              <label>Matière</label>
              <select>
                <option>Mathématiques</option>
                <option>Français</option>
                <option>Physique</option>
                <option>Anglais</option>
                <option>Histoire-Géo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input type="tel" placeholder="6 XX XX XX XX" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Enregistrer</button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="teachers-grid">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-header">
              <div className="teacher-avatar">
                {teacher.name.charAt(0)}
              </div>
              <div className="teacher-info">
                <h3>{teacher.name}</h3>
                <p className="teacher-subject">{teacher.subject}</p>
              </div>
              <span className={`status-badge ${teacher.status}`}>
                {teacher.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            
            <div className="teacher-stats">
              <div className="stat">
                <span className="stat-value">{teacher.classes}</span>
                <span className="stat-label">Classes</span>
              </div>
              <div className="stat">
                <span className="stat-value">{teacher.students}</span>
                <span className="stat-label">Élèves</span>
              </div>
            </div>

            <div className="teacher-actions">
              <button className="action-btn edit">✏️ Modifier</button>
              <button className="action-btn schedule">📅 Emploi du temps</button>
              <button className="action-btn more">⋯</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== STUDENTS TAB ====================
const StudentsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données simulées
  const students = [
    { id: 1, name: 'Thomas Martin', class: '3ème A', parent: 'Marie Martin', avgGrade: 14.5, status: 'active' },
    { id: 2, name: 'Emma Bernard', class: '4ème C', parent: 'Sophie Bernard', avgGrade: 16.2, status: 'active' },
    { id: 3, name: 'Lucas Petit', class: '5ème B', parent: 'Pierre Petit', avgGrade: 12.8, status: 'active' },
    { id: 4, name: 'Chloé Dubois', class: '6ème A', parent: 'Jean Dubois', avgGrade: 15.0, status: 'inactive' },
    { id: 5, name: 'Hugo Thomas', class: '3ème A', parent: 'Marie Thomas', avgGrade: 13.2, status: 'active' },
  ];

  return (
    <div className="students-tab">
      <div className="tab-header">
        <h2>Gestion des élèves</h2>
        <div className="tab-actions">
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn-primary">➕ Nouvel élève</button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Classe</th>
              <th>Parent</th>
              <th>Moyenne</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>{student.parent}</td>
                <td>
                  <span className={`grade-badge ${
                    student.avgGrade >= 14 ? 'excellent' : 
                    student.avgGrade >= 12 ? 'good' : 'average'
                  }`}>
                    {student.avgGrade}/20
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${student.status}`}>
                    {student.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <button className="icon-btn">👁️</button>
                  <button className="icon-btn">✏️</button>
                  <button className="icon-btn">📊</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== PARENTS TAB ====================
const ParentsTab = () => {
  const parents = [
    { id: 1, name: 'Marie Martin', children: 2, phone: '6 XX XX XX XX', email: 'marie@email.com', status: 'active' },
    { id: 2, name: 'Sophie Bernard', children: 1, phone: '6 XX XX XX XX', email: 'sophie@email.com', status: 'active' },
    { id: 3, name: 'Pierre Petit', children: 2, phone: '6 XX XX XX XX', email: 'pierre@email.com', status: 'inactive' },
  ];

  return (
    <div className="parents-tab">
      <div className="tab-header">
        <h2>Gestion des parents</h2>
        <button className="btn-primary">➕ Nouveau parent</button>
      </div>

      <div className="parents-grid">
        {parents.map(parent => (
          <div key={parent.id} className="parent-card">
            <div className="parent-header">
              <div className="parent-avatar">{parent.name.charAt(0)}</div>
              <div>
                <h3>{parent.name}</h3>
                <p>{parent.email}</p>
              </div>
            </div>
            <div className="parent-details">
              <p><span>📞</span> {parent.phone}</p>
              <p><span>👪</span> {parent.children} enfant(s)</p>
            </div>
            <div className="parent-actions">
              <button className="action-btn">👁️ Voir les enfants</button>
              <button className="action-btn">✉️ Contacter</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== CLASSES TAB ====================
const ClassesTab = ({ classes, teachers }) => {
  return (
    <div className="classes-tab">
      <div className="tab-header">
        <h2>Gestion des classes</h2>
        <button className="btn-primary">➕ Nouvelle classe</button>
      </div>

      <div className="classes-grid">
        {classes.map(cls => (
          <div key={cls.id} className="class-card">
            <div className="class-header">
              <h3>{cls.name}</h3>
              <span className="class-size">{cls.students} élèves</span>
            </div>
            
            <div className="class-info">
              <p><span>👨‍🏫 Professeur principal:</span> {cls.teacher}</p>
              <p><span>📊 Moyenne générale:</span> {cls.avgGrade}/20</p>
            </div>

            <div className="class-stats">
              <div className="stat">
                <span className="stat-value">♂️ {Math.floor(cls.students * 0.52)}</span>
                <span>Garçons</span>
              </div>
              <div className="stat">
                <span className="stat-value">♀️ {Math.floor(cls.students * 0.48)}</span>
                <span>Filles</span>
              </div>
            </div>

            <div className="class-actions">
              <button className="action-btn">👁️ Voir</button>
              <button className="action-btn">✏️ Modifier</button>
              <button className="action-btn">📅 Emploi du temps</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== PAYMENTS TAB ====================
const PaymentsTab = ({ payments, formatCurrency }) => {
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPending = payments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-tab">
      <div className="payments-summary">
        <div className="summary-card">
          <span className="summary-label">Total encaissé</span>
          <span className="summary-value paid">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">En attente</span>
          <span className="summary-value pending">{formatCurrency(totalPending)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Ce mois</span>
          <span className="summary-value">{formatCurrency(850000)}</span>
        </div>
      </div>

      <div className="tab-header">
        <h2>Historique des paiements</h2>
        <button className="btn-primary">💰 Enregistrer un paiement</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Élève</th>
              <th>Parent</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>{payment.student}</td>
                <td>{payment.parent}</td>
                <td>{formatCurrency(payment.amount)}</td>
                <td>{payment.date}</td>
                <td>
                  <span className={`payment-status ${payment.status}`}>
                    {payment.status === 'paid' ? 'Payé' : 
                     payment.status === 'pending' ? 'En attente' : 'En retard'}
                  </span>
                </td>
                <td>
                  <button className="icon-btn">📄</button>
                  <button className="icon-btn">✉️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== SCHEDULE TAB ====================
const ScheduleTab = () => {
  return (
    <div className="schedule-tab">
      <div className="tab-header">
        <h2>Emploi du temps</h2>
        <div className="tab-actions">
          <select className="schedule-select">
            <option>Toutes les classes</option>
            <option>6ème A</option>
            <option>5ème B</option>
            <option>4ème C</option>
          </select>
          <button className="btn-primary">📅 Modifier</button>
        </div>
      </div>

      <div className="schedule-grid">
        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => (
          <div key={day} className="schedule-day">
            <h3>{day}</h3>
            <div className="schedule-courses">
              <div className="course-item">
                <span className="course-time">08h - 10h</span>
                <span className="course-name">Mathématiques</span>
                <span className="course-class">3ème A</span>
              </div>
              <div className="course-item">
                <span className="course-time">10h - 12h</span>
                <span className="course-name">Français</span>
                <span className="course-class">4ème B</span>
              </div>
              <div className="course-item">
                <span className="course-time">14h - 16h</span>
                <span className="course-name">Physique</span>
                <span className="course-class">5ème C</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== REPORTS TAB ====================
const ReportsTab = () => {
  return (
    <div className="reports-tab">
      <h2>Rapports et statistiques</h2>
      
      <div className="reports-grid">
        <div className="report-card">
          <h3>Rapport de performance</h3>
          <p>Analyse détaillée des résultats par classe et par matière</p>
          <button className="report-btn">📊 Générer</button>
        </div>
        
        <div className="report-card">
          <h3>Rapport financier</h3>
          <p>Récapitulatif des paiements et encaissements</p>
          <button className="report-btn">💰 Générer</button>
        </div>
        
        <div className="report-card">
          <h3>Rapport de présence</h3>
          <p>Taux de présence par classe et par élève</p>
          <button className="report-btn">📅 Générer</button>
        </div>
        
        <div className="report-card">
          <h3>Rapport annuel</h3>
          <p>Bilan complet de l'année scolaire</p>
          <button className="report-btn">📈 Générer</button>
        </div>
      </div>
    </div>
  );
};

// ==================== SETTINGS TAB ====================
const SettingsTab = () => {
  return (
    <div className="settings-tab">
      <h2>Paramètres</h2>
      
      <div className="settings-section">
        <h3>Informations générales</h3>
        <div className="settings-form">
          <div className="form-group">
            <label>Nom de l'établissement</label>
            <input type="text" value="Centre de Soutien Scolaire Le Phénix" readOnly />
          </div>
          
          <div className="form-group">
            <label>Email de contact</label>
            <input type="email" value="contact@phenix.com" />
          </div>
          
          <div className="form-group">
            <label>Téléphone</label>
            <input type="tel" value="+237 699 123 456" />
          </div>
          
          <div className="form-group">
            <label>Adresse</label>
            <textarea>Boulevard de la République, Yaoundé</textarea>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Paramètres de l'année scolaire</h3>
        <div className="settings-form">
          <div className="form-group">
            <label>Année en cours</label>
            <input type="text" value="2024-2025" />
          </div>
          
          <div className="form-group">
            <label>Date de rentrée</label>
            <input type="date" value="2024-09-02" />
          </div>
          
          <div className="form-group">
            <label>Date de fin</label>
            <input type="date" value="2025-06-30" />
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary">Sauvegarder les modifications</button>
        <button className="btn-secondary">Annuler</button>
      </div>
    </div>
  );
};

export default AdminDashboard;