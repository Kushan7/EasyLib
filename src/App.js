// src/App.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // Import onSnapshot

// Import all the components
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import StudentDashboard from './components/dashboards/StudentDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import SecurityDashboard from './components/dashboards/SecurityDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('landing');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Set up a real-time listener for user data
        const userDocRef = doc(db, 'users', currentUser.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData({ uid: currentUser.uid, ...docSnap.data() });
          }
          setLoading(false);
        });
        return () => unsubscribeDoc(); // Cleanup the document listener on logout
      } else {
        setUser(null);
        setUserData(null);
        setPage('landing');
        setLoading(false);
      }
    });

    return () => unsubscribeAuth(); // Cleanup the auth listener
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (user && userData) {
      switch (userData.role) {
        case 'student':
          return <StudentDashboard user={user} userData={userData} />;
        case 'admin':
          return <AdminDashboard user={user} userData={userData} />;
        case 'security':
          return <SecurityDashboard user={user} userData={userData} />;
        default:
          return <div>Unknown role. Please contact support.</div>;
      }
    }

    switch (page) {
      case 'login':
        return <LoginPage setPage={setPage} />;
      case 'signup':
        return <SignupPage setPage={setPage} />;
      case 'landing':
      default:
        return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;