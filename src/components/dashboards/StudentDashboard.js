// src/components/dashboards/StudentDashboard.js
import React, { useState } from 'react';
import DashboardLayout from '../shared/DashboardLayout';
import QRScanner from '../shared/QRScanner';
import { db } from '../../firebase';
import { doc, updateDoc, addDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

const StudentDashboard = ({ user, userData }) => {
  const [message, setMessage] = useState('');

  const handleCheckInOut = async (deskId) => {
    setMessage('');
    const userRef = doc(db, "users", user.uid);
    const newStatus = !userData.isCheckedIn;

    try {
      await updateDoc(userRef, { isCheckedIn: newStatus });

      if (newStatus) { // Checked IN
        await addDoc(collection(db, "libraryLogs"), {
          studentUid: user.uid,
          studentName: userData.name,
          deskId: deskId,
          checkInTime: new Date(),
          checkOutTime: null,
        });
        setMessage(`Successfully checked in at ${deskId}.`);
      } else { // Checked OUT
        const q = query(
          collection(db, "libraryLogs"),
          where("studentUid", "==", user.uid),
          where("checkOutTime", "==", null),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const logDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, "libraryLogs", logDoc.id), {
            checkOutTime: new Date(),
          });
        }
        setMessage('Successfully checked out. Have a great day!');
      }
      // Note: A full app would use a real-time listener to update the UI instantly.
      // For now, the user may need to refresh to see the status change.
    } catch (error) {
      console.error("Error updating status: ", error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <DashboardLayout user={userData} title="Student Dashboard">
      <div>
        {userData.isVerified ? (
          <div style={{ color: 'green', border: '1px solid green', padding: '1rem', marginBottom: '1rem' }}>
            <p><strong>Account Verified:</strong> You can now check in to the library.</p>
          </div>
        ) : (
          <div style={{ color: 'orange', border: '1px solid orange', padding: '1rem', marginBottom: '1rem' }}>
            <p><strong>Verification Pending:</strong> An administrator will review your ID soon.</p>
          </div>
        )}

        {userData.isVerified && (
          <div>
            <h3>Library Check-in</h3>
            <p>Current Status: <strong>{userData.isCheckedIn ? 'Checked IN' : 'Checked OUT'}</strong></p>
            
            {userData.isCheckedIn ? (
              <button onClick={() => handleCheckInOut(null)}>Check Out</button>
            ) : (
              <QRScanner onScan={handleCheckInOut} />
            )}

            {message && <p>{message}</p>}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;