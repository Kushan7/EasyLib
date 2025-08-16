// src/App.js
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; // Import your Firebase services
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// We'll create these components in the next steps
// import LandingPage from './components/LandingPage';
// import StudentDashboard from './components/dashboards/StudentDashboard';
// import AdminDashboard from './components/dashboards/AdminDashboard';
// import SecurityDashboard from './components/dashboards/SecurityDashboard';
// import LoginPage from './components/auth/LoginPage';
// import SignupPage from './components/auth/SignupPage';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener checks for login/logout changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // If user is logged in, fetch their data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData({ uid: currentUser.uid, ...userDoc.data() });
        }
        setUser(currentUser);
      } else {
        // If user is logged out, clear their data
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // This is a placeholder for now. We will build out the real logic here.
  return (
    <div>
      <h1>Library Check-in System</h1>
      {user ? (
        <p>Welcome, {userData ? userData.name : user.email}!</p>
      ) : (
        <p>Please log in or sign up.</p>
      )}
    </div>
  );
}

export default App;