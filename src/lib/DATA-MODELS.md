# Data Models Reference

Complete reference for all TypeScript interfaces and data structures used in the Medicine Reminder App Firebase integration.

**File:** `/lib/types/index.ts`

---

## Table of Contents

1. [User](#user)
2. [Medicine](#medicine)
3. [MedicineWithStats](#medicinewithstats)
4. [DoseRecord](#doserecord)
5. [Guardian](#guardian)
6. [CareRecipient](#carerecipient)
7. [Invitation](#invitation)
8. [Reminder](#reminder)
9. [UserSettings](#usersettings)
10. [AdherenceStats](#adherencestats)
11. [UserStats](#userstats)
12. [Collections](#collections)

---

## User

Represents a user account with profile information.

### TypeScript Interface

```typescript
interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  language: 'ko' | 'en';
  isPro: boolean;
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | `string` | ✅ | Firebase Auth user ID (unique identifier) |
| `email` | `string` | ✅ | User's email address |
| `displayName` | `string \| null` | ❌ | User's full name |
| `photoURL` | `string \| null` | ❌ | Profile photo URL |
| `phoneNumber` | `string \| null` | ❌ | Phone number |
| `createdAt` | `Date` | ✅ | Account creation timestamp |
| `language` | `'ko' \| 'en'` | ✅ | Preferred language (Korean/English) |
| `isPro` | `boolean` | ✅ | Premium subscription status |

### Firestore Collection

- **Collection:** `users`
- **Document ID:** `{uid}`

### Example

```typescript
const user: User = {
  uid: 'abc123',
  email: 'user@example.com',
  displayName: '김철수',
  photoURL: 'https://example.com/photo.jpg',
  phoneNumber: '+82-10-1234-5678',
  createdAt: new Date('2025-01-15'),
  language: 'ko',
  isPro: false
};
```

### Usage

```typescript
import { getUserProfile } from './lib/firebase';

const userProfile = await getUserProfile(userId);
console.log(userProfile?.displayName); // "김철수"
console.log(userProfile?.language); // "ko"
```

---

## Medicine

Represents a medication with dosage, schedule, and tracking information.

### TypeScript Interface

```typescript
interface Medicine {
  id: string;
  userId: string;
  name: string;
  genericName?: string;
  dosage: string;
  type: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'inhaler' | 'other';
  color: string;
  frequency: string;
  times: string[];
  duration: number;
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
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique medicine ID |
| `userId` | `string` | ✅ | Owner's user ID |
| `name` | `string` | ✅ | Medicine brand name |
| `genericName` | `string` | ❌ | Generic/chemical name |
| `dosage` | `string` | ✅ | Dosage amount (e.g., "500mg", "10ml") |
| `type` | Medicine type | ✅ | Form of medication |
| `color` | `string` | ✅ | Visual identifier color |
| `frequency` | `string` | ✅ | How often to take (e.g., "daily", "twice daily") |
| `times` | `string[]` | ✅ | Dose times in HH:mm format |
| `duration` | `number` | ✅ | Treatment duration in days |
| `startDate` | `Date` | ✅ | When to start taking |
| `endDate` | `Date` | ✅ | When to stop taking |
| `status` | Status enum | ✅ | Current medication status |
| `prescribedBy` | `string` | ❌ | Doctor's name |
| `pharmacy` | `string` | ❌ | Pharmacy name |
| `instructions` | `string` | ❌ | Special instructions |
| `notes` | `string` | ❌ | Personal notes |
| `sideEffects` | `string` | ❌ | Known side effects |
| `reminderEnabled` | `boolean` | ✅ | Enable reminders |
| `soundEnabled` | `boolean` | ✅ | Play sound on reminder |
| `vibrationEnabled` | `boolean` | ✅ | Vibrate on reminder |
| `createdAt` | `Date` | ✅ | Creation timestamp |
| `updatedAt` | `Date` | ✅ | Last update timestamp |

### Medicine Types

```typescript
type MedicineType = 
  | 'tablet'     // Pills
  | 'capsule'    // Capsules
  | 'liquid'     // Syrups, solutions
  | 'injection'  // Injectable
  | 'cream'      // Topical creams/ointments
  | 'inhaler'    // Inhalers
  | 'other';     // Other forms
```

### Medicine Status

```typescript
type MedicineStatus = 
  | 'active'        // Currently taking
  | 'paused'        // Temporarily stopped
  | 'completed'     // Finished course
  | 'discontinued'; // Permanently stopped
```

### Firestore Collection

- **Collection:** `medicines`
- **Document ID:** Auto-generated
- **Indexed by:** `userId`

### Example

```typescript
const medicine: Medicine = {
  id: 'med_abc123',
  userId: 'user_123',
  name: 'Aspirin',
  genericName: 'Acetylsalicylic acid',
  dosage: '100mg',
  type: 'tablet',
  color: '#3B82F6',
  frequency: 'twice daily',
  times: ['08:00', '20:00'],
  duration: 90,
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-03-31'),
  status: 'active',
  prescribedBy: 'Dr. Kim',
  pharmacy: 'Seoul Pharmacy',
  instructions: 'Take with food',
  notes: 'For heart health',
  sideEffects: 'Stomach upset',
  reminderEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
};
```

### Usage

```typescript
import { addMedicine, updateMedicine } from './lib/firebase';

// Add medicine
const medicineId = await addMedicine({
  userId: 'user_123',
  name: 'Aspirin',
  dosage: '100mg',
  type: 'tablet',
  // ... other required fields
});

// Update status
await updateMedicine(medicineId, { status: 'paused' });
```

---

## MedicineWithStats

Extended Medicine interface with calculated UI fields for displaying statistics.

### TypeScript Interface

```typescript
interface MedicineWithStats extends Medicine {
  bgColor?: string;      // UI background color class
  adherence?: number;    // Calculated adherence percentage
  streak?: number;       // Current streak in days
  totalDoses?: number;   // Total expected doses
  takenDoses?: number;   // Total taken doses
  nextDose?: string;     // Next scheduled dose time
}
```

### Additional Fields

| Field | Type | Description |
|-------|------|-------------|
| `bgColor` | `string` | Tailwind background color class for UI |
| `adherence` | `number` | Calculated adherence percentage (0-100) |
| `streak` | `number` | Current consecutive days streak |
| `totalDoses` | `number` | Total number of expected doses |
| `takenDoses` | `number` | Total number of doses taken |
| `nextDose` | `string` | Next scheduled dose time (HH:mm format) |

### Usage

```typescript
import { enrichMedicineWithStats } from './lib/utils';

// Enrich a medicine with statistics
const medicineWithStats = await enrichMedicineWithStats(medicine, userId);

console.log(`Adherence: ${medicineWithStats.adherence}%`);
console.log(`Streak: ${medicineWithStats.streak} days`);
console.log(`Next dose: ${medicineWithStats.nextDose}`);
```

**Example:**

```typescript
// In MedicineCard component
function MedicineCard({ medicine }: { medicine: MedicineWithStats }) {
  return (
    <div className={medicine.bgColor}>
      <h3>{medicine.name}</h3>
      <p>Adherence: {medicine.adherence}%</p>
      <p>Streak: {medicine.streak} days</p>
      <p>Next: {medicine.nextDose}</p>
    </div>
  );
}
```

---

## DoseRecord

Represents a single dose instance (scheduled, taken, or missed).

### TypeScript Interface

```typescript
interface DoseRecord {
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
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique record ID |
| `medicineId` | `string` | ✅ | Associated medicine ID |
| `userId` | `string` | ✅ | User ID |
| `scheduledDate` | `Date` | ✅ | Date dose was scheduled |
| `scheduledTime` | `string` | ✅ | Time dose was scheduled (HH:mm) |
| `status` | Dose status | ✅ | Whether dose was taken |
| `takenAt` | `Date` | ❌ | Actual time dose was taken |
| `note` | `string` | ❌ | User's note about this dose |
| `createdAt` | `Date` | ✅ | Record creation timestamp |
| `updatedAt` | `Date` | ✅ | Last update timestamp |

### Dose Status

```typescript
type DoseStatus = 
  | 'taken'   // User confirmed they took it
  | 'missed'  // User confirmed they missed it
  | 'skipped' // User intentionally skipped
  | 'pending'; // Scheduled but not yet taken
```

### Firestore Collection

- **Collection:** `doseRecords`
- **Document ID:** Auto-generated
- **Indexed by:** `medicineId`, `userId`, `scheduledDate`

### Example

```typescript
const doseRecord: DoseRecord = {
  id: 'dose_xyz789',
  medicineId: 'med_abc123',
  userId: 'user_123',
  scheduledDate: new Date('2025-11-03'),
  scheduledTime: '08:00',
  status: 'taken',
  takenAt: new Date('2025-11-03T08:05:00'),
  note: 'Took with breakfast',
  createdAt: new Date('2025-11-03T08:00:00'),
  updatedAt: new Date('2025-11-03T08:05:00')
};
```

### Usage

```typescript
import { addDoseRecord, markDoseAsTaken } from './lib/firebase';

// Create scheduled dose
const recordId = await addDoseRecord({
  medicineId: 'med_123',
  userId: 'user_123',
  scheduledDate: new Date(),
  scheduledTime: '08:00',
  status: 'pending'
});

// Mark as taken
await markDoseAsTaken(recordId, 'Took with breakfast');
```

---

## Guardian

Represents a bidirectional guardian-patient relationship.

### TypeScript Interface

```typescript
interface Guardian {
  id: string;
  userId: string;
  guardianId: string;
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
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique relationship ID |
| `userId` | `string` | ✅ | Care recipient (patient) ID |
| `guardianId` | `string` | ✅ | Guardian's user ID |
| `guardianName` | `string` | ✅ | Guardian's name |
| `guardianEmail` | `string` | ✅ | Guardian's email |
| `guardianPhone` | `string` | ❌ | Guardian's phone |
| `relationship` | `string` | ✅ | Relationship type (e.g., "Family", "Friend") |
| `status` | Status enum | ✅ | Relationship status |
| `permissions` | Object | ✅ | Access permissions |
| `invitedAt` | `Date` | ✅ | When invitation was sent |
| `acceptedAt` | `Date` | ❌ | When invitation was accepted |
| `createdAt` | `Date` | ✅ | Creation timestamp |
| `updatedAt` | `Date` | ✅ | Last update timestamp |

### Guardian Status

```typescript
type GuardianStatus = 
  | 'active'   // Guardian has active access
  | 'pending'  // Invitation sent, not yet accepted
  | 'inactive'; // Access revoked
```

### Permissions

```typescript
interface Permissions {
  viewMedications: boolean; // Can see medicine list
  viewHistory: boolean;     // Can see dose records
  receiveAlerts: boolean;   // Gets notifications
}
```

### Bidirectional Queries

```typescript
// Patient perspective: Who is monitoring me?
const guardians = await getGuardians(userId);
// Query: where('userId', '==', userId)

// Guardian perspective: Who am I monitoring?
const recipients = await getCareRecipients(guardianId);
// Query: where('guardianId', '==', guardianId)
```

### Firestore Collection

- **Collection:** `guardians`
- **Document ID:** Auto-generated
- **Indexed by:** `userId`, `guardianId`

### Example

```typescript
const guardian: Guardian = {
  id: 'guard_123',
  userId: 'patient_456',       // Patient being monitored
  guardianId: 'guardian_789',  // Guardian monitoring
  guardianName: '이영희',
  guardianEmail: 'younghee@example.com',
  guardianPhone: '+82-10-9876-5432',
  relationship: 'Daughter',
  status: 'active',
  permissions: {
    viewMedications: true,
    viewHistory: true,
    receiveAlerts: true
  },
  invitedAt: new Date('2025-01-01'),
  acceptedAt: new Date('2025-01-02'),
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-02')
};
```

---

## CareRecipient

Extended Guardian interface with recipient details (for guardian's view).

### TypeScript Interface

```typescript
interface CareRecipient extends Guardian {
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  recipientPhotoURL?: string;
  lastActivity?: Date;
  medicationCount?: number;
  upcomingDoses?: number;
}
```

### Additional Fields

| Field | Type | Description |
|-------|------|-------------|
| `recipientName` | `string` | Care recipient's name |
| `recipientEmail` | `string` | Care recipient's email |
| `recipientPhone` | `string` | Care recipient's phone |
| `recipientPhotoURL` | `string` | Care recipient's photo |
| `lastActivity` | `Date` | Last app activity timestamp |
| `medicationCount` | `number` | Total active medications |
| `upcomingDoses` | `number` | Upcoming doses in next 24h |

### Usage

```typescript
// Used in guardian dashboard to show enriched recipient info
const { recipients } = useCareRecipients(guardianId, true);

recipients.forEach(recipient => {
  console.log(`${recipient.recipientName} (${recipient.recipientEmail})`);
  console.log(`Medications: ${recipient.medicationCount}`);
  console.log(`Upcoming doses: ${recipient.upcomingDoses}`);
});
```

---

## Invitation

Represents a guardian invitation sent to someone via email.

### TypeScript Interface

```typescript
interface Invitation {
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
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique invitation ID |
| `fromUserId` | `string` | ✅ | Patient who sent invitation |
| `fromUserName` | `string` | ✅ | Patient's name |
| `fromUserEmail` | `string` | ✅ | Patient's email |
| `toEmail` | `string` | ✅ | Guardian's email |
| `relationship` | `string` | ✅ | Relationship type |
| `status` | Status enum | ✅ | Invitation status |
| `invitedAt` | `Date` | ✅ | When sent |
| `respondedAt` | `Date` | ❌ | When accepted/rejected |
| `expiresAt` | `Date` | ✅ | Expiration date (7 days default) |

### Invitation Status

```typescript
type InvitationStatus = 
  | 'pending'  // Sent, awaiting response
  | 'accepted' // Guardian accepted
  | 'rejected' // Guardian rejected
  | 'expired'; // Expired (7 days)
```

### Firestore Collection

- **Collection:** `invitations`
- **Document ID:** Auto-generated
- **Indexed by:** `fromUserId`, `toEmail`

### Example

```typescript
const invitation: Invitation = {
  id: 'inv_abc',
  fromUserId: 'patient_123',
  fromUserName: '김철수',
  fromUserEmail: 'chulsoo@example.com',
  toEmail: 'younghee@example.com',
  relationship: 'Family',
  status: 'pending',
  invitedAt: new Date('2025-11-01'),
  expiresAt: new Date('2025-11-08'),
  respondedAt: undefined
};
```

### Usage

```typescript
import { sendInvitation, respondToInvitation } from './lib/firebase';

// Send invitation
const invitationId = await sendInvitation({
  fromUserId: 'patient_123',
  fromUserName: '김철수',
  fromUserEmail: 'chulsoo@example.com',
  toEmail: 'younghee@example.com',
  relationship: 'Daughter',
  status: 'pending',
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

// Accept invitation
await respondToInvitation(invitationId, 'accepted');
```

---

## Reminder

Represents a scheduled reminder notification.

### TypeScript Interface

```typescript
interface Reminder {
  id: string;
  medicineId: string;
  userId: string;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'scheduled' | 'sent' | 'dismissed' | 'snoozed';
  snoozeUntil?: Date;
  createdAt: Date;
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique reminder ID |
| `medicineId` | `string` | ✅ | Medicine to remind about |
| `userId` | `string` | ✅ | User ID |
| `scheduledDate` | `Date` | ✅ | Date of reminder |
| `scheduledTime` | `string` | ✅ | Time of reminder (HH:mm) |
| `status` | Status enum | ✅ | Reminder status |
| `snoozeUntil` | `Date` | ❌ | If snoozed, when to remind again |
| `createdAt` | `Date` | ✅ | Creation timestamp |

### Reminder Status

```typescript
type ReminderStatus = 
  | 'scheduled' // Not yet sent
  | 'sent'      // Notification sent
  | 'dismissed' // User dismissed
  | 'snoozed';  // User snoozed
```

### Firestore Collection

- **Collection:** `reminders`
- **Document ID:** Auto-generated

---

## UserSettings

User preferences and app settings.

### TypeScript Interface

```typescript
interface UserSettings {
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
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `string` | ✅ | User ID |
| `language` | `'ko' \| 'en'` | ✅ | UI language |
| `notifications` | Object | ✅ | Notification preferences |
| `theme` | Theme enum | ✅ | Color theme |
| `fontSize` | Size enum | ✅ | Text size preference |
| `weekStartsOn` | Day enum | ✅ | First day of week |
| `updatedAt` | `Date` | ✅ | Last update timestamp |

### Notification Settings

```typescript
interface NotificationSettings {
  enabled: boolean;        // Master toggle
  sound: boolean;          // Play sound
  vibration: boolean;      // Vibrate device
  advanceReminder: number; // Minutes before (e.g., 15)
}
```

### Firestore Collection

- **Collection:** `settings`
- **Document ID:** `{userId}`

### Example

```typescript
const settings: UserSettings = {
  userId: 'user_123',
  language: 'ko',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    advanceReminder: 15
  },
  theme: 'light',
  fontSize: 'large',
  weekStartsOn: 'monday',
  updatedAt: new Date()
};
```

---

## AdherenceStats

Extended statistics interface for calculated adherence metrics.

### TypeScript Interface

```typescript
interface AdherenceStats {
  adherence: number;     // Percentage (0-100)
  streak: number;        // Current streak in days
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  skippedDoses: number;
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `adherence` | `number` | Adherence percentage (0-100) |
| `streak` | `number` | Current consecutive days streak |
| `totalDoses` | `number` | Total expected doses |
| `takenDoses` | `number` | Number of doses taken |
| `missedDoses` | `number` | Number of doses missed |
| `skippedDoses` | `number` | Number of doses skipped |

### Usage

```typescript
import { calculateAdherenceStats } from './lib/utils';

const stats = calculateAdherenceStats(medicine, doseRecords);
console.log(`Adherence: ${stats.adherence}%`);
console.log(`Current Streak: ${stats.streak} days`);
```

---

## UserStats

User account statistics for profile page and dashboard.

### TypeScript Interface

```typescript
interface UserStats {
  totalMedicines: number;
  activeMedicines: number;
  overallAdherence: number;
  currentStreak: number;
  totalDosesTaken: number;
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalMedicines` | `number` | Total number of medicines (all statuses) |
| `activeMedicines` | `number` | Number of active medicines |
| `overallAdherence` | `number` | Overall adherence percentage (0-100) |
| `currentStreak` | `number` | Current consecutive days with all doses taken |
| `totalDosesTaken` | `number` | Total number of doses taken |

### Usage

```typescript
import { calculateUserStats } from './lib/utils';

const stats = calculateUserStats(medicines, doseRecords);
console.log(`Overall Adherence: ${stats.overallAdherence}%`);
console.log(`Active Medications: ${stats.activeMedicines}`);
console.log(`Current Streak: ${stats.currentStreak} days`);
```

**Example:**

```typescript
// In ProfilePage component
const { medicines } = useMedicines(user?.uid);
const doseRecords = await getUserDoseRecords(user?.uid);

const stats = calculateUserStats(medicines, doseRecords);

return (
  <div>
    <h2>Account Statistics</h2>
    <p>Total Medicines: {stats.totalMedicines}</p>
    <p>Active Medicines: {stats.activeMedicines}</p>
    <p>Adherence: {stats.overallAdherence}%</p>
    <p>Streak: {stats.currentStreak} days</p>
    <p>Total Doses Taken: {stats.totalDosesTaken}</p>
  </div>
);
```

---

## Collections

Firestore collection name constants.

### TypeScript Interface

```typescript
const COLLECTIONS = {
  USERS: 'users',
  MEDICINES: 'medicines',
  DOSE_RECORDS: 'doseRecords',
  GUARDIANS: 'guardians',
  INVITATIONS: 'invitations',
  REMINDERS: 'reminders',
  SETTINGS: 'settings'
} as const;
```

### Usage

```typescript
import { COLLECTIONS } from './lib/types';
import { collection, getDocs } from 'firebase/firestore';

const medicinesRef = collection(db, COLLECTIONS.MEDICINES);
const snapshot = await getDocs(medicinesRef);
```

---

## Summary Table

| Model | Collection | Purpose |
|-------|-----------|---------|
| User | `users` | User accounts and profiles |
| Medicine | `medicines` | Medications and schedules |
| MedicineWithStats | N/A (extends Medicine) | Medicine with UI calculations |
| DoseRecord | `doseRecords` | Dose tracking history |
| Guardian | `guardians` | Guardian-patient relationships |
| CareRecipient | N/A (extends Guardian) | Guardian's view of recipients |
| Invitation | `invitations` | Guardian invitations |
| Reminder | `reminders` | Scheduled reminders |
| UserSettings | `settings` | User preferences |
| AdherenceStats | N/A (calculated) | Adherence statistics |
| UserStats | N/A (calculated) | User account statistics |

---

## Type Exports

All types are exported from `/lib/types/index.ts` and re-exported from `/lib/firebase/index.ts`:

```typescript
import type {
  User,
  Medicine,
  MedicineWithStats,
  DoseRecord,
  Guardian,
  CareRecipient,
  Invitation,
  Reminder,
  UserSettings,
  AdherenceStats,
  UserStats
} from './lib/types';

// Or from main Firebase export
import type { User, Medicine, UserStats } from './lib/firebase';
```

---

**Related Documentation:**
- `/lib/README.md` - Firebase integration guide
- `/lib/AUTHENTICATION-GUIDE.md` - Auth functions
- `/lib/CARE-RECIPIENT-GUIDE.md` - Guardian functionality
- `/lib/HOOKS-REFERENCE.md` - React hooks
