'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
