// Custom React Hook for Firebase Authentication

import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange } from '../firebase/auth';
import { getUserProfile } from '../firebase/db';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch (err: any) {
          setError(err.message);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user
  };
};
