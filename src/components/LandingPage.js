// src/components/LandingPage.js
import React from 'react';

const LandingPage = ({ setPage }) => {
  return (
    <div>
      <h1>Welcome to the Library Access System</h1>
      <p>Your digital key to the library. No more physical IDs needed.</p>
      <div>
        <button onClick={() => setPage('login')}>Log In</button>
        <button onClick={() => setPage('signup')}>Student Sign Up</button>
      </div>
    </div>
  );
};

export default LandingPage;