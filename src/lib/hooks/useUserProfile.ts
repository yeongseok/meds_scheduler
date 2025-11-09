// Custom React Hook for User Profile Management

import { useState, useEffect } from 'react';
import { User } from '../types';
import {
  getUserProfile as getUserProfileDB,
  updateUserProfile as updateUserProfileDB,
  uploadProfilePhoto as uploadProfilePhotoDB
} from '../firebase/db';

export const useUserProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfileDB(userId);
        setProfile(userProfile);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<User>) => {
    if (!userId) {
      throw new Error('User ID is required to update profile');
    }

    try {
      await updateUserProfileDB(userId, updates);
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const uploadProfilePhoto = async (file: File): Promise<string> => {
    if (!userId) {
      throw new Error('User ID is required to upload profile photo');
    }

    try {
      const photoURL = await uploadProfilePhotoDB(userId, file);
      
      // Update local state
      setProfile(prev => prev ? { ...prev, photoURL } : null);
      
      return photoURL;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const refreshProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userProfile = await getUserProfileDB(userId);
      setProfile(userProfile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadProfilePhoto,
    refreshProfile
  };
};
