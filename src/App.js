// src/App.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Import all the components we've created
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

// Placeholder for dashboards we will create later
// import StudentDashboard from './components/dashboards/StudentDashboard';
// import AdminDashboard from './components/dashboards/AdminDashboard';
// import SecurityDashboard from './components/dashboards/SecurityDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('landing'); // 'landing', 'login', or 'signup'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData({ uid: currentUser.uid, ...userDoc.data() });
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setUserData(null);
        setPage('landing'); // Default to landing page on logout
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    // If user is logged in, show their dashboard
    if (user && userData) {
      switch (userData.role) {
        // We will add the dashboard components here in the next step
        case 'student':
          return <div>Student Dashboard (Coming Soon)</div>;
        case 'admin':
          return <div>Admin Dashboard (Coming Soon)</div>;
        case 'security':
          return <div>Security Dashboard (Coming Soon)</div>;
        default:
          return <div>Unknown role. Please contact support.</div>;
      }
    }

    // If no user, show the correct auth page
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