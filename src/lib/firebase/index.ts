// Firebase Service - Main Export File
// This file exports all Firebase authentication and database functions

// Export Firebase configuration
export { app, auth, db } from './config';

// Export Authentication functions
export {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
  resetPassword,
  updateUserProfile,
  getCurrentUser,
  onAuthStateChange,
  isAuthenticated,
  sendVerificationEmail,
  reauthenticateUser
} from './auth';

// Export Database functions
export {
  // User functions
  createUserProfile,
  getUserProfile,
  updateUserProfile as updateUserProfileDB,
  uploadProfilePhoto,
  
  // Medicine functions
  addMedicine,
  getMedicine,
  getUserMedicines,
  updateMedicine,
  deleteMedicine,
  
  // Dose Record functions
  addDoseRecord,
  getDoseRecords,
  getUserDoseRecords,
  getTodayDoseRecords,
  getWeekDoseRecords,
  updateDoseRecord,
  markDoseAsTaken,
  markDoseAsMissed,
  markDoseAsSkipped,
  getOrCreateTodayDoseRecord,
  
  // Guardian functions (Patient perspective)
  addGuardian,
  getGuardians,
  updateGuardian,
  deleteGuardian,
  
  // Care Recipient functions (Guardian perspective)
  getCareRecipients,
  getCareRecipientWithDetails,
  getRecipientMedicines,
  getRecipientDoseRecords,
  getRecipientProfile,
  
  // Invitation functions
  sendInvitation,
  getInvitations,
  getSentInvitations,
  respondToInvitation,
  cancelInvitation,
  resendInvitation,
  acceptInvitationAndCreateGuardian,
  
  // Settings functions
  getUserSettings,
  updateUserSettings,
  
  // Real-time listeners
  listenToUserMedicines,
  listenToGuardians,
  listenToCareRecipients,
  listenToRecipientMedicines,
  listenToReceivedInvitations,
  listenToSentInvitations,
  
  // Batch operations
  batchDeleteMedicinesAndRecords,
  deleteAllUserData
} from './db';

// Export types
export type {
  User,
  Medicine,
  MedicineWithStats,
  DoseRecord,
  Guardian,
  Invitation,
  Reminder,
  UserSettings,
  CareRecipient,
  AdherenceStats,
  UserStats,
  ProfileFormData,
  AccountStatsDisplay
} from '../types';

export { COLLECTIONS } from '../types';
