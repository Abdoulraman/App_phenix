// TeacherDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Données simulées - À remplacer par des appels API réels
  const [stats, setStats] = useState({
    totalClasses: 4,
    totalStudents: 98,
    averageGrade: 14.2,
    attendanceRate: 94,
    pendingGrades: 12,
    upcomingClasses: 3
  });

  const [classes, setClasses] = useState([
    { 
      id: 1, 
      name: '3ème A', 
      subject: 'Mathématiques',
      students: 42,
      schedule: 'Lundi 8h-10h, Mercredi 10h-12h',
      avgGrade: 13.8,
      progress: 75
    },
    { 
      id: 2, 
      name: '4ème B', 
      subject: 'Mathématiques',
      students: 38,
      schedule: 'Mardi 8h-10h, Jeudi 14h-16h',
      avgGrade: 14.2,
      progress: 70
    },
    { 
      id: 3, 
      name: '5ème C', 
      subject: 'Mathématiques',
      students: 35,
      schedule: 'Mercredi 8h-10h, Vendredi 10h-12h',
      avgGrade: 13.5,
      progress: 68
    },
    { 
      id: 4, 
      name: '6ème A', 
      subject: 'Mathématiques',
      students: 45,
      schedule: 'Lundi 14h-16h, Jeudi 8h-10h',
      avgGrade: 15.2,
      progress: 82
    }
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: 'Thomas Martin', class: '3ème A', grade: 15.5, attendance: 95, lastGrade: 16 },
    { id: 2, name: 'Emma Bernard', class: '3ème A', grade: 14.5, attendance: 98, lastGrade: 15 },
    { id: 3, name: 'Lucas Petit', class: '3ème A', grade: 12.0, attendance: 85, lastGrade: 13 },
    { id: 4, name: 'Chloé Dubois', class: '3ème A', grade: 16.5, attendance: 100, lastGrade: 17 },
    { id: 5, name: 'Hugo Thomas', class: '3ème A', grade: 13.0, attendance: 90, lastGrade: 12 },
    { id: 6, name: 'Léa Martin', class: '4ème B', grade: 14.5, attendance: 92, lastGrade: 15 },
    { id: 7, name: 'Paul Bernard', class: '4ème B', grade: 13.5, attendance: 88, lastGrade: 14 },
    { id: 8, name: 'Julie Petit', class: '4ème B', grade: 15.0, attendance: 95, lastGrade: 16 }
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, title: 'Corriger devoirs 3ème A', due: 'Aujourd\'hui', priority: 'high', class: '3ème A' },
    { id: 2, title: 'Préparer cours 4ème B', due: 'Demain', priority: 'medium', class: '4ème B' },
    { id: 3, title: 'Réunion parents-profs', due: 'Vendredi', priority: 'high', class: 'Toutes classes' },
    { id: 4, title: 'Conseil de classe 3ème', due: 'Semaine prochaine', priority: 'low', class: '3ème A' }
  ]);

  const [schedule, setSchedule] = useState([
    { day: 'Lundi', courses: [
      { time: '08:00 - 10:00', class: '3ème A', subject: 'Mathématiques', room: 'Salle 101' },
      { time: '14:00 - 16:00', class: '6ème A', subject: 'Mathématiques', room: 'Salle 103' }
    ]},
    { day: 'Mardi', courses: [
      { time: '08:00 - 10:00', class: '4ème B', subject: 'Mathématiques', room: 'Salle 102' }
    ]},
    { day: 'Mercredi', courses: [
      { time: '08:00 - 10:00', class: '5ème C', subject: 'Mathématiques', room: 'Salle 101' },
      { time: '10:00 - 12:00', class: '3ème A', subject: 'Mathématiques', room: 'Salle 101' }
    ]},
    { day: 'Jeudi', courses: [
      { time: '08:00 - 10:00', class: '6ème A', subject: 'Mathématiques', room: 'Salle 103' },
      { time: '14:00 - 16:00', class: '4ème B', subject: 'Mathématiques', room: 'Salle 102' }
    ]},
    { day: 'Vendredi', courses: [
      { time: '10:00 - 12:00', class: '5ème C', subject: 'Mathématiques', room: 'Salle 101' }
    ]}
  ]);

  const [recentGrades, setRecentGrades] = useState([
    { id: 1, student: 'Thomas Martin', class: '3ème A', subject: 'Mathématiques', grade: 16, date: '2024-03-01' },
    { id: 2, student: 'Emma Bernard', class: '3ème A', subject: 'Mathématiques', grade: 15, date: '2024-03-01' },
    { id: 3, student: 'Lucas Petit', class: '3ème A', subject: 'Mathématiques', grade: 12, date: '2024-03-01' },
    { id: 4, student: 'Chloé Dubois', class: '4ème B', subject: 'Mathématiques', grade: 17, date: '2024-02-28' }
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
      // Vérifier que c'est bien un ENSEIGNANT (role_id = 3)
      if (userData.role_id !== 3) {
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

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <div className="teacher-sidebar">
        <div className="sidebar-header">
          <div className="teacher-avatar">
            <span>👨‍🏫</span>
          </div>
          <div className="teacher-info">
            <h3>{user?.full_name || 'Enseignant'}</h3>
            <p>{user?.subject || 'Mathématiques'}</p>
            <span className="badge teacher-badge">ENSEIGNANT</span>
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
            className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            <span className="nav-icon">📚</span>
            <span>Mes classes</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <span className="nav-icon">🎓</span>
            <span>Élèves</span>
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
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <span className="nav-icon">✅</span>
            <span>Tâches</span>
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
      <div className="teacher-main">
        {/* Header */}
        <div className="main-header">
          <div>
            <h1>Tableau de bord Enseignant</h1>
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
              classes={classes}
              upcomingTasks={upcomingTasks}
              recentGrades={recentGrades}
            />
          )}
          
          {activeTab === 'classes' && (
            <ClassesTab 
              classes={classes}
              setClasses={setClasses}
            />
          )}
          
          {activeTab === 'students' && (
            <StudentsTab 
              students={students}
              classes={classes}
            />
          )}
          
          {activeTab === 'grades' && (
            <GradesTab 
              students={students}
              classes={classes}
            />
          )}
          
          {activeTab === 'attendance' && (
            <AttendanceTab 
              students={students}
              classes={classes}
            />
          )}
          
          {activeTab === 'schedule' && (
            <ScheduleTab 
              schedule={schedule}
            />
          )}
          
          {activeTab === 'tasks' && (
            <TasksTab 
              tasks={upcomingTasks}
              setTasks={setUpcomingTasks}
            />
          )}
          
          {activeTab === 'communications' && (
            <CommunicationsTab />
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== OVERVIEW TAB ====================
const OverviewTab = ({ stats, classes, upcomingTasks, recentGrades }) => {
  return (
    <div className="overview-tab">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.totalClasses}</h3>
            <p>Classes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Élèves</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.averageGrade}/20</h3>
            <p>Moyenne générale</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.attendanceRate}%</h3>
            <p>Présence</p>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="stats-row">
        <div className="stat-card secondary">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingGrades}</h3>
            <p>Notes à saisir</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.upcomingClasses}</h3>
            <p>Cours aujourd'hui</p>
          </div>
        </div>
      </div>

      {/* My Classes */}
      <div className="section">
        <h2>Mes classes</h2>
        <div className="classes-mini-grid">
          {classes.map(cls => (
            <div key={cls.id} className="class-mini-card">
              <h3>{cls.name}</h3>
              <p>{cls.students} élèves</p>
              <div className="progress-bar">
                <div className="progress" style={{width: `${cls.progress}%`}}></div>
              </div>
              <span className="progress-label">{cls.progress}% du programme</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns layout */}
      <div className="two-columns">
        {/* Upcoming Tasks */}
        <div className="column">
          <h2>Tâches à venir</h2>
          <div className="tasks-list">
            {upcomingTasks.map(task => (
              <div key={task.id} className={`task-item priority-${task.priority}`}>
                <div className="task-content">
                  <h4>{task.title}</h4>
                  <p>{task.class} • Échéance: {task.due}</p>
                </div>
                <span className={`priority-badge ${task.priority}`}>
                  {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="column">
          <h2>Dernières notes</h2>
          <div className="recent-grades-list">
            {recentGrades.map(grade => (
              <div key={grade.id} className="grade-item">
                <div className="grade-info">
                  <h4>{grade.student}</h4>
                  <p>{grade.class} • {grade.subject}</p>
                </div>
                <span className={`grade-value ${
                  grade.grade >= 16 ? 'excellent' : 
                  grade.grade >= 14 ? 'good' : 
                  grade.grade >= 12 ? 'average' : 'poor'
                }`}>
                  {grade.grade}/20
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== CLASSES TAB ====================
const ClassesTab = ({ classes, setClasses }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="classes-tab">
      <div className="tab-header">
        <h2>Mes classes</h2>
        <div className="tab-actions">
          <input
            type="text"
            placeholder="Rechercher une classe..."
            className="search-input"
          />
        </div>
      </div>

      <div className="classes-grid">
        {classes.map(cls => (
          <div key={cls.id} className="class-card">
            <div className="class-header">
              <h3>{cls.name}</h3>
              <span className="class-subject">{cls.subject}</span>
            </div>
            
            <div className="class-stats">
              <div className="stat">
                <span className="stat-value">{cls.students}</span>
                <span className="stat-label">Élèves</span>
              </div>
              <div className="stat">
                <span className="stat-value">{cls.avgGrade}/20</span>
                <span className="stat-label">Moyenne</span>
              </div>
            </div>

            <div className="class-info">
              <p><span className="info-label">📅 Horaires:</span> {cls.schedule}</p>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Progression</span>
                <span>{cls.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress" style={{width: `${cls.progress}%`}}></div>
              </div>
            </div>

            <div className="class-actions">
              <button className="action-btn" onClick={() => {
                setSelectedClass(cls);
                setShowDetails(true);
              }}>
                👁️ Voir détails
              </button>
              <button className="action-btn">📝 Notes</button>
              <button className="action-btn">📋 Présences</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Détails Classe */}
      {showDetails && selectedClass && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Classe {selectedClass.name}</h2>
              <button className="close-btn" onClick={() => setShowDetails(false)}>✖</button>
            </div>
            
            <div className="modal-body">
              <div className="class-details">
                <div className="detail-item">
                  <span className="detail-label">Matière:</span>
                  <span className="detail-value">{selectedClass.subject}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Nombre d'élèves:</span>
                  <span className="detail-value">{selectedClass.students}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Moyenne de classe:</span>
                  <span className="detail-value">{selectedClass.avgGrade}/20</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Horaire:</span>
                  <span className="detail-value">{selectedClass.schedule}</span>
                </div>
              </div>

              <h3>Liste des élèves</h3>
              <table className="modal-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Moyenne</th>
                    <th>Présence</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Thomas Martin</td>
                    <td>15.5/20</td>
                    <td>95%</td>
                    <td>
                      <button className="icon-btn">👁️</button>
                      <button className="icon-btn">📝</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Emma Bernard</td>
                    <td>14.5/20</td>
                    <td>98%</td>
                    <td>
                      <button className="icon-btn">👁️</button>
                      <button className="icon-btn">📝</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== STUDENTS TAB ====================
const StudentsTab = ({ students, classes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="students-tab">
      <div className="tab-header">
        <h2>Élèves</h2>
        <div className="tab-actions">
          <select 
            className="filter-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">Toutes les classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="students-grid">
        {filteredStudents.map(student => (
          <div key={student.id} className="student-card">
            <div className="student-avatar">
              {student.name.charAt(0)}
            </div>
            <div className="student-info">
              <h3>{student.name}</h3>
              <p className="student-class">{student.class}</p>
            </div>
            
            <div className="student-stats">
              <div className="stat">
                <span className="stat-value">{student.grade}</span>
                <span className="stat-label">Moyenne</span>
              </div>
              <div className="stat">
                <span className="stat-value">{student.attendance}%</span>
                <span className="stat-label">Présence</span>
              </div>
            </div>

            <div className="student-actions">
              <button 
                className="action-btn"
                onClick={() => {
                  setSelectedStudent(student);
                  setShowProfile(true);
                }}
              >
                👁️ Profil
              </button>
              <button className="action-btn">📝 Notes</button>
              <button className="action-btn">📋 Présences</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Profil Élève */}
      {showProfile && selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Profil de {selectedStudent.name}</h2>
              <button className="close-btn" onClick={() => setShowProfile(false)}>✖</button>
            </div>
            
            <div className="modal-body">
              <div className="student-profile">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div className="profile-info">
                    <h3>{selectedStudent.name}</h3>
                    <p>Classe: {selectedStudent.class}</p>
                  </div>
                </div>

                <div className="profile-stats">
                  <div className="stat-card">
                    <span className="stat-label">Moyenne générale</span>
                    <span className="stat-value">{selectedStudent.grade}/20</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Dernière note</span>
                    <span className="stat-value">{selectedStudent.lastGrade}/20</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">Présence</span>
                    <span className="stat-value">{selectedStudent.attendance}%</span>
                  </div>
                </div>

                <h3>Dernières notes</h3>
                <table className="grades-table-mini">
                  <thead>
                    <tr>
                      <th>Matière</th>
                      <th>Note</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Mathématiques</td>
                      <td>16/20</td>
                      <td>01/03/2024</td>
                    </tr>
                    <tr>
                      <td>Mathématiques</td>
                      <td>15/20</td>
                      <td>15/02/2024</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== GRADES TAB ====================
const GradesTab = ({ students, classes }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [gradeType, setGradeType] = useState('exam');
  const [gradeValue, setGradeValue] = useState('');
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmitGrade = (e) => {
    e.preventDefault();
    // Logique d'ajout de note
    console.log('Note ajoutée:', { selectedStudent, gradeType, gradeValue, comment });
    setShowForm(false);
    // Réinitialiser le formulaire
    setSelectedStudent('');
    setGradeValue('');
    setComment('');
  };

  return (
    <div className="grades-tab">
      <div className="tab-header">
        <h2>Gestion des notes</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✖ Annuler' : '➕ Nouvelle note'}
        </button>
      </div>

      {showForm && (
        <div className="grade-form">
          <h3>Ajouter une note</h3>
          <form onSubmit={handleSubmitGrade}>
            <div className="form-grid">
              <div className="form-group">
                <label>Classe</label>
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Élève</label>
                <select 
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                >
                  <option value="">Sélectionner un élève</option>
                  {students
                    .filter(s => !selectedClass || s.class === selectedClass)
                    .map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label>Type d'évaluation</label>
                <select 
                  value={gradeType}
                  onChange={(e) => setGradeType(e.target.value)}
                >
                  <option value="exam">Examen</option>
                  <option value="test">Devoir</option>
                  <option value="homework">Exercice</option>
                  <option value="participation">Participation</option>
                </select>
              </div>

              <div className="form-group">
                <label>Note ( /20 )</label>
                <input 
                  type="number" 
                  min="0" 
                  max="20" 
                  step="0.5"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Commentaire</label>
                <textarea 
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Commentaire optionnel..."
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Enregistrer la note</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des notes récentes */}
      <div className="recent-grades">
        <h3>Notes récentes</h3>
        <table className="grades-table">
          <thead>
            <tr>
              <th>Élève</th>
              <th>Classe</th>
              <th>Matière</th>
              <th>Note</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 10).map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>Mathématiques</td>
                <td>
                  <span className={`grade-badge ${
                    student.grade >= 16 ? 'excellent' : 
                    student.grade >= 14 ? 'good' : 
                    student.grade >= 12 ? 'average' : 'poor'
                  }`}>
                    {student.grade}/20
                  </span>
                </td>
                <td>01/03/2024</td>
                <td>
                  <button className="icon-btn">✏️</button>
                  <button className="icon-btn">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== ATTENDANCE TAB ====================
const AttendanceTab = ({ students, classes }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useState({});

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    console.log('Présences sauvegardées:', attendance);
    alert('Présences enregistrées avec succès !');
  };

  return (
    <div className="attendance-tab">
      <div className="tab-header">
        <h2>Gestion des présences</h2>
        <div className="tab-actions">
          <select 
            className="filter-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Sélectionner une classe</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.name}>{cls.name}</option>
            ))}
          </select>
          <input 
            type="date" 
            className="date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {selectedClass ? (
        <div className="attendance-sheet">
          <div className="attendance-header">
            <h3>Classe: {selectedClass} - {new Date(selectedDate).toLocaleDateString('fr-FR')}</h3>
            <button className="btn-primary" onClick={handleSaveAttendance}>
              💾 Enregistrer
            </button>
          </div>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nom de l'élève</th>
                <th>Présent</th>
                <th>Absent</th>
                <th>Retard</th>
                <th>Excusé</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => s.class === selectedClass)
                .map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td className="text-center">
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id] === 'present'}
                        onChange={() => handleAttendanceChange(student.id, 'present')}
                      />
                    </td>
                    <td className="text-center">
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id] === 'absent'}
                        onChange={() => handleAttendanceChange(student.id, 'absent')}
                      />
                    </td>
                    <td className="text-center">
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id] === 'late'}
                        onChange={() => handleAttendanceChange(student.id, 'late')}
                      />
                    </td>
                    <td className="text-center">
                      <input 
                        type="radio" 
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id] === 'excused'}
                        onChange={() => handleAttendanceChange(student.id, 'excused')}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="attendance-summary">
            <h4>Récapitulatif</h4>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Présents:</span>
                <span className="stat-value">
                  {Object.values(attendance).filter(v => v === 'present').length}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Absents:</span>
                <span className="stat-value">
                  {Object.values(attendance).filter(v => v === 'absent').length}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Retards:</span>
                <span className="stat-value">
                  {Object.values(attendance).filter(v => v === 'late').length}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Excusés:</span>
                <span className="stat-value">
                  {Object.values(attendance).filter(v => v === 'excused').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-class-selected">
          <p>Veuillez sélectionner une classe pour commencer l'appel</p>
        </div>
      )}
    </div>
  );
};

// ==================== SCHEDULE TAB ====================
const ScheduleTab = ({ schedule }) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

  return (
    <div className="schedule-tab">
      <div className="tab-header">
        <h2>Mon emploi du temps</h2>
        <button className="btn-secondary">📅 Semaine en cours</button>
      </div>

      <div className="schedule-grid">
        {days.map(day => {
          const daySchedule = schedule.find(s => s.day === day) || { courses: [] };
          return (
            <div key={day} className="schedule-day">
              <h3>{day}</h3>
              <div className="courses-list">
                {daySchedule.courses.length > 0 ? (
                  daySchedule.courses.map((course, index) => (
                    <div key={index} className="course-card">
                      <span className="course-time">{course.time}</span>
                      <span className="course-class">{course.class}</span>
                      <span className="course-subject">{course.subject}</span>
                      <span className="course-room">{course.room}</span>
                    </div>
                  ))
                ) : (
                  <p className="no-course">Pas de cours</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== TASKS TAB ====================
const TasksTab = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState({
    title: '',
    due: '',
    priority: 'medium',
    class: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTask = (e) => {
    e.preventDefault();
    const task = {
      id: tasks.length + 1,
      ...newTask,
      due: 'À venir'
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', due: '', priority: 'medium', class: '' });
    setShowAddForm(false);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="tasks-tab">
      <div className="tab-header">
        <h2>Mes tâches</h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✖ Annuler' : '➕ Nouvelle tâche'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-task-form">
          <h3>Ajouter une tâche</h3>
          <form onSubmit={handleAddTask}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Titre de la tâche</label>
                <input 
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                  placeholder="Ex: Corriger les devoirs"
                />
              </div>

              <div className="form-group">
                <label>Priorité</label>
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="high">Haute</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Basse</option>
                </select>
              </div>

              <div className="form-group">
                <label>Classe concernée</label>
                <input 
                  type="text"
                  value={newTask.class}
                  onChange={(e) => setNewTask({...newTask, class: e.target.value})}
                  placeholder="Ex: 3ème A"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Ajouter</button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-grid">
        {tasks.map(task => (
          <div key={task.id} className={`task-card priority-${task.priority}`}>
            <div className="task-header">
              <h3>{task.title}</h3>
              <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>🗑️</button>
            </div>
            <div className="task-details">
              <p><span className="label">Classe:</span> {task.class}</p>
              <p><span className="label">Échéance:</span> {task.due}</p>
            </div>
            <div className="task-footer">
              <span className={`priority-tag ${task.priority}`}>
                {task.priority === 'high' ? '🔴 Haute' : 
                 task.priority === 'medium' ? '🟡 Moyenne' : '🟢 Basse'}
              </span>
              <button className="btn-complete">✓ Marquer comme terminée</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== COMMUNICATIONS TAB ====================
const CommunicationsTab = () => {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Administration', subject: 'Réunion pédagogique', date: '2024-03-01', read: false },
    { id: 2, from: 'Parent M. Martin', subject: 'Question sur devoirs', date: '2024-02-29', read: true },
    { id: 3, from: 'Direction', subject: 'Calendrier des examens', date: '2024-02-28', read: true }
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
        <button className="btn-primary" onClick={() => setShowCompose(!showCompose)}>
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
                <option value="parents">Tous les parents</option>
                <option value="colleagues">Collègues</option>
                <option value="administration">Administration</option>
                <option value="class-3a">Parents 3ème A</option>
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
        <h3>Boîte de réception</h3>
        {messages.map(message => (
          <div key={message.id} className={`message-item ${!message.read ? 'unread' : ''}`}>
            <div className="message-icon">
              {!message.read && <span className="unread-dot"></span>}
            </div>
            <div className="message-content">
              <h4>{message.subject}</h4>
              <p>De: {message.from}</p>
            </div>
            <div className="message-date">{message.date}</div>
            <button className="message-action">👁️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;