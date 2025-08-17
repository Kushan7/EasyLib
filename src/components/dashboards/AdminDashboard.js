// src/components/dashboards/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../shared/DashboardLayout';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const AdminDashboard = ({ user, userData }) => {
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "student"), where("isVerified", "==", false));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const students = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() });
      });
      setUnverifiedStudents(students);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleVerify = async (studentId) => {
    const userRef = doc(db, "users", studentId);
    try {
      await updateDoc(userRef, { isVerified: true });
    } catch (error) {
      console.error("Error verifying student: ", error);
    }
  };

  return (
    <DashboardLayout user={userData} title="Admin Dashboard">
      <h2>Pending Student Verifications</h2>
      {loading ? <p>Loading...</p> : (
        unverifiedStudents.length > 0 ? (
          <div>
            {unverifiedStudents.map(student => (
              <div key={student.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Student ID:</strong> {student.studentId}</p>
                <p><a href={student.idCardImageUrl} target="_blank" rel="noopener noreferrer">View ID Card</a></p>
                <button onClick={() => handleVerify(student.id)}>Verify Student</button>
              </div>
            ))}
          </div>
        ) : <p>No students are pending verification.</p>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;