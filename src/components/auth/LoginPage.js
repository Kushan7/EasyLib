// src/components/auth/LoginPage.js
import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener in App.js will redirect to the correct dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Log In to Your Account</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
      <button onClick={() => setPage('signup')}>Don't have an account? Sign Up</button>
    </div>
  );
};

export default LoginPage;