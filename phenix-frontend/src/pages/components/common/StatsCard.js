import React from 'react';

const StatsCard = ({ icon, value, label, delay = 0.1 }) => {
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}s` }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;