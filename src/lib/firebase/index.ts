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
  sendVerificationEmail
} from './auth';

// Export Database functions
export {
  // User functions
  createUserProfile,
  getUserProfile,
  updateUserProfile as updateUserProfileDB,
  
  // Medicine functions
  addMedicine,
  getMedicine,
  getUserMedicines,
  updateMedicine,
  deleteMedicine,
  
  // Dose Record functions
  addDoseRecord,
  getDoseRecords,
  updateDoseRecord,
  markDoseAsTaken,
  markDoseAsMissed,
  
  // Guardian functions
  addGuardian,
  getGuardians,
  updateGuardian,
  deleteGuardian,
  
  // Invitation functions
  sendInvitation,
  getInvitations,
  getSentInvitations,
  respondToInvitation,
  
  // Settings functions
  getUserSettings,
  updateUserSettings,
  
  // Real-time listeners
  listenToUserMedicines,
  listenToGuardians,
  
  // Batch operations
  batchDeleteMedicinesAndRecords
} from './db';

// Export types
export type {
  User,
  Medicine,
  DoseRecord,
  Guardian,
  Invitation,
  Reminder,
  UserSettings
} from '../types';

export { COLLECTIONS } from '../types';
