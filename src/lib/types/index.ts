// TypeScript interfaces for the Medicine Reminder App

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
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

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  MEDICINES: 'medicines',
  DOSE_RECORDS: 'doseRecords',
  GUARDIANS: 'guardians',
  INVITATIONS: 'invitations',
  REMINDERS: 'reminders',
  SETTINGS: 'settings'
} as const;
