// src/components/shared/DashboardLayout.js
import React from 'react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const DashboardLayout = ({ user, children, title }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>{title}</h1>
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={handleSignOut} style={{ marginLeft: '1rem' }}>Sign Out</button>
        </div>
      </header>
      <main style={{ padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;