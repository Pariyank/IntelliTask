import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken();
        const role = localStorage.getItem('selectedRole');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-user-role': role
          }
        });

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['x-user-role'] = role;

        setUser(res.data);
      } catch (err) {
        console.error("Auth Sync Error:", err.response?.data?.message || err.message);
        if (err.response?.status === 403) {
          alert(err.response.data.message);
          await logout();
        }
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  });
  return unsubscribe;
}, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  const signupWithEmail = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    return res.user;
  };

  const loginWithEmail = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);

  const logout = async () => {
    localStorage.removeItem('selectedRole');
    await signOut(auth);
    window.location.reload(); 
  };

  return (
    <AuthContext.Provider value={{ 
      user, loginWithGoogle, signupWithEmail, loginWithEmail, logout, loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);