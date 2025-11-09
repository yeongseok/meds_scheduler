# React Hooks Quick Reference

Complete reference for all custom React hooks in the Medicine Reminder App.

---

## 📋 Table of Contents

1. [useAuth](#useauth) - Authentication state management
2. [useUserProfile](#useuserprofile) - User profile management with photo upload
3. [useMedicines](#usemedicines) - Medicine list management
4. [useGuardians](#useguardians) - Guardian management (patient perspective)
5. [useCareRecipients](#usecarerecipients) - Care recipient management (guardian perspective)
6. [useRecipientMedicines](#userecipientmedicines) - Real-time recipient medicine monitoring

---

## useAuth

**File:** `/lib/hooks/useAuth.ts`  
**Purpose:** Manage authentication state and user profile

### Import

```typescript
import { useAuth } from './lib/hooks';
```

### Signature

```typescript
function useAuth(): {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}
```

### Parameters

None

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `user` | `FirebaseUser \| null` | Firebase Auth user object |
| `userProfile` | `User \| null` | Firestore user profile with app data |
| `loading` | `boolean` | True while fetching auth state |
| `isAuthenticated` | `boolean` | True if user is logged in |

### Usage Example

```typescript
function HomePage() {
  const { user, userProfile, loading, isAuthenticated } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return (
    <div>
      <h1>Welcome, {userProfile?.displayName}</h1>
      <p>User ID: {user?.uid}</p>
      <p>Language: {userProfile?.language}</p>
      <p>Pro: {userProfile?.isPro ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### When to Use

- ✅ Protecting routes (check if user is logged in)
- ✅ Displaying user information
- ✅ Getting user ID for database queries
- ✅ Checking user preferences (language, isPro)

### Related

- See `/lib/AUTHENTICATION-GUIDE.md` for complete auth documentation
- User type: `/lib/types/index.ts`

---

## useUserProfile

**File:** `/lib/hooks/useUserProfile.ts`  
**Purpose:** Manage user profile data including photo uploads

### Import

```typescript
import { useUserProfile } from './lib/hooks';
```

### Signature

```typescript
function useUserProfile(userId: string | undefined): {
  profile: User | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  uploadProfilePhoto: (file: File) => Promise<string>;
  refreshProfile: () => Promise<void>;
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | `string \| undefined` | ✅ Yes | User's Firebase Auth UID |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `profile` | `User \| null` | User profile from Firestore |
| `loading` | `boolean` | True while loading profile |
| `error` | `string \| null` | Error message if operation failed |
| `updateProfile` | `function` | Update profile fields (firstName, lastName, etc.) |
| `uploadProfilePhoto` | `function` | Upload profile photo to Firebase Storage |
| `refreshProfile` | `function` | Manually refresh profile from database |

### Usage Example

```typescript
function ProfilePage() {
  const { user } = useAuth();
  const { 
    profile, 
    loading, 
    error,
    updateProfile,
    uploadProfilePhoto 
  } = useUserProfile(user?.uid);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  
  const handleUpdateName = async () => {
    await updateProfile({
      firstName: 'John',
      lastName: 'Doe'
    });
  };
  
  const handlePhotoUpload = async (file: File) => {
    try {
      const photoURL = await uploadProfilePhoto(file);
      console.log('Photo uploaded:', photoURL);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return (
    <div>
      <img src={profile?.photoURL} alt="Profile" />
      <h1>{profile?.displayName}</h1>
      <p>{profile?.email}</p>
      
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhotoUpload(file);
        }}
      />
      
      <button onClick={handleUpdateName}>Update Name</button>
    </div>
  );
}
```

### Profile Photo Upload

The `uploadProfilePhoto` function:
- ✅ Validates file type (must be image/*)
- ✅ Validates file size (max 5MB)
- ✅ Uploads to Firebase Storage
- ✅ Returns download URL
- ✅ Automatically updates profile.photoURL
- ✅ Updates local state immediately

**Example:**

```typescript
const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  
  try {
    const photoURL = await uploadProfilePhoto(file);
    toast.success('Photo updated!');
  } catch (error: any) {
    if (error.message.includes('image')) {
      toast.error('Only image files allowed');
    } else if (error.message.includes('5MB')) {
      toast.error('File too large (max 5MB)');
    } else {
      toast.error('Upload failed');
    }
  }
};
```

### When to Use

- ✅ Displaying user profile information
- ✅ Editing profile (name, phone, birth date)
- ✅ Uploading/updating profile photos
- ✅ Showing account statistics
- ✅ Profile management pages

### Common Patterns

**Profile Edit with Re-authentication:**

```typescript
function ProfileEditPage() {
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile(user?.uid);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const handleSave = () => {
    // Show auth dialog before saving sensitive data
    setShowAuthDialog(true);
  };
  
  const handleAuthenticatedSave = async () => {
    await updateProfile({
      firstName: 'New First',
      lastName: 'New Last'
    });
  };
  
  return (
    <>
      {/* Edit form */}
      <UserAuthDialog
        open={showAuthDialog}
        onAuthenticated={handleAuthenticatedSave}
      />
    </>
  );
}
```

### Related

- See `/lib/PROFILE-PHOTO-UPLOAD.md` for complete photo upload documentation
- User type: `/lib/types/index.ts`
- Database functions: `/lib/firebase/db.ts`

---

## useMedicines

**File:** `/lib/hooks/useMedicines.ts`  
**Purpose:** Manage user's medicine list with CRUD operations

### Import

```typescript
import { useMedicines } from './lib/hooks';
```

### Signature

```typescript
function useMedicines(
  userId: string | undefined,
  realtime?: boolean
): {
  medicines: Medicine[];
  loading: boolean;
  error: string | null;
  addMedicine: (medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateMedicine: (medicineId: string, updates: Partial<Medicine>) => Promise<void>;
  deleteMedicine: (medicineId: string) => Promise<void>;
  refreshMedicines: () => Promise<void>;
}
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `userId` | `string \| undefined` | ✅ Yes | - | User's Firebase UID |
| `realtime` | `boolean` | ❌ No | `false` | Enable real-time updates |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `medicines` | `Medicine[]` | Array of user's medicines |
| `loading` | `boolean` | True while loading medicines |
| `error` | `string \| null` | Error message if any |
| `addMedicine` | `Function` | Add new medicine |
| `updateMedicine` | `Function` | Update existing medicine |
| `deleteMedicine` | `Function` | Delete medicine |
| `refreshMedicines` | `Function` | Manually refresh medicine list |

### Usage Example

```typescript
function MedicineListPage() {
  const { user } = useAuth();
  const { 
    medicines, 
    loading, 
    error, 
    addMedicine, 
    updateMedicine,
    deleteMedicine 
  } = useMedicines(user?.uid, true); // true = realtime
  
  const handleAdd = async () => {
    const newMedicine = {
      userId: user!.uid,
      name: 'Aspirin',
      dosage: '100mg',
      type: 'tablet' as const,
      frequency: 'daily',
      times: ['08:00', '20:00'],
      startDate: new Date(),
      endDate: new Date('2025-12-31'),
      status: 'active' as const,
      // ... other fields
    };
    
    const medicineId = await addMedicine(newMedicine);
    console.log('Added:', medicineId);
  };
  
  const handleUpdate = async (id: string) => {
    await updateMedicine(id, { status: 'paused' });
  };
  
  const handleDelete = async (id: string) => {
    await deleteMedicine(id);
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {medicines.map(med => (
        <div key={med.id}>
          <h3>{med.name}</h3>
          <p>{med.dosage}</p>
          <button onClick={() => handleUpdate(med.id)}>Pause</button>
          <button onClick={() => handleDelete(med.id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleAdd}>Add Medicine</button>
    </div>
  );
}
```

### Real-time vs One-time Fetch

```typescript
// Real-time: Automatically updates when medicines change
const { medicines } = useMedicines(userId, true);

// One-time: Fetches once, use refreshMedicines() to update
const { medicines, refreshMedicines } = useMedicines(userId, false);
```

### When to Use

- ✅ Displaying user's medicine list
- ✅ Adding/editing/deleting medicines
- ✅ Filtering active/paused medicines
- ✅ Getting medicine count

### Related

- Medicine type: `/lib/types/index.ts`
- Database functions: `/lib/firebase/db.ts`

---

## useGuardians

**File:** `/lib/hooks/useGuardians.ts`  
**Purpose:** Manage guardians who monitor the patient (patient perspective)

### Import

```typescript
import { useGuardians } from './lib/hooks';
```

### Signature

```typescript
function useGuardians(
  userId: string | undefined,
  realtime?: boolean
): {
  guardians: Guardian[];
  loading: boolean;
  error: string | null;
  addGuardian: (guardian: Omit<Guardian, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateGuardian: (guardianId: string, updates: Partial<Guardian>) => Promise<void>;
  deleteGuardian: (guardianId: string) => Promise<void>;
  refreshGuardians: () => Promise<void>;
}
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `userId` | `string \| undefined` | ✅ Yes | - | Patient's user ID |
| `realtime` | `boolean` | ❌ No | `false` | Enable real-time updates |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `guardians` | `Guardian[]` | Array of guardians monitoring this patient |
| `loading` | `boolean` | True while loading |
| `error` | `string \| null` | Error message if any |
| `addGuardian` | `Function` | Add new guardian |
| `updateGuardian` | `Function` | Update guardian permissions/status |
| `deleteGuardian` | `Function` | Remove guardian access |
| `refreshGuardians` | `Function` | Manually refresh list |

### Usage Example

```typescript
function GuardiansPage() {
  const { user } = useAuth();
  const { 
    guardians, 
    loading, 
    updateGuardian, 
    deleteGuardian 
  } = useGuardians(user?.uid, true);
  
  const handleTogglePermission = async (guardianId: string, currentValue: boolean) => {
    await updateGuardian(guardianId, {
      permissions: {
        viewMedications: !currentValue,
        viewHistory: true,
        receiveAlerts: true
      }
    });
  };
  
  const handleRemoveGuardian = async (guardianId: string) => {
    if (confirm('Remove this guardian?')) {
      await deleteGuardian(guardianId);
    }
  };
  
  if (loading) return <div>Loading guardians...</div>;
  
  return (
    <div>
      <h2>People Monitoring Me</h2>
      {guardians.map(guardian => (
        <div key={guardian.id}>
          <h3>{guardian.guardianName}</h3>
          <p>Email: {guardian.guardianEmail}</p>
          <p>Relationship: {guardian.relationship}</p>
          <p>Status: {guardian.status}</p>
          
          <label>
            <input
              type="checkbox"
              checked={guardian.permissions.viewMedications}
              onChange={() => handleTogglePermission(
                guardian.id, 
                guardian.permissions.viewMedications
              )}
            />
            Can view my medications
          </label>
          
          <button onClick={() => handleRemoveGuardian(guardian.id)}>
            Remove Access
          </button>
        </div>
      ))}
    </div>
  );
}
```

### When to Use

- ✅ Patient view: "Who is monitoring me?"
- ✅ Managing guardian permissions
- ✅ Removing guardian access
- ✅ Displaying guardian information

### Related

- Guardian type: `/lib/types/index.ts`
- Care recipient guide: `/lib/CARE-RECIPIENT-GUIDE.md`

---

## useCareRecipients

**File:** `/lib/hooks/useCareRecipients.ts`  
**Purpose:** Manage care recipients the guardian is monitoring (guardian perspective)

### Import

```typescript
import { useCareRecipients } from './lib/hooks';
```

### Signature

```typescript
function useCareRecipients(
  guardianId: string | undefined,
  realtime?: boolean
): {
  recipients: Guardian[];
  loading: boolean;
  error: string | null;
  getRecipientMedicines: (recipientUserId: string) => Promise<Medicine[]>;
  getRecipientDoseRecords: (
    recipientUserId: string,
    medicineId?: string,
    startDate?: Date,
    endDate?: Date
  ) => Promise<DoseRecord[]>;
  getRecipientProfile: (recipientUserId: string) => Promise<User | null>;
}
```

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `guardianId` | `string \| undefined` | ✅ Yes | - | Guardian's user ID |
| `realtime` | `boolean` | ❌ No | `false` | Enable real-time updates |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `recipients` | `Guardian[]` | Array of care recipients |
| `loading` | `boolean` | True while loading |
| `error` | `string \| null` | Error message if any |
| `getRecipientMedicines` | `Function` | Get recipient's medicines (permission-checked) |
| `getRecipientDoseRecords` | `Function` | Get recipient's dose records (permission-checked) |
| `getRecipientProfile` | `Function` | Get recipient's profile |

### Usage Example

```typescript
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
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  
  const handleViewRecipient = async (recipientUserId: string) => {
    setSelectedRecipient(recipientUserId);
    
    try {
      // Get medicines with automatic permission check
      const meds = await getRecipientMedicines(recipientUserId);
      setMedicines(meds);
      
      // Get recent dose records
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const records = await getRecipientDoseRecords(
        recipientUserId,
        undefined, // all medicines
        startDate,
        endDate
      );
      
      console.log('Recent doses:', records);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>People I'm Caring For</h1>
      
      {recipients.map(recipient => (
        <div key={recipient.id}>
          <h3>{recipient.guardianName}</h3>
          <p>Email: {recipient.guardianEmail}</p>
          <p>Relationship: {recipient.relationship}</p>
          
          <button onClick={() => handleViewRecipient(recipient.userId)}>
            View Details
          </button>
        </div>
      ))}
      
      {selectedRecipient && (
        <div>
          <h2>Medications</h2>
          {medicines.map(med => (
            <div key={med.id}>
              <h4>{med.name}</h4>
              <p>{med.dosage}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Permission Handling

All methods automatically check permissions:

```typescript
try {
  // Will throw error if no permission
  const medicines = await getRecipientMedicines(recipientUserId);
} catch (error: any) {
  if (error.message.includes('permission')) {
    alert('You do not have permission to view medications');
  }
}
```

### When to Use

- ✅ Guardian view: "Who am I caring for?"
- ✅ Viewing recipient's medications
- ✅ Monitoring dose adherence
- ✅ Getting recipient information

### Related

- Care recipient guide: `/lib/CARE-RECIPIENT-GUIDE.md`
- Guardian type: `/lib/types/index.ts`

---

## useRecipientMedicines

**File:** `/lib/hooks/useCareRecipients.ts`  
**Purpose:** Real-time monitoring of specific recipient's medications

### Import

```typescript
import { useRecipientMedicines } from './lib/hooks';
```

### Signature

```typescript
function useRecipientMedicines(
  guardianId: string | undefined,
  recipientUserId: string | undefined
): {
  medicines: Medicine[];
  loading: boolean;
  error: string | null;
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guardianId` | `string \| undefined` | ✅ Yes | Guardian's user ID |
| `recipientUserId` | `string \| undefined` | ✅ Yes | Care recipient's user ID |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `medicines` | `Medicine[]` | Real-time updated medicine array |
| `loading` | `boolean` | True while loading |
| `error` | `string \| null` | Error if no permission or other issue |

### Usage Example

```typescript
function RecipientDetailPage({ recipientUserId }: { recipientUserId: string }) {
  const { user } = useAuth();
  const guardianId = user?.uid;
  
  const { medicines, loading, error } = useRecipientMedicines(
    guardianId,
    recipientUserId
  );
  
  if (loading) return <div>Loading medications...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Medications ({medicines.length})</h2>
      
      {medicines.map(medicine => (
        <div key={medicine.id} className="medicine-card">
          <h3>{medicine.name}</h3>
          <p>Dosage: {medicine.dosage}</p>
          <p>Type: {medicine.type}</p>
          <p>Times: {medicine.times.join(', ')}</p>
          <p>Status: {medicine.status}</p>
          <p>
            Frequency: {medicine.frequency} 
            ({medicine.times.length}x per day)
          </p>
        </div>
      ))}
      
      {medicines.length === 0 && (
        <p>No medications found</p>
      )}
    </div>
  );
}
```

### Real-time Updates

```typescript
// Automatically updates when:
// - Recipient adds new medicine
// - Recipient updates medicine
// - Recipient deletes medicine
// - Medicine status changes

const { medicines } = useRecipientMedicines(guardianId, recipientUserId);
// medicines array updates automatically in real-time
```

### When to Use

- ✅ Dedicated recipient detail page
- ✅ Real-time medication monitoring
- ✅ Guardian dashboard with selected recipient
- ✅ Monitoring active medications only

### Related

- useCareRecipients hook (parent hook)
- Care recipient guide: `/lib/CARE-RECIPIENT-GUIDE.md`

---

## Hook Comparison Matrix

| Hook | Perspective | Real-time | CRUD Operations | Permission Check |
|------|-------------|-----------|-----------------|------------------|
| `useAuth` | Current user | ✅ | ❌ | N/A |
| `useMedicines` | Patient | ✅/❌ | ✅ | N/A (own data) |
| `useGuardians` | Patient | ✅/❌ | ✅ | N/A (own data) |
| `useCareRecipients` | Guardian | ✅/❌ | ❌ (read-only) | ✅ Auto |
| `useRecipientMedicines` | Guardian | ✅ | ❌ (read-only) | ✅ Auto |

---

## Common Patterns

### Pattern 1: Protected Page with Data

```typescript
function MyPage() {
  const { user, loading: authLoading } = useAuth();
  const { medicines, loading: dataLoading } = useMedicines(user?.uid, true);
  
  if (authLoading || dataLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return <div>{/* Use medicines */}</div>;
}
```

### Pattern 2: Conditional Rendering

```typescript
function Dashboard() {
  const { medicines, loading, error } = useMedicines(userId, true);
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorAlert message={error} />;
  if (medicines.length === 0) return <EmptyState />;
  
  return <MedicineList medicines={medicines} />;
}
```

### Pattern 3: Guardian View with Selection

```typescript
function GuardianView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { recipients } = useCareRecipients(guardianId, true);
  const { medicines } = useRecipientMedicines(guardianId, selectedId || undefined);
  
  return (
    <div>
      <RecipientList 
        recipients={recipients} 
        onSelect={setSelectedId} 
      />
      {selectedId && <MedicineList medicines={medicines} />}
    </div>
  );
}
```

### Pattern 4: Error Handling

```typescript
function Component() {
  const { medicines, error } = useMedicines(userId, true);
  
  useEffect(() => {
    if (error) {
      toast.error('Failed to load medicines: ' + error);
    }
  }, [error]);
  
  return <div>{/* ... */}</div>;
}
```

---

## Summary

### All Hooks at a Glance

```typescript
// Authentication
const { user, userProfile, loading, isAuthenticated } = useAuth();

// Patient's medicines
const { medicines, addMedicine, updateMedicine, deleteMedicine } = useMedicines(userId, true);

// Patient's guardians (who monitors me?)
const { guardians, updateGuardian, deleteGuardian } = useGuardians(userId, true);

// Guardian's recipients (who am I monitoring?)
const { recipients, getRecipientMedicines } = useCareRecipients(guardianId, true);

// Specific recipient's medicines (real-time)
const { medicines } = useRecipientMedicines(guardianId, recipientUserId);
```

### Quick Decision Guide

**Need to know who's logged in?**
→ `useAuth()`

**Need patient's medicine list?**
→ `useMedicines(userId, realtime)`

**Need to manage patient's guardians?**
→ `useGuardians(userId, realtime)`

**Need to see who guardian is monitoring?**
→ `useCareRecipients(guardianId, realtime)`

**Need real-time monitoring of one recipient?**
→ `useRecipientMedicines(guardianId, recipientUserId)`

---

**For detailed documentation:**
- Authentication: `/lib/AUTHENTICATION-GUIDE.md`
- Care Recipients: `/lib/CARE-RECIPIENT-GUIDE.md`
- General Firebase: `/lib/README.md`
- Data Types: `/lib/types/index.ts`
