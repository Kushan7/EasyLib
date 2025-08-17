// src/components/dashboards/SecurityDashboard.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../shared/DashboardLayout';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const SecurityDashboard = ({ user, userData }) => {
  const [checkedInStudents, setCheckedInStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"), where("isCheckedIn", "==", true));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const students = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() });
      });
      setCheckedInStudents(students);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <DashboardLayout user={userData} title="Security Dashboard">
      <h2>Students Currently in Library (Real-Time)</h2>
      {loading ? <p>Loading...</p> : (
        checkedInStudents.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
              </tr>
            </thead>
            <tbody>
              {checkedInStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.studentId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No students are currently checked in.</p>
      )}
    </DashboardLayout>
  );
};

export default SecurityDashboard;