import React, { useEffect } from 'react';

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch(type) {
      case 'success':
        return {
          background: '#48bb78',
          icon: '✅'
        };
      case 'error':
        return {
          background: '#f56565',
          icon: '❌'
        };
      case 'warning':
        return {
          background: '#ed8936',
          icon: '⚠️'
        };
      default:
        return {
          background: '#4299e1',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getStyles();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: styles.background,
      color: 'white',
      padding: '15px 25px',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <span style={{ fontSize: '1.2rem' }}>{styles.icon}</span>
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          marginLeft: '15px',
          cursor: 'pointer',
          fontSize: '1.2rem'
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default Notification;