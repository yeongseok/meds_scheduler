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
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './config';
import { 
  User, 
  Medicine, 
  DoseRecord, 
  Guardian, 
  Invitation,
  Reminder,
  UserSettings,
  MedicinePermissionRequest,
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

/**
 * Upload a profile photo to Firebase Storage and return the download URL
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns Promise with the download URL of the uploaded image
 */
export const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create a reference to the storage location
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-photos/${userId}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update user profile with the new photo URL
    await updateUserProfile(userId, { photoURL: downloadURL });

    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload profile photo');
  }
};

/**
 * Delete a profile photo from Firebase Storage
 * @param photoURL - The URL of the photo to delete
 */
export const deleteProfilePhoto = async (photoURL: string): Promise<void> => {
  try {
    // Extract the storage path from the URL
    const storageRef = ref(storage, photoURL);
    await deleteObject(storageRef);
  } catch (error: any) {
    // If the file doesn't exist, don't throw an error
    if (error.code === 'storage/object-not-found') {
      console.warn('Photo already deleted or does not exist');
      return;
    }
    throw new Error(error.message || 'Failed to delete profile photo');
  }
};

// ==================== MEDICINE FUNCTIONS ====================

/**
 * Upload a medicine photo to Firebase Storage
 * @param userId - The user's ID (owner of the medicine)
 * @param medicineId - The medicine ID (optional, for updates)
 * @param file - The image file to upload
 * @returns Promise with the download URL
 */
export const uploadMedicinePhoto = async (userId: string, file: File, medicineId?: string): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create a reference to the storage location
    const fileExtension = file.name.split('.').pop();
    const fileName = medicineId 
      ? `medicine_${medicineId}_${Date.now()}.${fileExtension}`
      : `medicine_temp_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `medicine-photos/${userId}/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload medicine photo');
  }
};

/**
 * Delete a medicine photo from Firebase Storage
 * @param photoURL - The URL of the photo to delete
 */
export const deleteMedicinePhoto = async (photoURL: string): Promise<void> => {
  try {
    // Extract the storage path from the URL
    const storageRef = ref(storage, photoURL);
    await deleteObject(storageRef);
  } catch (error: any) {
    // If the file doesn't exist, don't throw an error
    if (error.code === 'storage/object-not-found') {
      console.warn('Medicine photo already deleted or does not exist');
      return;
    }
    throw new Error(error.message || 'Failed to delete medicine photo');
  }
};

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

export const getUserDoseRecords = async (
  userId: string,
  startDate?: Date,
  endDate?: Date,
  status?: 'taken' | 'missed' | 'skipped' | 'pending'
): Promise<DoseRecord[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('scheduledDate', 'desc')
    ];
    
    if (startDate) {
      constraints.push(where('scheduledDate', '>=', Timestamp.fromDate(startDate)));
    }
    
    if (endDate) {
      constraints.push(where('scheduledDate', '<=', Timestamp.fromDate(endDate)));
    }
    
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    const q = query(collection(db, COLLECTIONS.DOSE_RECORDS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DoseRecord[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user dose records');
  }
};

export const getTodayDoseRecords = async (
  userId: string
): Promise<DoseRecord[]> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await getUserDoseRecords(userId, today, tomorrow);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get today dose records');
  }
};

export const getWeekDoseRecords = async (
  userId: string,
  weekStartDate: Date
): Promise<DoseRecord[]> => {
  try {
    const startDate = new Date(weekStartDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);
    
    return await getUserDoseRecords(userId, startDate, endDate);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get week dose records');
  }
};

