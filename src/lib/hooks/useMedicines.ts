// Custom React Hook for Medicine Management

import { useState, useEffect } from 'react';
import { Medicine } from '../types';
import { 
  getUserMedicines, 
  addMedicine as addMedicineDB,
  updateMedicine as updateMedicineDB,
  deleteMedicine as deleteMedicineDB,
  listenToUserMedicines
} from '../firebase/db';

export const useMedicines = (userId: string | undefined, realtime: boolean = false) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    if (realtime) {
      // Subscribe to real-time updates
      const unsubscribe = listenToUserMedicines(userId, (updatedMedicines) => {
        setMedicines(updatedMedicines);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      const fetchMedicines = async () => {
        try {
          const userMedicines = await getUserMedicines(userId);
          setMedicines(userMedicines);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMedicines();
    }
  }, [userId, realtime]);

  const addMedicine = async (medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await addMedicineDB(medicine);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateMedicine = async (medicineId: string, updates: Partial<Medicine>) => {
    try {
      await updateMedicineDB(medicineId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMedicine = async (medicineId: string) => {
    try {
      await deleteMedicineDB(medicineId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    medicines,
    loading,
    error,
    addMedicine,
    updateMedicine,
    deleteMedicine
  };
};
