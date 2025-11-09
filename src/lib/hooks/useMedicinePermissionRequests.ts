// Hook for managing medicine permission requests
import { useState, useEffect } from 'react';
import {
  getMedicinePermissionRequests,
  getMedicinePermissionRequest,
  approveMedicinePermissionRequest,
  denyMedicinePermissionRequest,
  listenToMedicinePermissionRequests,
  createMedicinePermissionRequest
} from '../firebase/db';
import { MedicinePermissionRequest } from '../types';

export function useMedicinePermissionRequests(
  careRecipientId: string | null,
  status?: 'pending' | 'approved' | 'denied'
) {
  const [requests, setRequests] = useState<MedicinePermissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!careRecipientId) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Set up real-time listener
    const unsubscribe = listenToMedicinePermissionRequests(
      careRecipientId,
      (updatedRequests) => {
        setRequests(updatedRequests);
        setLoading(false);
      },
      status
    );

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [careRecipientId, status]);

  const approveRequest = async (requestId: string): Promise<string> => {
    try {
      const medicineId = await approveMedicinePermissionRequest(requestId);
      return medicineId;
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const denyRequest = async (requestId: string, reason?: string): Promise<void> => {
    try {
      await denyMedicinePermissionRequest(requestId, reason);
    } catch (err: any) {
      setError(err);
      throw err;
    }
  };

  const getPendingCount = (): number => {
    return requests.filter(r => r.status === 'pending').length;
  };

  return {
    requests,
    loading,
    error,
    approveRequest,
    denyRequest,
    pendingCount: getPendingCount(),
    refetch: () => {
      if (careRecipientId) {
        getMedicinePermissionRequests(careRecipientId, status)
          .then(setRequests)
          .catch(setError);
      }
    }
  };
}

/**
 * Hook for creating a medicine permission request (for guardians)
 */
export function useCreateMedicinePermissionRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createRequest = async (
    request: Omit<MedicinePermissionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'requestedAt'>
  ): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const requestId = await createMedicinePermissionRequest(request);
      setLoading(false);
      return requestId;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    createRequest,
    loading,
    error
  };
}

/**
 * Hook for getting a single permission request
 */
export function useMedicinePermissionRequest(requestId: string | null) {
  const [request, setRequest] = useState<MedicinePermissionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!requestId) {
      setRequest(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getMedicinePermissionRequest(requestId)
      .then((data) => {
        setRequest(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [requestId]);

  return {
    request,
    loading,
    error
  };
}