export const markDoseAsSkipped = async (recordId: string, note?: string): Promise<void> => {
  try {
    await updateDoseRecord(recordId, {
      status: 'skipped',
      note
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark dose as skipped');
  }
};

export const getOrCreateTodayDoseRecord = async (
  medicineId: string,
  userId: string,
  scheduledTime: string
): Promise<DoseRecord> => {
  try {
    // Check if record already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const q = query(
      collection(db, COLLECTIONS.DOSE_RECORDS),
      where('userId', '==', userId),
      where('medicineId', '==', medicineId),
      where('scheduledTime', '==', scheduledTime),
      where('scheduledDate', '>=', Timestamp.fromDate(today)),
      where('scheduledDate', '<', Timestamp.fromDate(tomorrow)),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as DoseRecord;
    }
    
    // Create new record
    const recordId = await addDoseRecord({
      medicineId,
      userId,
      scheduledDate: today,
      scheduledTime,
      status: 'pending'
    });
    
    // Get the created record
    const docRef = doc(db, COLLECTIONS.DOSE_RECORDS, recordId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DoseRecord;
    }
    
    throw new Error('Failed to retrieve created dose record');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get or create dose record');
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

// ==================== CARE RECIPIENT FUNCTIONS (Guardian Perspective) ====================

export const getCareRecipients = async (guardianId: string): Promise<Guardian[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.GUARDIANS),
      where('guardianId', '==', guardianId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Guardian[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get care recipients');
  }
};

export const getCareRecipientWithDetails = async (
  guardianId: string,
  recipientUserId: string
): Promise<Guardian | null> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.GUARDIANS),
      where('guardianId', '==', guardianId),
      where('userId', '==', recipientUserId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Guardian;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get care recipient details');
  }
};

export const getRecipientMedicines = async (
  recipientUserId: string,
  guardianId: string
): Promise<Medicine[]> => {
  try {
    // First verify guardian has permission
    const guardianRelation = await getCareRecipientWithDetails(guardianId, recipientUserId);
    
    if (!guardianRelation) {
      throw new Error('Guardian relationship not found');
    }
    
    if (!guardianRelation.permissions.viewMedications) {
      throw new Error('Guardian does not have permission to view medications');
    }
    
    // Get medicines for the recipient
    return await getUserMedicines(recipientUserId);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get recipient medicines');
  }
};

export const getRecipientDoseRecords = async (
  recipientUserId: string,
  guardianId: string,
  medicineId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<DoseRecord[]> => {
  try {
    // First verify guardian has permission
    const guardianRelation = await getCareRecipientWithDetails(guardianId, recipientUserId);
    
    if (!guardianRelation) {
      throw new Error('Guardian relationship not found');
    }
    
    if (!guardianRelation.permissions.viewHistory) {
      throw new Error('Guardian does not have permission to view history');
    }
    
    // Build query constraints
    const constraints: QueryConstraint[] = [
      where('userId', '==', recipientUserId),
      orderBy('scheduledDate', 'desc')
    ];
    
    if (medicineId) {
      constraints.push(where('medicineId', '==', medicineId));
    }
    
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
    throw new Error(error.message || 'Failed to get recipient dose records');
  }
};

export const getRecipientProfile = async (
  recipientUserId: string,
  guardianId: string
): Promise<User | null> => {
  try {
    // Verify guardian relationship exists
    const guardianRelation = await getCareRecipientWithDetails(guardianId, recipientUserId);
    
    if (!guardianRelation) {
      throw new Error('Guardian relationship not found');
    }
    
    // Get recipient's profile
    return await getUserProfile(recipientUserId);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get recipient profile');
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

export const getSentInvitations = async (userId: string): Promise<Invitation[]> => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVITATIONS),
      where('fromUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('invitedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Invitation[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get sent invitations');
  }
};

export const cancelInvitation = async (invitationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.INVITATIONS, invitationId));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to cancel invitation');
  }
};

export const resendInvitation = async (invitationId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
    
    // Update the invitation with new expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await updateDoc(docRef, {
      invitedAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt)
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to resend invitation');
  }
};

