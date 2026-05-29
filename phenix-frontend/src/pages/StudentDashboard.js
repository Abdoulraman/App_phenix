import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role_id !== 5) {
        navigate('/dashboard');
        return;
      }
      setUser(userData);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="student-dashboard">
      <h1>Espace Élève</h1>
      <p>Bienvenue {user?.full_name}</p>
    </div>
  );
};

export default StudentDashboard;