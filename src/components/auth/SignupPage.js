// src/components/auth/SignupPage.js
import React, { useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const SignupPage = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [idCardFile, setIdCardFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setIdCardFile(e.target.files[0]);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!idCardFile) {
      setError("Please upload your student ID card.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Upload ID card image to Firebase Storage
      const storageRef = ref(storage, `id_cards/${user.uid}/${idCardFile.name}`);
      await uploadBytes(storageRef, idCardFile);
      const downloadURL = await getDownloadURL(storageRef);

      // 3. Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        studentId,
        role: 'student',
        idCardImageUrl: downloadURL,
        isVerified: false,
        isCheckedIn: false,
        createdAt: new Date(),
      });

      // After signup, the onAuthStateChanged listener in App.js will handle the redirect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Student Account</h2>
      <form onSubmit={handleSignup}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
        <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Student ID Number" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <label>Upload Student ID Card</label>
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <button onClick={() => setPage('login')}>Already have an account? Log In</button>
    </div>
  );
};

export default SignupPage;