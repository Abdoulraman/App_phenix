import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";

// Import des dashboards
import RootDashboard from './pages/RootDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SecretaryDashboard from './pages/SecretaryDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboards par rôle */}
        <Route path="/root/dashboard" element={<RootDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/secretary/dashboard" element={<SecretaryDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        
        {/* Redirection par défaut */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;