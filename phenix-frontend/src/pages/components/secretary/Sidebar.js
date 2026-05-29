import React from 'react';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
    { id: 'students', icon: '🎓', label: 'Élèves' },
    { id: 'parents', icon: '👪', label: 'Parents' },
    { id: 'classes', icon: '📚', label: 'Classes' },
    { id: 'grades', icon: '📝', label: 'Notes' },
    { id: 'attendance', icon: '📋', label: 'Présences' },
    { id: 'payments', icon: '💰', label: 'Paiements' },
    { id: 'badges', icon: '🪪', label: "Badges d'accès" },
    { id: 'reports', icon: '📄', label: 'Reçus & Rapports' }
  ];

  return (
    <div className="secretary-sidebar">
      <div className="sidebar-header">
        <div className="secretary-avatar">👩‍💼</div>
        <div className="secretary-info">
          <h3>{user?.full_name || 'Secrétaire'}</h3>
          <p>Secrétariat</p>
          <span className="badge secretary-badge">SECRÉTAIRE</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <span className="nav-icon">🚪</span>
        <span>Déconnexion</span>
      </button>
    </div>
  );
};

export default Sidebar;