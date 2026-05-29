import React, { useState } from 'react';
import PaymentForm from './PaymentForm';

const PaymentsTab = ({ payments = [], students = [], onAddPayment, onConfirm, formatCurrency, API_URL }) => {
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredPayments = payments.filter(p => {
    // Filtre par statut
    if (filter === 'paid' && p.status !== 'paid') return false;
    if (filter === 'pending' && p.status !== 'pending') return false;
    
    // Filtre par élève
    if (selectedStudent && p.student_id !== parseInt(selectedStudent)) return false;
    
    // Filtre par date
    if (dateRange.start && new Date(p.payment_date) < new Date(dateRange.start)) return false;
    if (dateRange.end && new Date(p.payment_date) > new Date(dateRange.end)) return false;
    
    return true;
  });

  // Fonction pour obtenir le nom de l'élève
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 'Inconnu';
    
    if (student.student_user) {
      return `${student.student_user.first_name} ${student.student_user.last_name}`;
    }
    return `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Inconnu';
  };

  // Fonction pour obtenir la classe de l'élève
  const getStudentClass = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student?.class?.name || '-';
  };

  const handlePrintReceipt = (payment) => {
    const student = students.find(s => s.id === payment.student_id);
    const studentName = getStudentName(payment.student_id);
    const className = getStudentClass(payment.student_id);

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
            .header h2 { color: #666; font-weight: normal; margin: 5px 0 0; }
            .info { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .info p { margin: 5px 0; }
            .amount-box { 
              background: linear-gradient(135deg, #805ad5, #6b46c1); 
              color: white; 
              padding: 20px; 
              border-radius: 10px; 
              text-align: center; 
              margin: 20px 0; 
            }
            .amount-box .label { font-size: 14px; opacity: 0.9; }
            .amount-box .value { font-size: 36px; font-weight: bold; margin: 10px 0; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            .signature { margin-top: 30px; display: flex; justify-content: space-between; }
            .signature-line { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>🏫 Centre de Soutien Scolaire Le Phénix</h1>
              <h2>Reçu de paiement N° ${payment.id}</h2>
            </div>
            
            <div class="info">
              <p><strong>Élève:</strong> ${studentName}</p>
              <p><strong>Classe:</strong> ${className}</p>
              <p><strong>Date:</strong> ${new Date(payment.payment_date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p><strong>Type:</strong> ${payment.payment_type || 'Scolarité'}</p>
              <p><strong>Mode:</strong> ${(payment.payment_method || 'ESPECES').replace('_', ' ')}</p>
            </div>

            <div class="amount-box">
              <div class="label">Montant payé</div>
              <div class="value">${formatCurrency(payment.amount)}</div>
            </div>

            <div class="signature">
              <div>
                <div class="signature-line">Signature du parent</div>
              </div>
              <div>
                <div class="signature-line">Cachet du centre</div>
              </div>
            </div>

            <div class="footer">
              <p>Merci de votre confiance</p>
              <p>Ce reçu fait office de justificatif officiel</p>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintMultipleReceipts = () => {
    if (filteredPayments.length === 0) {
      alert('Aucun paiement à imprimer');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Reçus multiples - Centre Le Phénix</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
            .receipt-page { 
              max-width: 800px; 
              margin: 20px auto; 
              border: 2px solid #0f2e6d; 
              padding: 30px; 
              border-radius: 15px; 
              background: white;
              page-break-after: always;
            }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #fbbf24; padding-bottom: 20px; }
            .header h1 { color: #0f2e6d; margin: 0; font-size: 20px; }
            .info { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .amount-box { background: linear-gradient(135deg, #805ad5, #6b46c1); color: white; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0; }
            .amount-box .value { font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          ${filteredPayments.map(payment => {
            const studentName = getStudentName(payment.student_id);
            const className = getStudentClass(payment.student_id);
            return `
              <div class="receipt-page">
                <div class="header">
                  <h1>🏫 Centre Le Phénix</h1>
                  <h3>Reçu N° ${payment.id}</h3>
                </div>
                <div class="info">
                  <p><strong>Élève:</strong> ${studentName}</p>
                  <p><strong>Classe:</strong> ${className}</p>
                  <p><strong>Date:</strong> ${new Date(payment.payment_date).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Type:</strong> ${payment.payment_type || 'Scolarité'}</p>
                </div>
                <div class="amount-box">
                  <div class="value">${formatCurrency(payment.amount)}</div>
                </div>
                <div style="margin-top: 30px; display: flex; justify-content: space-between;">
                  <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">Signature</div>
                  <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">Cachet</div>
                </div>
              </div>
            `;
          }).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="payments-tab">
      <div className="tab-header">
        <h2>Gestion des paiements</h2>
        <div className="tab-actions">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✖ Annuler' : '💰 Nouveau paiement'}
          </button>
        </div>
      </div>

      {showForm && (
        <PaymentForm
          students={students}
          onSave={onAddPayment}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="filters">
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Tous les paiements</option>
          <option value="paid">Payés</option>
          <option value="pending">En attente</option>
        </select>

        <select 
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les élèves</option>
          {students.map(s => (
            <option key={s.id} value={s.id}>
              {getStudentName(s.id)}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          className="date-input"
          placeholder="Date début"
        />

        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          className="date-input"
          placeholder="Date fin"
        />

        {filteredPayments.length > 0 && (
          <button className="btn-primary" onClick={handlePrintMultipleReceipts}>
            🖨️ Imprimer {filteredPayments.length} reçu(s)
          </button>
        )}
      </div>

      <table className="payments-table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Élève</th>
            <th>Classe</th>
            <th>Type</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Mode</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.length > 0 ? (
            filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td>#{payment.id}</td>
                <td>{getStudentName(payment.student_id)}</td>
                <td>{getStudentClass(payment.student_id)}</td>
                <td>{payment.payment_type || 'Scolarité'}</td>
                <td><strong>{formatCurrency(payment.amount)}</strong></td>
                <td>{new Date(payment.payment_date).toLocaleDateString('fr-FR')}</td>
                <td>{(payment.payment_method || 'ESPECES').replace('_', ' ')}</td>
                <td>
                  <span className={`status-badge ${payment.status || 'paid'}`}>
                    {payment.status === 'pending' ? '⏳ En attente' : '✅ Payé'}
                  </span>
                </td>
                <td>
                  <button 
                    className="icon-btn" 
                    onClick={() => handlePrintReceipt(payment)}
                    title="Imprimer le reçu"
                  >
                    🖨️
                  </button>
                  {payment.status === 'pending' && (
                    <button 
                      className="icon-btn success"
                      onClick={() => onConfirm(payment.id)}
                      title="Confirmer le paiement"
                    >
                      ✅
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                Aucun paiement trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {filteredPayments.length > 0 && (
        <div className="table-footer">
          <p>
            <strong>Total:</strong> {formatCurrency(
              filteredPayments.reduce((sum, p) => sum + p.amount, 0)
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;