// Firebase Firestore Database Service

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { 
  User, 
  Medicine, 
  DoseRecord, 
  Guardian, 
  Invitation,
  Reminder,
  UserSettings,
  COLLECTIONS 
} from '../types';

// ==================== USER FUNCTIONS ====================

export const createUserProfile = async (userId: string, userData: Partial<User>): Promise<void> => {
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, userId), {
      ...userData,
      createdAt: Timestamp.now(),
      isPro: false,
      language: 'ko'
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create user profile');
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user profile');
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, updates);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update user profile');
  }
};

// ==================== MEDICINE FUNCTIONS ====================

export const addMedicine = async (medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.MEDICINES), {
      ...medicine,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add medicine');
  }
};

export const getMedicine = async (medicineId: string): Promise<Medicine | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.MEDICINES, medicineId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Medicine;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get medicine');
  }
};

export const getUserMedicines = async (userId: string, status?: string): Promise<Medicine[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ];
    
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    const q = query(collection(db, COLLECTIONS.MEDICINES), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Medicine[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user medicines');
  }
};

export const updateMedicine = async (medicineId: string, updates: Partial<Medicine>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.MEDICINES, medicineId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update medicine');
  }
};

export const deleteMedicine = async (medicineId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MEDICINES, medicineId));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete medicine');
  }
};

// ==================== DOSE RECORD FUNCTIONS ====================

export const addDoseRecord = async (doseRecord: Omit<DoseRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.DOSE_RECORDS), {
      ...doseRecord,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add dose record');
  }
};

export const getDoseRecords = async (
  medicineId: string,
  startDate?: Date,
  endDate?: Date
): Promise<DoseRecord[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('medicineId', '==', medicineId),
      orderBy('scheduledDate', 'desc')
    ];
    
    if (startDate) {
      constraints.push(where('scheduledDate', '>=', Timestamp.fromDate(startDate)));
    }
    
    if (endDate) {
      constraints.push(where('scheduledDate', '<=', Timestamp.fromDate(endDate)));
    }
    
    const q = query(collection(db, COLLECTIONS.DOSE_RECORDS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DoseRecord[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get dose records');
  }
};

export const updateDoseRecord = async (recordId: string, updates: Partial<DoseRecord>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.DOSE_RECORDS, recordId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update dose record');
  }
};

export const markDoseAsTaken = async (recordId: string, note?: string): Promise<void> => {
  try {
    await updateDoseRecord(recordId, {
      status: 'taken',
      takenAt: new Date(),
      note
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark dose as taken');
  }
};

export const markDoseAsMissed = async (recordId: string, note?: string): Promise<void> => {
  try {
    await updateDoseRecord(recordId, {
      status: 'missed',
      note
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark dose as missed');
  }
};

// ==================== GUARDIAN FUNCTIONS ====================

export const addGuardian = async (guardian: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.GUARDIANS), {
      ...guardian,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to add guardian');
  }
};

export const getGuardians = async (userId: string): Promise<Guardian[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.GUARDIANS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Guardian[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get guardians');
  }
};

export const updateGuardian = async (guardianId: string, updates: Partial<Guardian>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.GUARDIANS, guardianId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update guardian');
  }
};

export const deleteGuardian = async (guardianId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.GUARDIANS, guardianId));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete guardian');
  }
};

// ==================== INVITATION FUNCTIONS ====================

export const sendInvitation = async (
  invitation: Omit<Invitation, 'id' | 'invitedAt'>
): Promise<string> => {
  try {
    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    const docRef = await addDoc(collection(db, COLLECTIONS.INVITATIONS), {
      ...invitation,
      invitedAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
      status: 'pending'
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send invitation');
  }
};

export const getInvitations = async (email: string): Promise<Invitation[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVITATIONS),
      where('toEmail', '==', email),
      where('status', '==', 'pending'),
      orderBy('invitedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Invitation[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get invitations');
  }
};

export const respondToInvitation = async (
  invitationId: string,
  accept: boolean
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
    await updateDoc(docRef, {
      status: accept ? 'accepted' : 'rejected',
      respondedAt: Timestamp.now()
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to respond to invitation');
  }
};

// ==================== SETTINGS FUNCTIONS ====================

export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { ...docSnap.data() } as UserSettings;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user settings');
  }
};

export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, userId);
    await setDoc(docRef, {
      userId,
      ...settings,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update user settings');
  }
};

// ==================== REAL-TIME LISTENERS ====================

export const listenToUserMedicines = (
  userId: string,
  callback: (medicines: Medicine[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.MEDICINES),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const medicines = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Medicine[];
    callback(medicines);
  });
};

export const listenToGuardians = (
  userId: string,
  callback: (guardians: Guardian[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.GUARDIANS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const guardians = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Guardian[];
    callback(guardians);
  });
};

// ==================== BATCH OPERATIONS ====================

export const batchDeleteMedicinesAndRecords = async (medicineIds: string[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    // Delete medicines
    medicineIds.forEach(id => {
      const docRef = doc(db, COLLECTIONS.MEDICINES, id);
      batch.delete(docRef);
    });
    
    // Delete associated dose records
    for (const medicineId of medicineIds) {
      const q = query(
        collection(db, COLLECTIONS.DOSE_RECORDS),
        where('medicineId', '==', medicineId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
    }
    
    await batch.commit();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to batch delete');
  }
};
