import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RootDashboard.css';

const RootDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalParents: 0,
    dbSize: '0 MB',
    serverUptime: '0 jours',
    lastBackup: 'Jamais'
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Vérifier l'authentification et le rôle
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      // Vérifier que c'est bien un ROOT (role_id = 0)
      if (userData.role_id !== 0) {
        navigate('/dashboard');
        return;
      }
      setUser(userData);
      fetchSystemData();
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  // Charger les données système
  const fetchSystemData = async () => {
    setLoading(true);
    try {
      // Simulation de données - À remplacer par de vraies appels API
      setTimeout(() => {
        setSystemStats({
          totalUsers: 1250,
          activeUsers: 980,
          totalAdmins: 3,
          totalTeachers: 45,
          totalStudents: 850,
          totalParents: 352,
          dbSize: '156 MB',
          serverUptime: '15 jours',
          lastBackup: '2024-03-01 23:00'
        });

        setRecentActivities([
          { id: 1, user: 'Admin System', action: 'Création admin', target: 'admin@phenix.com', time: 'Il y a 5 min', status: 'success' },
          { id: 2, user: 'Système', action: 'Sauvegarde DB', target: 'auto_backup.sql', time: 'Il y a 2h', status: 'success' },
          { id: 3, user: 'Root', action: 'Modification rôle', target: 'user_123', time: 'Il y a 3h', status: 'warning' },
          { id: 4, user: 'Système', action: 'Mise à jour', target: 'v2.1.0', time: 'Hier', status: 'info' },
          { id: 5, user: 'Admin System', action: 'Suppression compte', target: 'spam@email.com', time: 'Hier', status: 'danger' }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setLoading(false);
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    navigate('/login');
  };

  if (!user) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="root-dashboard">
      {/* Sidebar */}
      <div className="root-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="phoenix-icon">🔥</span>
            <span className="logo-text">Le Phénix</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              <span className="avatar-icon">👑</span>
            </div>
            <div className="user-details">
              <span className="user-name">{user.full_name}</span>
              <span className="user-role">Super Administrateur</span>
              <span className="user-badge root">ROOT</span>
            </div>
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
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            <span>Utilisateurs</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            <span className="nav-icon">👑</span>
            <span>Administrateurs</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <span className="nav-icon">⚙️</span>
            <span>Système</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <span className="nav-icon">📋</span>
            <span>Journaux</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            <span className="nav-icon">💾</span>
            <span>Sauvegardes</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <span className="nav-icon">🔒</span>
            <span>Sécurité</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="root-main">
        {/* Header */}
        <div className="main-header">
          <h1>{getTabTitle(activeTab)}</h1>
          <div className="header-actions">
            <button className="action-btn notification">
              <span>🔔</span>
              <span className="badge">3</span>
            </button>
            <button className="action-btn">
              <span>⚡</span>
            </button>
            <div className="datetime">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="main-content">
          {activeTab === 'overview' && (
            <OverviewTab 
              stats={systemStats} 
              activities={recentActivities}
              loading={loading}
            />
          )}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'admins' && <AdminsTab />}
          {activeTab === 'system' && <SystemTab stats={systemStats} />}
          {activeTab === 'logs' && <LogsTab />}
          {activeTab === 'backup' && <BackupTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
};

// ==================== COMPOSANTS DES ONGLETS ====================

// Onglet Vue d'ensemble
const OverviewTab = ({ stats, activities, loading }) => {
  return (
    <div className="overview-tab">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Utilisateurs totaux</span>
          </div>
          <div className="stat-trend">+12%</div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-value">{stats.activeUsers}</span>
            <span className="stat-label">Actifs aujourd'hui</span>
          </div>
          <div className="stat-trend">+5%</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">👑</div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalAdmins}</span>
            <span className="stat-label">Administrateurs</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <span className="stat-value">{stats.dbSize}</span>
            <span className="stat-label">Taille DB</span>
          </div>
        </div>
      </div>

      {/* Graphiques (simulés) */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Utilisateurs par rôle</h3>
          <div className="pie-chart-placeholder">
            <div className="pie-segment admin" style={{ '--percentage': 3 }}>ADMIN 3%</div>
            <div className="pie-segment teacher" style={{ '--percentage': 15 }}>Teacher 15%</div>
            <div className="pie-segment parent" style={{ '--percentage': 28 }}>Parent 28%</div>
            <div className="pie-segment student" style={{ '--percentage': 54 }}>Student 54%</div>
          </div>
        </div>
        <div className="chart-card">
          <h3>Activité récente</h3>
          <div className="activity-list">
            {activities.map(activity => (
              <div key={activity.id} className={`activity-item ${activity.status}`}>
                <div className="activity-icon">
                  {activity.status === 'success' && '✅'}
                  {activity.status === 'warning' && '⚠️'}
                  {activity.status === 'danger' && '❌'}
                  {activity.status === 'info' && 'ℹ️'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.action}</div>
                  <div className="activity-meta">
                    <span>{activity.user}</span> • <span>{activity.target}</span>
                  </div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h3>Actions rapides</h3>
        <div className="actions-grid">
          <button className="quick-action-btn">
            <span className="action-icon">➕</span>
            <span>Nouvel Admin</span>
          </button>
          <button className="quick-action-btn">
            <span className="action-icon">💾</span>
            <span>Sauvegarde</span>
          </button>
          <button className="quick-action-btn">
            <span className="action-icon">📊</span>
            <span>Rapport</span>
          </button>
          <button className="quick-action-btn">
            <span className="action-icon">🔒</span>
            <span>Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Onglet Utilisateurs
const UsersTab = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@email.com', role: 'Teacher', status: 'active', lastLogin: '2024-03-01' },
    { id: 2, name: 'Marie Martin', email: 'marie@email.com', role: 'Parent', status: 'active', lastLogin: '2024-03-02' },
    { id: 3, name: 'Lucas Bernard', email: 'lucas@email.com', role: 'Student', status: 'inactive', lastLogin: '2024-02-28' },
  ]);

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h2>Gestion des utilisateurs</h2>
        <div className="tab-actions">
          <input type="text" placeholder="Rechercher..." className="search-input" />
          <button className="btn-primary">➕ Nouvel utilisateur</button>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span></td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <button className="action-icon-btn">✏️</button>
                  <button className="action-icon-btn">🔒</button>
                  <button className="action-icon-btn">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Onglet Administrateurs
const AdminsTab = () => {
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin System', email: 'admin@phenix.com', level: 'Super Admin', lastActive: 'Maintenant' },
    { id: 2, name: 'Marie Admin', email: 'marie.admin@phenix.com', level: 'Admin', lastActive: 'Il y a 2h' },
  ]);

  return (
    <div className="admins-tab">
      <div className="tab-header">
        <h2>Gestion des administrateurs</h2>
        <button className="btn-primary btn-warning">➕ Nouvel admin</button>
      </div>

      <div className="admins-grid">
        {admins.map(admin => (
          <div key={admin.id} className="admin-card">
            <div className="admin-avatar">
              <span className="avatar-emoji">👑</span>
            </div>
            <div className="admin-info">
              <h3>{admin.name}</h3>
              <p>{admin.email}</p>
              <span className="admin-level">{admin.level}</span>
              <span className="admin-last">Dernière activité: {admin.lastActive}</span>
            </div>
            <div className="admin-actions">
              <button className="admin-action">✏️</button>
              <button className="admin-action">🔒</button>
              <button className="admin-action danger">⚠️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Onglet Système
const SystemTab = ({ stats }) => {
  return (
    <div className="system-tab">
      <h2>Informations système</h2>
      
      <div className="system-grid">
        <div className="system-card">
          <h3>Serveur</h3>
          <div className="system-info">
            <div className="info-row">
              <span>Uptime:</span>
              <strong>{stats.serverUptime}</strong>
            </div>
            <div className="info-row">
              <span>Base de données:</span>
              <strong>MySQL 8.0</strong>
            </div>
            <div className="info-row">
              <span>Taille DB:</span>
              <strong>{stats.dbSize}</strong>
            </div>
            <div className="info-row">
              <span>Node.js:</span>
              <strong>v18.17.0</strong>
            </div>
          </div>
        </div>

        <div className="system-card">
          <h3>Performance</h3>
          <div className="performance-metrics">
            <div className="metric">
              <span>CPU</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '23%'}}></div>
              </div>
              <span>23%</span>
            </div>
            <div className="metric">
              <span>RAM</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '45%'}}></div>
              </div>
              <span>45%</span>
            </div>
            <div className="metric">
              <span>Disque</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '67%'}}></div>
              </div>
              <span>67%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Onglet Journaux
const LogsTab = () => {
  const [logs, setLogs] = useState([
    { time: '10:32:15', level: 'info', message: 'Connexion utilisateur admin@phenix.com' },
    { time: '10:30:22', level: 'warning', message: 'Tentative échec - IP: 192.168.1.5' },
    { time: '10:28:10', level: 'error', message: 'Échec sauvegarde automatique' },
    { time: '10:25:00', level: 'info', message: 'Système démarré' },
  ]);

  return (
    <div className="logs-tab">
      <div className="tab-header">
        <h2>Journaux système</h2>
        <div className="log-filters">
          <select>
            <option>Tous les niveaux</option>
            <option>Info</option>
            <option>Warning</option>
            <option>Error</option>
          </select>
          <button className="btn-secondary">🔄 Rafraîchir</button>
        </div>
      </div>

      <div className="logs-container">
        {logs.map((log, index) => (
          <div key={index} className={`log-entry log-${log.level}`}>
            <span className="log-time">{log.time}</span>
            <span className={`log-level log-level-${log.level}`}>{log.level}</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Onglet Sauvegardes
const BackupTab = () => {
  const [backups, setBackups] = useState([
    { name: 'backup_20240301.sql', size: '156 MB', date: '2024-03-01 23:00', type: 'Auto' },
    { name: 'backup_20240229.sql', size: '152 MB', date: '2024-02-29 23:00', type: 'Auto' },
    { name: 'backup_manual_001.sql', size: '148 MB', date: '2024-02-28 15:30', type: 'Manual' },
  ]);

  return (
    <div className="backup-tab">
      <div className="tab-header">
        <h2>Sauvegardes</h2>
        <button className="btn-primary">💾 Sauvegarder maintenant</button>
      </div>

      <div className="backup-stats">
        <div className="stat-box">
          <span>Dernière sauvegarde</span>
          <strong>2024-03-01 23:00</strong>
        </div>
        <div className="stat-box">
          <span>Total sauvegardes</span>
          <strong>24</strong>
        </div>
        <div className="stat-box">
          <span>Espace utilisé</span>
          <strong>3.2 GB</strong>
        </div>
      </div>

      <table className="backups-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Date</th>
            <th>Taille</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {backups.map((backup, index) => (
            <tr key={index}>
              <td>{backup.name}</td>
              <td>{backup.date}</td>
              <td>{backup.size}</td>
              <td><span className={`backup-type ${backup.type.toLowerCase()}`}>{backup.type}</span></td>
              <td>
                <button className="action-icon-btn">⬇️</button>
                <button className="action-icon-btn">🔄</button>
                <button className="action-icon-btn">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Onglet Sécurité
const SecurityTab = () => {
  return (
    <div className="security-tab">
      <h2>Paramètres de sécurité</h2>

      <div className="security-settings">
        <div className="setting-group">
          <h3>Authentification</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" checked /> Double authentification
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" checked /> Expiration de session (24h)
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" /> Blocage après 5 tentatives
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Pare-feu</h3>
          <div className="setting-item">
            <label>
              <input type="checkbox" checked /> Protection brute force
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" checked /> Limite de requêtes
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>IP Bloquées</h3>
          <div className="blocked-ips">
            <div className="ip-item">
              <span>192.168.1.100</span>
              <button className="unblock-btn">Débloquer</button>
            </div>
            <div className="ip-item">
              <span>10.0.0.56</span>
              <button className="unblock-btn">Débloquer</button>
            </div>
          </div>
          <button className="add-ip-btn">➕ Bloquer une IP</button>
        </div>
      </div>

      <div className="security-actions">
        <button className="btn-primary">Sauvegarder les paramètres</button>
        <button className="btn-secondary">Exécuter un audit</button>
      </div>
    </div>
  );
};

// Helper pour le titre de l'onglet
function getTabTitle(tab) {
  const titles = {
    overview: 'Tableau de bord Root',
    users: 'Gestion des utilisateurs',
    admins: 'Gestion des administrateurs',
    system: 'Informations système',
    logs: 'Journaux système',
    backup: 'Sauvegardes',
    security: 'Sécurité'
  };
  return titles[tab] || 'Dashboard';
}

export default RootDashboard;