export const acceptInvitationAndCreateGuardian = async (
  invitationId: string,
  guardianId: string,
  relationship: string
): Promise<string> => {
  try {
    // Get invitation details
    const invitationRef = doc(db, COLLECTIONS.INVITATIONS, invitationId);
    const invitationSnap = await getDoc(invitationRef);
    
    if (!invitationSnap.exists()) {
      throw new Error('Invitation not found');
    }
    
    const invitation = invitationSnap.data() as Invitation;
    
    // Create guardian relationship
    const guardianDocId = await addGuardian({
      userId: invitation.fromUserId, // The person being monitored
      guardianId: guardianId, // The guardian's user ID
      guardianName: '', // Will be fetched from user profile
      guardianEmail: invitation.toEmail,
      relationship: relationship,
      status: 'active',
      permissions: {
        viewMedications: true,
        viewHistory: true,
        receiveAlerts: true
      },
      invitedAt: invitation.invitedAt,
      acceptedAt: new Date()
    });
    
    // Update invitation status
    await respondToInvitation(invitationId, true);
    
    return guardianDocId;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to accept invitation');
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

export const listenToCareRecipients = (
  guardianId: string,
  callback: (recipients: Guardian[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.GUARDIANS),
    where('guardianId', '==', guardianId),
    where('status', '==', 'active'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const recipients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Guardian[];
    callback(recipients);
  });
};

export const listenToRecipientMedicines = (
  recipientUserId: string,
  guardianId: string,
  callback: (medicines: Medicine[]) => void,
  onError?: (error: Error) => void
) => {
  // First verify permission, then set up listener
  getCareRecipientWithDetails(guardianId, recipientUserId)
    .then(guardianRelation => {
      if (!guardianRelation) {
        if (onError) onError(new Error('Guardian relationship not found'));
        return;
      }
      
      if (!guardianRelation.permissions.viewMedications) {
        if (onError) onError(new Error('No permission to view medications'));
        return;
      }
      
      // Set up real-time listener
      const q = query(
        collection(db, COLLECTIONS.MEDICINES),
        where('userId', '==', recipientUserId),
        orderBy('createdAt', 'desc')
      );
      
      return onSnapshot(q, (querySnapshot) => {
        const medicines = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Medicine[];
        callback(medicines);
      });
    })
    .catch(error => {
      if (onError) onError(error);
    });
};

export const listenToReceivedInvitations = (
  email: string,
  callback: (invitations: Invitation[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.INVITATIONS),
    where('toEmail', '==', email),
    where('status', '==', 'pending'),
    orderBy('invitedAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const invitations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Invitation[];
    callback(invitations);
  });
};

export const listenToSentInvitations = (
  userId: string,
  callback: (invitations: Invitation[]) => void
) => {
  const q = query(
    collection(db, COLLECTIONS.INVITATIONS),
    where('fromUserId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('invitedAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const invitations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Invitation[];
    callback(invitations);
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

export const deleteAllUserData = async (userId: string): Promise<void> => {
  try {
    // Delete all medicines
    const medicinesQuery = query(
      collection(db, COLLECTIONS.MEDICINES),
      where('userId', '==', userId)
    );
    const medicinesSnapshot = await getDocs(medicinesQuery);
    
    // Delete all dose records
    const doseRecordsQuery = query(
      collection(db, COLLECTIONS.DOSE_RECORDS),
      where('userId', '==', userId)
    );
    const doseRecordsSnapshot = await getDocs(doseRecordsQuery);
    
    // Delete all guardians where user is the patient
    const guardiansQuery = query(
      collection(db, COLLECTIONS.GUARDIANS),
      where('userId', '==', userId)
    );
    const guardiansSnapshot = await getDocs(guardiansQuery);
    
    // Delete all guardians where user is the guardian
    const careRecipientsQuery = query(
      collection(db, COLLECTIONS.GUARDIANS),
      where('guardianId', '==', userId)
    );
    const careRecipientsSnapshot = await getDocs(careRecipientsQuery);
    
    // Delete all invitations sent by user
    const sentInvitationsQuery = query(
      collection(db, COLLECTIONS.INVITATIONS),
      where('fromUserId', '==', userId)
    );
    const sentInvitationsSnapshot = await getDocs(sentInvitationsQuery);
    
    // Delete user settings
    const settingsDoc = doc(db, COLLECTIONS.SETTINGS, userId);
    
    // Batch delete all documents
    const batch = writeBatch(db);
    
    medicinesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    doseRecordsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    guardiansSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    careRecipientsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    sentInvitationsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    batch.delete(settingsDoc);
    
    await batch.commit();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete all user data');
  }
};

// ==================== MEDICINE PERMISSION REQUEST FUNCTIONS ====================

/**
 * Create a medicine permission request (guardian requesting to add medicine for recipient)
 */
export const createMedicinePermissionRequest = async (
  request: Omit<MedicinePermissionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'requestedAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.MEDICINE_PERMISSION_REQUESTS), {
      ...request,
      status: 'pending',
      requestedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create medicine permission request');
  }
};

/**
 * Get all pending permission requests for a care recipient
 */
export const getMedicinePermissionRequests = async (
  careRecipientId: string,
  status?: 'pending' | 'approved' | 'denied'
): Promise<MedicinePermissionRequest[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('careRecipientId', '==', careRecipientId),
      orderBy('requestedAt', 'desc')
    ];
    
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    const q = query(collection(db, COLLECTIONS.MEDICINE_PERMISSION_REQUESTS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MedicinePermissionRequest[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get medicine permission requests');
  }
};

/**
 * Get a single permission request by ID
 */
export const getMedicinePermissionRequest = async (
  requestId: string
): Promise<MedicinePermissionRequest | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.MEDICINE_PERMISSION_REQUESTS, requestId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MedicinePermissionRequest;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get medicine permission request');
  }
};

/**
 * Approve a medicine permission request and create the medicine
 */
export const approveMedicinePermissionRequest = async (
  requestId: string
): Promise<string> => {
  try {
    // Get the request
    const request = await getMedicinePermissionRequest(requestId);
    if (!request) {
      throw new Error('Permission request not found');
    }
    
    if (request.status !== 'pending') {
      throw new Error('Permission request already processed');
    }
    
    // Create the medicine from the request data
    const medicineId = await addMedicine({
      userId: request.careRecipientId,
      name: request.medicineName,
      genericName: request.genericName,
      dosage: request.dosage,
      type: request.medicineType,
      color: request.color,
      frequency: request.frequency,
      times: request.times,
      duration: request.duration,
      startDate: new Date(request.startDate),
      endDate: new Date(new Date(request.startDate).getTime() + request.duration * 24 * 60 * 60 * 1000),
      status: 'active',
      photoURL: request.photoURL,
      prescribedBy: request.prescribedBy,
      pharmacy: request.pharmacy,
      instructions: request.instructions,
      notes: request.notes,
      reminderEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true
    });
    
    // Update the request status
    const requestRef = doc(db, COLLECTIONS.MEDICINE_PERMISSION_REQUESTS, requestId);
    await updateDoc(requestRef, {
      status: 'approved',
      respondedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return medicineId;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to approve medicine permission request');
  }
};

/**
 * Deny a medicine permission request
 */
export const denyMedicinePermissionRequest = async (
  requestId: string,
  reason?: string
): Promise<void> => {
  try {
    const request = await getMedicinePermissionRequest(requestId);
    if (!request) {
      throw new Error('Permission request not found');
    }
    
    if (request.status !== 'pending') {
      throw new Error('Permission request already processed');
    }
    
    const requestRef = doc(db, COLLECTIONS.MEDICINE_PERMISSION_REQUESTS, requestId);
    await updateDoc(requestRef, {
      status: 'denied',
      respondedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ...(reason && { denialReason: reason })
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to deny medicine permission request');
  }
};

/**
 * Delete a medicine permission request
 */
export const deleteMedicinePermissionRequest = async (requestId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MEDICINE_PERMISSION_REQUESTS, requestId));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete medicine permission request');
  }
};

/**
 * Get requests sent by a guardian
 */
export const getGuardianSentRequests = async (
  guardianId: string,
  status?: 'pending' | 'approved' | 'denied'
): Promise<MedicinePermissionRequest[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('guardianId', '==', guardianId),
      orderBy('requestedAt', 'desc')
    ];
    
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    const q = query(collection(db, COLLECTIONS.MEDICINE_PERMISSION_REQUESTS), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MedicinePermissionRequest[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get guardian sent requests');
  }
};

/**
 * Real-time listener for medicine permission requests
 */
export const listenToMedicinePermissionRequests = (
  careRecipientId: string,
  callback: (requests: MedicinePermissionRequest[]) => void,
  status?: 'pending' | 'approved' | 'denied'
) => {
  const constraints: QueryConstraint[] = [
    where('careRecipientId', '==', careRecipientId),
    orderBy('requestedAt', 'desc')
  ];
  
  if (status) {
    constraints.push(where('status', '==', status));
  }
  
  const q = query(collection(db, COLLECTIONS.MEDICINE_PERMISSION_REQUESTS), ...constraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MedicinePermissionRequest[];
    callback(requests);
  });
};
