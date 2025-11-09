// Custom React Hook for Invitation Management

import { useState, useEffect } from 'react';
import { Invitation } from '../types';
import {
  sendInvitation as sendInvitationDB,
  getInvitations as getInvitationsDB,
  getSentInvitations as getSentInvitationsDB,
  respondToInvitation as respondToInvitationDB,
  cancelInvitation as cancelInvitationDB,
  resendInvitation as resendInvitationDB,
  acceptInvitationAndCreateGuardian as acceptInvitationAndCreateGuardianDB,
  listenToReceivedInvitations,
  listenToSentInvitations
} from '../firebase/db';

export const useReceivedInvitations = (email: string | undefined, realtime: boolean = false) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    if (realtime) {
      // Subscribe to real-time updates
      const unsubscribe = listenToReceivedInvitations(email, (updatedInvitations) => {
        setInvitations(updatedInvitations);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      const fetchInvitations = async () => {
        try {
          const receivedInvitations = await getInvitationsDB(email);
          setInvitations(receivedInvitations);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchInvitations();
    }
  }, [email, realtime]);

  const acceptInvitation = async (invitationId: string, guardianId: string, relationship: string) => {
    try {
      await acceptInvitationAndCreateGuardianDB(invitationId, guardianId, relationship);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const declineInvitation = async (invitationId: string) => {
    try {
      await respondToInvitationDB(invitationId, false);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    invitations,
    loading,
    error,
    acceptInvitation,
    declineInvitation
  };
};

export const useSentInvitations = (userId: string | undefined, realtime: boolean = false) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    if (realtime) {
      // Subscribe to real-time updates
      const unsubscribe = listenToSentInvitations(userId, (updatedInvitations) => {
        setInvitations(updatedInvitations);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fetch once
      const fetchInvitations = async () => {
        try {
          const sentInvitations = await getSentInvitationsDB(userId);
          setInvitations(sentInvitations);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchInvitations();
    }
  }, [userId, realtime]);

  const sendInvitation = async (invitation: Omit<Invitation, 'id' | 'invitedAt'>) => {
    try {
      const id = await sendInvitationDB(invitation);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      await cancelInvitationDB(invitationId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resendInvitation = async (invitationId: string) => {
    try {
      await resendInvitationDB(invitationId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    invitations,
    loading,
    error,
    sendInvitation,
    cancelInvitation,
    resendInvitation
  };
};
