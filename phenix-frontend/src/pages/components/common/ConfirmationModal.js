import React from 'react';

const ConfirmationModal = ({ title, message, warning, onConfirm, onCancel, loading }) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ background: '#ef4444' }}>
          <h3 style={{ color: 'white' }}>{title || 'Confirmation'}</h3>
          <button className="modal-close" onClick={onCancel}>✖</button>
        </div>
        <div className="modal-body" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem' }}>{message}</p>
          {warning && (
            <p style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '20px' }}>
              {warning}
            </p>
          )}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              className="btn-primary" 
              onClick={onConfirm}
              disabled={loading}
              style={{ background: '#ef4444' }}
            >
              {loading ? 'Suppression...' : 'Confirmer'}
            </button>
            <button 
              className="btn-secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;