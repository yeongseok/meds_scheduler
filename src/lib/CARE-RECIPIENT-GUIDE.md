# Care Recipient Management - Guardian Perspective Guide

## Overview

This guide explains how guardians can access and monitor their care recipients' (patients') medication data using the Firebase integration.

## Key Concepts

### Bidirectional Relationship

The `guardians` collection stores a **bidirectional relationship**:

```typescript
interface Guardian {
  userId: string;        // The care recipient (patient)
  guardianId: string;    // The guardian (caregiver)
  // ... other fields
}
```

This allows:
- **Patients** to query: "Who is monitoring me?"
- **Guardians** to query: "Who am I monitoring?"

### Permission-Based Access

Guardians can only access recipient data if they have **active permissions**:

```typescript
permissions: {
  viewMedications: boolean;  // Can see medicines
  viewHistory: boolean;       // Can see dose records
  receiveAlerts: boolean;     // Gets notifications (future)
}
```

All database functions **automatically check permissions** before returning data.

## Available Functions

### 1. Get Care Recipients

Get all people the guardian is monitoring:

```typescript
import { getCareRecipients } from './lib/firebase';

const recipients = await getCareRecipients(guardianId);
// Returns: Guardian[] with status === 'active'
```

### 2. Get Care Recipient Details

Get detailed information about a specific care recipient:

```typescript
import { getCareRecipientWithDetails } from './lib/firebase';

const recipient = await getCareRecipientWithDetails(guardianId, recipientUserId);
// Returns: Guardian | null
```

### 3. Get Recipient's Medicines

Get medications for a care recipient (with permission check):

```typescript
import { getRecipientMedicines } from './lib/firebase';

try {
  const medicines = await getRecipientMedicines(recipientUserId, guardianId);
  // Returns: Medicine[] if permission granted
} catch (error) {
  // Error if no permission or relationship not found
  console.error(error.message);
}
```

**Permission Required:** `viewMedications: true`

### 4. Get Recipient's Dose Records

Get dose history for a care recipient:

```typescript
import { getRecipientDoseRecords } from './lib/firebase';

const records = await getRecipientDoseRecords(
  recipientUserId,
  guardianId,
  medicineId,  // optional - filter by medicine
  startDate,   // optional - filter by date range
  endDate      // optional
);
// Returns: DoseRecord[]
```

**Permission Required:** `viewHistory: true`

### 5. Get Recipient's Profile

Get basic profile information:

```typescript
import { getRecipientProfile } from './lib/firebase';

const profile = await getRecipientProfile(recipientUserId, guardianId);
// Returns: User | null
```

## Custom React Hooks

### useCareRecipients Hook

Manages all care recipients for a guardian:

```typescript
import { useCareRecipients } from './lib/hooks';

function GuardianDashboard() {
  const guardianId = user?.uid;
  
  const {
    recipients,              // Guardian[] - All care recipients
    loading,                 // boolean - Loading state
    error,                   // string | null - Error message
    getRecipientMedicines,   // Function to get medicines
    getRecipientDoseRecords, // Function to get dose records
    getRecipientProfile      // Function to get profile
  } = useCareRecipients(guardianId, true); // true = real-time updates
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>People I'm Caring For</h2>
      {recipients.map(recipient => (
        <div key={recipient.id}>
          <p>{recipient.guardianName}</p>
          <p>Status: {recipient.status}</p>
          <p>Relationship: {recipient.relationship}</p>
        </div>
      ))}
    </div>
  );
}
```

### useRecipientMedicines Hook

Real-time monitoring of a specific recipient's medications:

```typescript
import { useRecipientMedicines } from './lib/hooks';

function RecipientMedicinesPage({ recipientUserId }: { recipientUserId: string }) {
  const guardianId = user?.uid;
  
  const {
    medicines,  // Medicine[] - Real-time updated
    loading,    // boolean
    error       // string | null
  } = useRecipientMedicines(guardianId, recipientUserId);
  
  if (error) return <div>No permission or error: {error}</div>;
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Medications</h2>
      {medicines.map(medicine => (
        <div key={medicine.id}>
          <h3>{medicine.name}</h3>
          <p>{medicine.dosage}</p>
          <p>Status: {medicine.status}</p>
        </div>
      ))}
    </div>
  );
}
```

## Real-Time Listeners

### Listen to Care Recipients

Get real-time updates when care recipient relationships change:

```typescript
import { listenToCareRecipients } from './lib/firebase';

const unsubscribe = listenToCareRecipients(guardianId, (recipients) => {
  console.log('Updated recipients:', recipients);
  // Update UI with new data
});

// Cleanup when component unmounts
return () => unsubscribe();
```

### Listen to Recipient Medicines

Get real-time updates for a recipient's medications:

```typescript
import { listenToRecipientMedicines } from './lib/firebase';

listenToRecipientMedicines(
  recipientUserId,
  guardianId,
  (medicines) => {
    console.log('Updated medicines:', medicines);
    // Update UI
  },
  (error) => {
    console.error('Error or no permission:', error);
    // Handle error
  }
);
```

## Complete Example: Guardian Dashboard

