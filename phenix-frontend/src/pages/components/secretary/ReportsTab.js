import React, { useState } from 'react';

const ReportsTab = ({ students, payments, classes, formatCurrency }) => {
  const [selectedStudent, setSelectedStudent] = useState('');

  const handlePrintReceipt = () => {
    if (!selectedStudent) {
      alert('Veuillez sélectionner un élève');
      return;
    }

    const student = students.find(s => s.id === parseInt(selectedStudent));
    const studentPayments = payments.filter(p => p.student_id === parseInt(selectedStudent));
    const totalPaid = studentPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const className = classes.find(c => c.id === student?.class_id)?.name || '';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reçu de paiement - Centre Le Phénix</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
            .receipt { max-width: 800px; margin: 0 auto; border: 2px solid #0f2e6d; padding: 30px; border-radius: 15px; background: white; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #fbbf24; padding-bottom: 20px; }
            .header h1 { color: #0f2e6d; margin: 0; }
            .info { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #fbbf24; color: #0f2e6d; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>Centre de Soutien Scolaire Le Phénix</h1>
              <h2>Reçu de paiement</h2>
            </div>
            <div class="info">
              <p><strong>Élève:</strong> ${student?.first_name} ${student?.last_name}</p>
              <p><strong>Classe:</strong> ${className}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            <table>
              <thead>
                <tr><th>Type</th><th>Montant</th><th>Date</th><th>Statut</th></tr>
              </thead>
              <tbody>
                ${studentPayments.map(p => `
                  <tr>
                    <td>${p.payment_type || 'Mensualité'}</td>
                    <td>${formatCurrency(p.amount)}</td>
                    <td>${p.payment_date ? new Date(p.payment_date).toLocaleDateString('fr-FR') : '-'}</td>
                    <td>${p.status === 'paid' ? '✅ Payé' : '⏳ En attente'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total">Total payé: ${formatCurrency(totalPaid)}</div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="reports-tab">
      <div className="tab-header">
        <h2>Reçus et rapports</h2>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Reçu de paiement</h3>
          <select 
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="student-select"
          >
            <option value="">Sélectionner un élève</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name}
              </option>
            ))}
          </select>
          <button className="btn-primary" onClick={handlePrintReceipt}>
            🖨️ Imprimer le reçu
          </button>
        </div>

        <div className="report-card">
          <h3>Rapport de classe</h3>
          <select className="class-select">
            <option value="">Sélectionner une classe</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="btn-primary">📊 Générer le rapport</button>
        </div>

        <div className="report-card">
          <h3>État des paiements</h3>
          <select className="month-select">
            <option value="">Sélectionner un mois</option>
            <option value="1">Janvier</option>
            <option value="2">Février</option>
            <option value="3">Mars</option>
          </select>
          <button className="btn-primary">💰 État des paiements</button>
        </div>

        <div className="report-card">
          <h3>Liste des élèves</h3>
          <select className="list-class-select">
            <option value="">Toutes les classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="btn-primary">📋 Générer la liste</button>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;