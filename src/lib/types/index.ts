// TypeScript interfaces for the Medicine Reminder App

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  language: 'ko' | 'en';
  isPro: boolean;
}

export interface Medicine {
  id: string;
  userId: string;
  name: string;
  genericName?: string;
  dosage: string;
  type: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'inhaler' | 'other';
  color: string;
  frequency: string;
  times: string[]; // Array of time strings like ["08:00", "20:00"]
  duration: number; // Duration in days
  startDate: Date;
  endDate: Date;
  status: 'active' | 'paused' | 'completed' | 'discontinued';
  photoURL?: string; // Medicine photo URL from Firebase Storage
  prescribedBy?: string;
  pharmacy?: string;
  instructions?: string;
  notes?: string;
  sideEffects?: string;
  reminderEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoseRecord {
  id: string;
  medicineId: string;
  userId: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'taken' | 'missed' | 'skipped' | 'pending';
  takenAt?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guardian {
  id: string;
  userId: string; // The person being monitored
  guardianId: string; // The guardian's user ID
  guardianName: string;
  guardianEmail: string;
  guardianPhone?: string;
  relationship: string;
  status: 'active' | 'pending' | 'inactive';
  permissions: {
    viewMedications: boolean;
    viewHistory: boolean;
    receiveAlerts: boolean;
  };
  invitedAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invitation {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserEmail: string;
  toEmail: string;
  relationship: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  invitedAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
}

export interface Reminder {
  id: string;
  medicineId: string;
  userId: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'scheduled' | 'sent' | 'dismissed' | 'snoozed';
  snoozeUntil?: Date;
  createdAt: Date;
}

export interface UserSettings {
  userId: string;
  language: 'ko' | 'en';
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    advanceReminder: number; // Minutes before
  };
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  weekStartsOn: 'sunday' | 'monday';
  updatedAt: Date;
}

// Care Recipient - Extended Guardian info for guardian's perspective
export interface CareRecipient extends Guardian {
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  recipientPhotoURL?: string;
  lastActivity?: Date;
  medicationCount?: number;
  upcomingDoses?: number;
}

// Extended Medicine with UI-specific calculated fields
export interface MedicineWithStats extends Medicine {
  bgColor?: string; // UI background color class
  adherence?: number; // Calculated adherence percentage
  streak?: number; // Current streak in days
  totalDoses?: number; // Total expected doses
  takenDoses?: number; // Total taken doses
  nextDose?: string; // Next scheduled dose time
}

// Adherence Statistics
export interface AdherenceStats {
  adherence: number; // Percentage (0-100)
  streak: number; // Current streak in days
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  skippedDoses: number;
}

// User Account Statistics (for Profile page)
export interface UserStats {
  totalMedicines: number;
  activeMedicines: number;
  overallAdherence: number;
  currentStreak: number;
  totalDosesTaken: number;
}

// Profile Form Data (subset of User interface for editing)
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// Account Stats Display (subset of UserStats for profile display)
export interface AccountStatsDisplay {
  totalMedicines: number;
  overallAdherence: number;
  currentStreak: number;
}

// Medicine Permission Request (for guardian-to-recipient medicine additions)
export interface MedicinePermissionRequest {
  id: string;
  guardianId: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhotoURL?: string;
  careRecipientId: string;
  careRecipientName: string;
  careRecipientEmail: string;
  // Medicine data fields
  medicineName: string;
  genericName?: string;
  dosage: string;
  medicineType: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'inhaler' | 'other';
  color: string;
  frequency: string;
  times: string[];
  duration: number;
  startDate: string;
  instructions?: string;
  notes?: string;
  photoURL?: string;
  prescribedBy?: string;
  pharmacy?: string;
  // Request metadata
  status: 'pending' | 'approved' | 'denied';
  requestedAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  MEDICINES: 'medicines',
  DOSE_RECORDS: 'doseRecords',
  GUARDIANS: 'guardians',
  INVITATIONS: 'invitations',
  REMINDERS: 'reminders',
  SETTINGS: 'settings',
  MEDICINE_PERMISSION_REQUESTS: 'medicinePermissionRequests'
} as const;
