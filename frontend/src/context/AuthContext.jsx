import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLocalUser, setLocalUser, loginUser, registerUser, logoutUser, DEMO_USERS } from '../services/authService.js';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getLocalUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const mapped = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email,
            role: user?.role || 'Security Analyst',
            hospitalId: user?.hospitalId || 'hosp-a',
            hospitalName: user?.hospitalName || 'Hospital A (Metropolitan General)'
          };
          setUser(mapped);
          setLocalUser(mapped);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await loginUser(email, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const registeredUser = await registerUser(formData);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const switchDemoRole = (roleKey) => {
    const selected = DEMO_USERS[roleKey];
    if (selected) {
      setUser(selected);
      setLocalUser(selected);
    }
  };

  const updateProfileData = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    setLocalUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchDemoRole, updateProfileData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
