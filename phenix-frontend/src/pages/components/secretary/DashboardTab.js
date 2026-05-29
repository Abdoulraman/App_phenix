import React from 'react';
import StatsCard from '../common/StatsCard';

const DashboardTab = ({ students, parents, classes, payments, teachers }) => {
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="dashboard-tab">
      <h2>Tableau de bord</h2>
      
      <div className="stats-grid">
        <StatsCard icon="🎓" value={students.length} label="Élèves inscrits" delay={0.1} />
        <StatsCard icon="👪" value={parents.length} label="Parents" delay={0.2} />
        <StatsCard icon="📚" value={classes.length} label="Classes" delay={0.3} />
        <StatsCard icon="👨‍🏫" value={teachers?.length || 0} label="Enseignants" delay={0.4} />
        <StatsCard icon="💰" value={pendingPayments} label="Paiements en attente" delay={0.5} />
        <StatsCard icon="💵" value={`${totalPayments.toLocaleString()} FCFA`} label="Total encaissé" delay={0.6} />
      </div>

      <div className="quick-actions">
        <h3>Actions rapides</h3>
        <div className="actions-grid">
          <button className="action-btn">➕ Nouvel élève</button>
          <button className="action-btn">💰 Enregistrer paiement</button>
          <button className="action-btn">📝 Saisir notes</button>
          <button className="action-btn">📋 Appel</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;