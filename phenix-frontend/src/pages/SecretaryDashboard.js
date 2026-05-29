// src/pages/SecretaryDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SecretaryDashboard.css';

// Importer les sous-composants
import Sidebar from './components/secretary/Sidebar';
import DashboardTab from './components/secretary/DashboardTab';
import StudentsTab from './components/secretary/StudentsTab';
import ParentsTab from './components/secretary/ParentsTab';
import ClassesTab from './components/secretary/ClassesTab';
import GradesTab from './components/secretary/GradesTab';
import AttendanceTab from './components/secretary/AttendanceTab';
import PaymentsTab from './components/secretary/PaymentsTab';
import BadgesTab from './components/secretary/BadgesTab';
import ReportsTab from './components/secretary/ReportsTab';

const SecretaryDashboard = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les données - TOUJOURS des tableaux par défaut
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ============================================
  // FONCTION DE RÉCUPÉRATION DES DONNÉES
  // ============================================
  
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const endpoints = [
        { key: 'classes', url: `${API_URL}/api/classes` },
        { key: 'students', url: `${API_URL}/api/students` },
        { key: 'parents', url: `${API_URL}/api/parents` },
        { key: 'payments', url: `${API_URL}/api/payments` },
        { key: 'grades', url: `${API_URL}/api/grades` },
        { key: 'teachers', url: `${API_URL}/api/teachers` },
        { key: 'subjects', url: `${API_URL}/api/subjects` }
      ];

      const results = await Promise.all(
        endpoints.map(async (e) => {
          try {
            const res = await fetch(e.url, { headers });
            if (!res.ok) throw new Error(`Erreur ${res.status}`);
            const data = await res.json();
            
            // Gérer différents formats de réponse
            let resultData = data.data || data.students || data;
            
            // S'assurer que c'est un tableau
            if (!Array.isArray(resultData)) {
              console.warn(`⚠️ ${e.key} n'est pas un tableau:`, resultData);
              resultData = [];
            }
            
            return { key: e.key, data: resultData };
          } catch (err) {
            console.error(`❌ Erreur ${e.key}:`, err);
            return { key: e.key, data: [] };
          }
        })
      );

      // Mettre à jour les états
      results.forEach(r => {
        switch(r.key) {
          case 'classes': setClasses(r.data); break;
          case 'students': setStudents(r.data); break;
          case 'parents': setParents(r.data); break;
          case 'payments': setPayments(r.data); break;
          case 'grades': setGrades(r.data); break;
          case 'teachers': setTeachers(r.data); break;
          case 'subjects': setSubjects(r.data); break;
          default: break;
        }
      });

    } catch (err) {
      console.error('❌ Erreur fetchAllData:', err);
      setError('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  }, [API_URL, navigate]);

  // ============================================
  // VÉRIFICATION AUTHENTIFICATION
  // ============================================
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role_id !== 2) {
        navigate('/dashboard');
        return;
      }
      setUser(userData);
      fetchAllData();
    } catch (e) {
      console.error('❌ Erreur parsing user:', e);
      navigate('/login');
    }
  }, [navigate, fetchAllData, refreshTrigger]);

  // ============================================
  // FONCTIONS UTILITAIRES
  // ============================================
  
  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password + "123";
  };

  // ============================================
  // HANDLERS CRUD
  // ============================================
  
  const handleAddStudent = async (studentData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Création élève:', studentData);
      
      const res = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      const data = await res.json();
      console.log('📥 Réponse création:', data);

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        
        // Récupérer l'ID de l'élève créé
        const studentId = data.student?.id || data.data?.id;
        
        return { 
          success: true, 
          studentId: studentId,
          message: 'Élève créé avec succès'
        };
      } else {
        return { 
          success: false, 
          message: data.message || 'Erreur lors de la création' 
        };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { 
        success: false, 
        message: 'Erreur de connexion' 
      };
    }
  };

  const handleUpdateStudent = async (id, studentData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('📤 Modification élève ID:', id, studentData);
      
      const res = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      const responseData = await res.json();
      console.log('📥 Réponse modification:', responseData);

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        return { 
          success: true, 
          message: 'Élève modifié avec succès' 
        };
      } else {
        return { 
          success: false, 
          message: responseData.message || 'Erreur lors de la modification' 
        };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { 
        success: false, 
        message: 'Erreur de connexion' 
      };
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/api/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        return { 
          success: true, 
          message: 'Élève supprimé avec succès' 
        };
      } else {
        return { 
          success: false, 
          message: data.message || 'Erreur lors de la suppression' 
        };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { 
        success: false, 
        message: 'Erreur de connexion' 
      };
    }
  };

  const handleAddParent = async (parentData) => {
    try {
      const token = localStorage.getItem('token');
      const password = generatePassword();
      
      const data = {
        ...parentData,
        password: password,
        role_id: 4
      };

      const res = await fetch(`${API_URL}/api/parents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        return { 
          success: true, 
          message: `✅ Parent créé avec succès !\n📧 Email: ${parentData.email}\n🔑 Mot de passe: ${password}` 
        };
      } else {
        return { 
          success: false, 
          message: responseData.message || 'Erreur lors de la création' 
        };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { 
        success: false, 
        message: 'Erreur de connexion' 
      };
    }
  };

  const handleAddClass = async (classData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/classes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(classData)
      });

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        return { success: true, message: 'Classe créée avec succès' };
      } else {
        const error = await res.json();
        return { success: false, message: error.message || 'Erreur lors de la création' };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const handleAddGrade = async (gradeData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/grades`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gradeData)
      });

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        return { success: true, message: 'Note enregistrée avec succès' };
      } else {
        const error = await res.json();
        return { success: false, message: error.message || 'Erreur lors de l\'enregistrement' };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await res.json();

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        return { success: true, message: 'Paiement enregistré avec succès' };
      } else {
        return { success: false, message: data.message || 'Erreur lors de l\'enregistrement' };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const handleSaveAttendance = async (attendanceData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData)
      });

      if (res.ok) {
        return { success: true, message: 'Présences enregistrées avec succès' };
      } else {
        const error = await res.json();
        return { success: false, message: error.message || 'Erreur lors de l\'enregistrement' };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/payments/${paymentId}/confirm`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setRefreshTrigger(prev => prev + 1);
        return { success: true, message: 'Paiement confirmé' };
      } else {
        const error = await res.json();
        return { success: false, message: error.message || 'Erreur lors de la confirmation' };
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // ============================================
  // RENDU
  // ============================================
  
  if (loading) {
    return <div className="loading">Chargement des données...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="secretary-dashboard">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <div className="secretary-main">
        <div className="main-header">
          <h1>Espace Secrétariat</h1>
          <div className="date">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        <div className="content-area">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              students={students}
              parents={parents}
              classes={classes}
              payments={payments}
              teachers={teachers}
            />
          )}
          
          {activeTab === 'students' && (
            <StudentsTab 
              students={students}
              classes={classes}
              parents={parents}
              onAdd={handleAddStudent}
              onUpdate={handleUpdateStudent}
              onDelete={handleDeleteStudent}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              generatePassword={generatePassword}
              API_URL={API_URL}
            />
          )}
          
          {activeTab === 'parents' && (
            <ParentsTab 
              parents={parents}
              students={students}
              onAdd={handleAddParent}
            />
          )}
          
          {activeTab === 'classes' && (
            <ClassesTab 
              classes={classes}
              students={students}
              onAdd={handleAddClass}
            />
          )}
          
          {activeTab === 'grades' && (
            <GradesTab 
              students={students}
              classes={classes}
              subjects={subjects}
              teachers={teachers}
              grades={grades}
              onAddGrade={handleAddGrade}
            />
          )}
          
          {activeTab === 'attendance' && (
            <AttendanceTab 
              students={students}
              classes={classes}
              onSave={handleSaveAttendance}
            />
          )}
          
          {activeTab === 'payments' && (
            <PaymentsTab 
              payments={payments}
              students={students}
              onAddPayment={handleAddPayment}
              onConfirm={handleConfirmPayment}
              formatCurrency={formatCurrency}
              API_URL={API_URL}
            />
          )}
          
          {activeTab === 'badges' && (
            <BadgesTab 
              students={students}
              classes={classes}
              API_URL={API_URL}
            />
          )}
          
          {activeTab === 'reports' && (
            <ReportsTab 
              students={students}
              payments={payments}
              classes={classes}
              formatCurrency={formatCurrency}
              API_URL={API_URL}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashboard;