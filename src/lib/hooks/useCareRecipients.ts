// Custom React Hook for Care Recipient Management (Guardian Perspective)

import { useState, useEffect } from 'react';
import { Guardian, Medicine, DoseRecord } from '../types';
import { 
  getCareRecipients as getCareRecipientsDB,
  getRecipientMedicines as getRecipientMedicinesDB,
  getRecipientDoseRecords as getRecipientDoseRecordsDB,
  getRecipientProfile as getRecipientProfileDB,
  listenToCareRecipients,
  listenToRecipientMedicines
} from '../firebase/db';

/**
 * Hook for guardians to manage their care recipients
 * @param guardianId - The guardian's user ID
 * @param realtime - Whether to use real-time listeners
 */
export const useCareRecipients = (guardianId: string | undefined, realtime: boolean = false) => {
  const [recipients, setRecipients] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guardianId) {
      setLoading(false);
      return;
    }

    if (realtime) {
      // Subscribe to real-time updates
      const unsubscribe = listenToCareRecipients(guardianId, (updatedRecipients) => {
        setRecipients(updatedRecipients);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      const fetchRecipients = async () => {
        try {
          const careRecipients = await getCareRecipientsDB(guardianId);
          setRecipients(careRecipients);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRecipients();
    }
  }, [guardianId, realtime]);

  const getRecipientMedicines = async (recipientUserId: string) => {
    if (!guardianId) {
      throw new Error('Guardian ID is required');
    }
    
    try {
      const medicines = await getRecipientMedicinesDB(recipientUserId, guardianId);
      return medicines;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getRecipientDoseRecords = async (
    recipientUserId: string,
    medicineId?: string,
    startDate?: Date,
    endDate?: Date
  ) => {
    if (!guardianId) {
      throw new Error('Guardian ID is required');
    }
    
    try {
      const records = await getRecipientDoseRecordsDB(
        recipientUserId,
        guardianId,
        medicineId,
        startDate,
        endDate
      );
      return records;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getRecipientProfile = async (recipientUserId: string) => {
    if (!guardianId) {
      throw new Error('Guardian ID is required');
    }
    
    try {
      const profile = await getRecipientProfileDB(recipientUserId, guardianId);
      return profile;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    recipients,
    loading,
    error,
    getRecipientMedicines,
    getRecipientDoseRecords,
    getRecipientProfile
  };
};

/**
 * Hook for real-time monitoring of a specific care recipient's medications
 * @param guardianId - The guardian's user ID
 * @param recipientUserId - The care recipient's user ID
 */
export const useRecipientMedicines = (
  guardianId: string | undefined,
  recipientUserId: string | undefined
) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guardianId || !recipientUserId) {
      setLoading(false);
      return;
    }

    // Set up real-time listener with permission check
    listenToRecipientMedicines(
      recipientUserId,
      guardianId,
      (updatedMedicines) => {
        setMedicines(updatedMedicines);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, [guardianId, recipientUserId]);

  return {
    medicines,
    loading,
    error
  };
};