```typescript
import React, { useState } from 'react';
import { useCareRecipients } from './lib/hooks';
import { useAuth } from './lib/hooks';

function GuardianDashboard() {
  const { user } = useAuth();
  const guardianId = user?.uid;
  
  const {
    recipients,
    loading,
    error,
    getRecipientMedicines,
    getRecipientDoseRecords
  } = useCareRecipients(guardianId, true);
  
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [recipientMedicines, setRecipientMedicines] = useState<any[]>([]);
  
  const handleViewRecipient = async (recipientUserId: string) => {
    setSelectedRecipient(recipientUserId);
    
    try {
      // Get medicines with permission check
      const medicines = await getRecipientMedicines(recipientUserId);
      setRecipientMedicines(medicines);
      
      // Get recent dose records
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
      
      const records = await getRecipientDoseRecords(
        recipientUserId,
        undefined, // all medicines
        startDate,
        endDate
      );
      
      console.log('Recent records:', records);
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  };
  
  if (loading) return <div>Loading care recipients...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!recipients.length) {
    return <div>You are not currently monitoring anyone.</div>;
  }
  
  return (
    <div>
      <h1>Guardian Dashboard</h1>
      
      <section>
        <h2>People I'm Caring For ({recipients.length})</h2>
        {recipients.map(recipient => (
          <div key={recipient.id} className="card">
            <h3>{recipient.guardianName}</h3>
            <p>Email: {recipient.guardianEmail}</p>
            <p>Relationship: {recipient.relationship}</p>
            <p>Status: {recipient.status}</p>
            
            <div>
              <strong>Permissions:</strong>
              <ul>
                <li>View Medications: {recipient.permissions.viewMedications ? '✓' : '✗'}</li>
                <li>View History: {recipient.permissions.viewHistory ? '✓' : '✗'}</li>
                <li>Receive Alerts: {recipient.permissions.receiveAlerts ? '✓' : '✗'}</li>
              </ul>
            </div>
            
            <button onClick={() => handleViewRecipient(recipient.userId)}>
              View Details
            </button>
          </div>
        ))}
      </section>
      
      {selectedRecipient && (
        <section>
          <h2>Recipient Medications</h2>
          {recipientMedicines.map(medicine => (
            <div key={medicine.id} className="medicine-card">
              <h4>{medicine.name}</h4>
              <p>{medicine.dosage}</p>
              <p>Times: {medicine.times.join(', ')}</p>
              <p>Status: {medicine.status}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default GuardianDashboard;
```

## Error Handling

All functions throw errors if:
- Guardian relationship doesn't exist
- Guardian doesn't have required permissions
- Database operation fails

Always use try-catch when calling these functions:

```typescript
try {
  const medicines = await getRecipientMedicines(recipientUserId, guardianId);
  // Success
} catch (error: any) {
  if (error.message.includes('permission')) {
    // Permission denied
    alert('You do not have permission to view medications');
  } else if (error.message.includes('not found')) {
    // Relationship doesn't exist
    alert('Guardian relationship not found');
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

## Permission Levels

### viewMedications
When `true`, guardian can:
- Get list of all medicines
- View medicine details (name, dosage, schedule, etc.)
- See medicine status (active, paused, etc.)

### viewHistory
When `true`, guardian can:
- Get dose records
- See if doses were taken, missed, or skipped
- View dose timestamps and notes
- Filter by date range

### receiveAlerts
When `true`, guardian will:
- Receive notifications when doses are missed (future)
- Get alerts for medication changes (future)
- Be notified of adherence issues (future)

## Security Notes

1. **All permission checks happen server-side** (in database functions)
2. **Never bypass permission checks** in client code
3. **Guardian relationships must be 'active'** to access data
4. **Patients can revoke access** at any time by changing guardian status
5. **All queries are user-scoped** - guardians can only access their recipients

## Integration with Existing Components

### GuardianViewPage.tsx

This component should use `useCareRecipients` to display guardian's care recipients:

```typescript
import { useCareRecipients } from '../lib/hooks';

function GuardianViewPage() {
  const { user } = useAuth();
  const { recipients, loading } = useCareRecipients(user?.uid, true);
  
  // Display recipients and their data
}
```

### GuardiansPage.tsx (Patient View)

This component uses `useGuardians` to show who is monitoring the patient:

```typescript
import { useGuardians } from '../lib/hooks';

function GuardiansPage() {
  const { user } = useAuth();
  const { guardians, loading } = useGuardians(user?.uid, true);
  
  // Display guardians monitoring this patient
}
```

## Testing Checklist

- [ ] Guardian can see their care recipients
- [ ] Guardian can view recipient medicines (with permission)
- [ ] Guardian gets error without permission
- [ ] Real-time updates work when recipient adds medicine
- [ ] Guardian can view dose history (with permission)
- [ ] Permission changes are reflected immediately
- [ ] Status change to 'inactive' removes access
- [ ] Multiple guardians can monitor same recipient
- [ ] Recipient can remove guardian access

## Future Enhancements

1. **Push Notifications**: Alert guardians when doses are missed
2. **Adherence Reports**: Weekly/monthly adherence summaries
3. **Two-way Communication**: Guardians can send reminders
4. **Activity Feed**: Timeline of recipient's medication activities
5. **Emergency Contacts**: Quick access to emergency information

---

**For more information, see:**
- `/lib/README.md` - Complete Firebase documentation
- `/lib/types/index.ts` - TypeScript interfaces
- `/PROJECT-README.md` - Overall project structure
