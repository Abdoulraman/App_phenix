// src/pages/components/secretary/AttendanceTab.js
import React, { useState } from 'react';

const AttendanceTab = ({ students = [], classes = [], onSave }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});

  // Vérifier que students est un tableau
  const classStudents = Array.isArray(students) && selectedClass
    ? students.filter(s => s && s.class_id === parseInt(selectedClass))
    : [];

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = async () => {
    if (!selectedClass) {
      alert('Veuillez sélectionner une classe');
      return;
    }

    const attendanceData = {
      class_id: parseInt(selectedClass),
      date: selectedDate,
      attendance: Object.entries(attendance).map(([studentId, status]) => ({
        student_id: parseInt(studentId),
        status
      }))
    };
    
    const result = await onSave(attendanceData);
    if (result?.success) {
      setAttendance({});
    }
  };

  return (
    <div className="attendance-tab">
      <div className="tab-header">
        <h2>Gestion des présences</h2>
        <div className="filters">
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="filter-select"
          >
            <option value="">Sélectionner une classe</option>
            {Array.isArray(classes) && classes.map(c => (
              <option key={c?.id} value={c?.id}>{c?.name}</option>
            ))}
          </select>
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      {selectedClass ? (
        <div className="attendance-sheet">
          <div className="attendance-header">
            <h3>
              {Array.isArray(classes) && classes.find(c => c?.id === parseInt(selectedClass))?.name} - 
              {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button className="btn-primary" onClick={handleSave}>
              💾 Enregistrer
            </button>
          </div>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Élève</th>
                <th>Présent</th>
                <th>Absent</th>
                <th>Retard</th>
                <th>Excusé</th>
              </tr>
            </thead>
            <tbody>
              {classStudents.length > 0 ? (
                classStudents.map((student, index) => (
                  <tr key={student?.id || index}>
                    <td>{index + 1}</td>
                    <td>{student?.first_name} {student?.last_name}</td>
                    <td className="text-center">
                      <input 
                        type="radio" 
                        name={`attendance-${student?.id}`}
                        checked={attendance[student?.id] === 'present'}
                        onChange={() => handleAttendanceChange(student?.id, 'present')}
                      />
                    </td>
                    <td className="text-center">
                      <input 
                        type="radio" 
                        name={`attendance-${student?.id}`}
                        checked={attendance[student?.id] === 'absent'}
                        onChange={() => handleAttendanceChange(student?.id, 'absent')}
                      />
                    </td>
                    <td className="text-center">
                      <input 
                        type="radio" 
                        name={`attendance-${student?.id}`}
                        checked={attendance[student?.id] === 'late'}
                        onChange={() => handleAttendanceChange(student?.id, 'late')}
                      />
                    </td>
                    <td className="text-center">
                      <input 
                        type="radio" 
                        name={`attendance-${student?.id}`}
                        checked={attendance[student?.id] === 'excused'}
                        onChange={() => handleAttendanceChange(student?.id, 'excused')}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Aucun élève dans cette classe
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-selection">
          <p>Veuillez sélectionner une classe</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;