import React, { useState } from 'react';

const StudentPhoto = ({ 
  student, 
  size = 'medium', 
  className = '', 
  onClick,
  showUploadButton = false,
  onUpload,
  editable = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Obtenir le chemin de la photo
  const getPhotoPath = () => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    return `${API_URL}/src/images/students/student-${student.id}.jpg`;
  };

  // Obtenir les initiales
  const getInitials = () => {
    const firstName = student.student_user?.first_name || student.first_name || '';
    const lastName = student.student_user?.last_name || student.last_name || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  // Obtenir le nom complet
  const getFullName = () => {
    const firstName = student.student_user?.first_name || student.first_name || '';
    const lastName = student.student_user?.last_name || student.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Élève';
  };

  // Couleurs basées sur l'ID
  const getBackgroundColor = () => {
    const colors = [
      'linear-gradient(135deg, #805ad5, #6b46c1)',
      'linear-gradient(135deg, #4299e1, #3182ce)',
      'linear-gradient(135deg, #48bb78, #38a169)',
      'linear-gradient(135deg, #ed8936, #dd6b20)',
      'linear-gradient(135deg, #f56565, #e53e3e)',
    ];
    return colors[(student.id || 0) % colors.length];
  };

  // Tailles
  const getSizeStyle = () => {
    const sizes = {
      small: { width: '40px', height: '40px', fontSize: '16px' },
      medium: { width: '80px', height: '80px', fontSize: '24px' },
      large: { width: '120px', height: '120px', fontSize: '36px' },
      xlarge: { width: '200px', height: '200px', fontSize: '48px' }
    };
    return sizes[size] || sizes.medium;
  };

  const sizeStyle = getSizeStyle();
  const initials = getInitials();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div 
      className={`student-photo-container ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => editable && setShowOptions(true)}
      onMouseLeave={() => editable && setShowOptions(false)}
    >
      <div 
        className={`student-photo ${imageLoaded ? 'loaded' : ''}`}
        onClick={onClick}
        style={{
          ...sizeStyle,
          borderRadius: size === 'small' ? '50%' : '10px',
          background: getBackgroundColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          overflow: 'hidden',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          position: 'relative',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      >
        {!imageError && (
          <img
            src={getPhotoPath()}
            alt={getFullName()}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}
        
        {(!imageLoaded || imageError) && (
          <span style={{
            fontSize: sizeStyle.fontSize,
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}>
            {initials || '👤'}
          </span>
        )}
      </div>

      {/* Bouton d'upload (optionnel) */}
      {showUploadButton && editable && showOptions && (
        <div style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          background: 'white',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}>
          <label htmlFor={`upload-${student.id}`} style={{ cursor: 'pointer', fontSize: '16px' }}>
            📷
          </label>
          <input
            type="file"
            id={`upload-${student.id}`}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default StudentPhoto;