// Custom React Hook for Guardian Management

import { useState, useEffect } from 'react';
import { Guardian } from '../types';
import { 
  getGuardians as getGuardiansDB,
  addGuardian as addGuardianDB,
  updateGuardian as updateGuardianDB,
  deleteGuardian as deleteGuardianDB,
  listenToGuardians
} from '../firebase/db';

export const useGuardians = (userId: string | undefined, realtime: boolean = false) => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    if (realtime) {
      // Subscribe to real-time updates
      const unsubscribe = listenToGuardians(userId, (updatedGuardians) => {
        setGuardians(updatedGuardians);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      const fetchGuardians = async () => {
        try {
          const userGuardians = await getGuardiansDB(userId);
          setGuardians(userGuardians);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchGuardians();
    }
  }, [userId, realtime]);

  const addGuardian = async (guardian: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await addGuardianDB(guardian);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateGuardian = async (guardianId: string, updates: Partial<Guardian>) => {
    try {
      await updateGuardianDB(guardianId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteGuardian = async (guardianId: string) => {
    try {
      await deleteGuardianDB(guardianId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    guardians,
    loading,
    error,
    addGuardian,
    updateGuardian,
    deleteGuardian
  };
};
