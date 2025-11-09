# Migration Guide: Mock Data → Firebase

This guide explains how to migrate components from using mock/static data to Firebase real-time data in the Medicine Reminder App.

---

## Overview

**Current State:** Components use hardcoded mock data  
**Target State:** Components use Firebase with real-time updates  
**Approach:** Gradual, component-by-component migration

---

## Migration Checklist

### Phase 1: Preparation ✅ COMPLETE
- [x] Firebase infrastructure created
- [x] TypeScript interfaces defined
- [x] Custom React hooks implemented
- [x] Database functions written
- [x] Documentation complete

### Phase 2: Component Migration 🚧 IN PROGRESS
- [ ] Update authentication pages (Login, SignUp)
- [ ] Migrate HomePage
- [ ] Migrate MedicineListPage
- [ ] Migrate SchedulePage
- [ ] Migrate GuardiansPage
- [ ] Migrate GuardianViewPage
- [ ] Migrate SettingsPage
- [ ] Update all other components

### Phase 3: Cleanup ⏳ PENDING
- [ ] Remove all mock data
- [ ] Test all features end-to-end
- [ ] Update documentation
- [ ] Deploy to production

---

## Migration Pattern

### Step-by-Step Process

#### 1. Identify Mock Data

Look for hardcoded arrays or objects:

```typescript
// ❌ Current state - Mock data
const mockMedicines = [
  {
    id: '1',
    name: 'Aspirin',
    dosage: '100mg',
    // ...
  },
  // more mock data
];

function MedicineListPage() {
  const medicines = mockMedicines; // Using mock
  
  return <div>{/* render medicines */}</div>;
}
```

#### 2. Add Firebase Hook

Import and use the appropriate hook:

```typescript
// ✅ Migration step 1 - Add Firebase hook
import { useAuth } from '../lib/hooks';
import { useMedicines } from '../lib/hooks';

function MedicineListPage() {
  const { user } = useAuth();
  const { medicines, loading, error } = useMedicines(user?.uid, true);
  
  // Keep mock data temporarily as fallback
  const mockMedicines = [/* ... */];
  const displayMedicines = medicines.length > 0 ? medicines : mockMedicines;
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* render displayMedicines */}</div>;
}
```

#### 3. Add Loading States

Handle loading and error states:

```typescript
function MedicineListPage() {
  const { user, loading: authLoading } = useAuth();
  const { medicines, loading: dataLoading, error } = useMedicines(user?.uid, true);
  
  // Combined loading state
  if (authLoading || dataLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin">Loading...</div>
    </div>;
  }
  
  // Error state
  if (error) {
    return <div className="p-4 bg-red-50 text-red-600">
      Error loading medicines: {error}
    </div>;
  }
  
  // Empty state
  if (medicines.length === 0) {
    return <div className="text-center p-8">
      <p>No medicines yet</p>
      <button>Add Medicine</button>
    </div>;
  }
  
  // Data loaded successfully
  return <div>{/* render medicines */}</div>;
}
```

#### 4. Test with Real Data

- Create test Firebase account
- Add test medicines via UI
- Verify real-time updates work
- Test all CRUD operations

#### 5. Remove Mock Data (After Approval)

```typescript
// ✅ Final state - Only Firebase
import { useAuth } from '../lib/hooks';
import { useMedicines } from '../lib/hooks';

function MedicineListPage() {
  const { user } = useAuth();
  const { medicines, loading, error } = useMedicines(user?.uid, true);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (medicines.length === 0) return <EmptyState />;
  
  return <MedicineList medicines={medicines} />;
}
```

---

## Component-Specific Migration

### HomePage Migration

**Current:** Uses mock medicine data  
**Target:** Use `useMedicines` hook with real-time updates

#### Before

```typescript
function HomePage() {
  const mockMedicines = [
    { id: '1', name: 'Aspirin', times: ['08:00', '20:00'], status: 'active' },
    // ...
  ];
  
  const upcomingDoses = mockMedicines
    .filter(m => m.status === 'active')
    .slice(0, 3);
  
  return (
    <div>
      <h1>Today's Medicines</h1>
      {upcomingDoses.map(med => (
        <MedicineCard key={med.id} medicine={med} />
      ))}
    </div>
  );
}
```

#### After

```typescript
import { useAuth } from '../lib/hooks';
import { useMedicines } from '../lib/hooks';

function HomePage() {
  const { user } = useAuth();
  const { medicines, loading } = useMedicines(user?.uid, true);
  
  const upcomingDoses = medicines
    .filter(m => m.status === 'active')
    .slice(0, 3);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      <h1>Today's Medicines</h1>
      {upcomingDoses.length > 0 ? (
        upcomingDoses.map(med => (
          <MedicineCard key={med.id} medicine={med} />
        ))
      ) : (
        <EmptyState message="No upcoming doses" />
      )}
    </div>
  );
}
```

### MedicineListPage Migration

**Current:** Mock medicine list  
**Target:** Real-time medicine list with CRUD operations

#### Before

```typescript
function MedicineListPage() {
  const mockMedicines = [/* ... */];
  const [medicines, setMedicines] = useState(mockMedicines);
  
  const handleDelete = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };
  
  return <div>{/* render */}</div>;
}
```

#### After

```typescript
import { useAuth } from '../lib/hooks';
import { useMedicines } from '../lib/hooks';

function MedicineListPage() {
  const { user } = useAuth();
  const { 
    medicines, 
    loading, 
    deleteMedicine 
  } = useMedicines(user?.uid, true);
  
  const handleDelete = async (id: string) => {
    try {
      await deleteMedicine(id);
      toast.success('Medicine deleted');
    } catch (error: any) {
      toast.error('Failed to delete: ' + error.message);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {medicines.map(medicine => (
        <MedicineCard 
          key={medicine.id} 
          medicine={medicine}
          onDelete={() => handleDelete(medicine.id)}
        />
      ))}
    </div>
  );
}
```

### GuardiansPage Migration

**Current:** Mock guardian data  
**Target:** Real-time guardian list with permission management

#### Before

```typescript
function GuardiansPage() {
  const mockGuardians = [
    { id: '1', guardianName: '이영희', status: 'active' },
    // ...
  ];
  
  return <div>{/* render guardians */}</div>;
}
```

#### After

```typescript
import { useAuth } from '../lib/hooks';
import { useGuardians } from '../lib/hooks';

function GuardiansPage() {
  const { user } = useAuth();
  const { 
    guardians, 
    loading, 
    updateGuardian,
    deleteGuardian 
  } = useGuardians(user?.uid, true);
  
  const handleTogglePermission = async (guardianId: string) => {
    const guardian = guardians.find(g => g.id === guardianId);
    if (!guardian) return;
    
    await updateGuardian(guardianId, {
      permissions: {
        ...guardian.permissions,
        viewMedications: !guardian.permissions.viewMedications
      }
    });
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {guardians.map(guardian => (
        <GuardianCard
          key={guardian.id}
          guardian={guardian}
          onTogglePermission={() => handleTogglePermission(guardian.id)}
          onRemove={() => deleteGuardian(guardian.id)}
        />
      ))}
    </div>
  );
}
```

### GuardianViewPage Migration

**Current:** Mock care recipient data  
**Target:** Real-time care recipient management

#### Before

```typescript
function GuardianViewPage() {
  const mockRecipients = [
    { id: '1', name: '김철수', medicationCount: 3 },
    // ...
  ];
  
  return <div>{/* render recipients */}</div>;
}
```

#### After

```typescript
import { useAuth } from '../lib/hooks';
import { useCareRecipients } from '../lib/hooks';

function GuardianViewPage() {
  const { user } = useAuth();
  const {
    recipients,
    loading,
    getRecipientMedicines
  } = useCareRecipients(user?.uid, true);
  
  const handleViewRecipient = async (recipientUserId: string) => {
    try {
      const medicines = await getRecipientMedicines(recipientUserId);
      console.log('Medicines:', medicines);
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {recipients.map(recipient => (
        <RecipientCard
          key={recipient.id}
          recipient={recipient}
          onClick={() => handleViewRecipient(recipient.userId)}
        />
      ))}
    </div>
  );
}
```

### AddMedicinePage Migration

**Current:** Form that doesn't save to database  
**Target:** Form with Firebase save

#### Before

```typescript
function AddMedicinePage() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Would save:', { name, dosage });
    // Navigate back
  };
  
  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

#### After

```typescript
import { useAuth } from '../lib/hooks';
import { useMedicines } from '../lib/hooks';
import { useNavigate } from 'react-router-dom';

function AddMedicinePage() {
  const { user } = useAuth();
  const { addMedicine } = useMedicines(user?.uid);
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addMedicine({
        userId: user!.uid,
        name,
        dosage,
        type: 'tablet',
        frequency: 'daily',
        times: ['08:00'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        // ... all required fields
      });
      
      toast.success('Medicine added!');
      navigate('/medicines');
    } catch (error: any) {
      toast.error('Failed to add: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Medicine'}
      </button>
    </form>
  );
}
```

---

## Common Migration Patterns

### Pattern 1: Authentication Check

**Always check authentication before using data hooks:**

```typescript
function ProtectedComponent() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  // Wait for auth check
  if (authLoading) return <LoadingSpinner />;
  
  // Redirect if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  // Now safe to use user.uid
  const { medicines } = useMedicines(user!.uid, true);
  
  return <div>{/* component */}</div>;
}
```

### Pattern 2: Optimistic Updates

**Update UI immediately, sync with Firebase:**

```typescript
function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { updateMedicine } = useMedicines(medicine.userId);
  const [status, setStatus] = useState(medicine.status);
  
  const handleToggleStatus = async () => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    
    // Optimistic update
    setStatus(newStatus);
    
    try {
      await updateMedicine(medicine.id, { status: newStatus });
    } catch (error) {
      // Revert on error
      setStatus(status);
      toast.error('Update failed');
    }
  };
  
  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={handleToggleStatus}>Toggle</button>
    </div>
  );
}
```

### Pattern 3: Loading Skeletons

**Show skeleton while loading:**

```typescript
function MedicineList() {
  const { medicines, loading } = useMedicines(userId, true);
  
  if (loading) {
    return (
      <div>
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded mb-2"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return <div>{/* render medicines */}</div>;
}
```

### Pattern 4: Error Boundaries

**Catch errors gracefully:**

```typescript
function MedicineListPage() {
  const { medicines, error } = useMedicines(userId, true);
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="font-semibold text-red-800">Error Loading Medicines</h3>
        <p className="text-red-600">{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  return <div>{/* render */}</div>;
}
```

---

## Testing Strategy

### 1. Create Test Accounts

```typescript
// Test accounts for different scenarios
const testAccounts = {
  patient: {
    email: 'patient.test@example.com',
    password: 'test123456',
    name: 'Test Patient'
  },
  guardian: {
    email: 'guardian.test@example.com',
    password: 'test123456',
    name: 'Test Guardian'
  }
};
```

### 2. Test Checklist per Component

For each migrated component:

- [ ] Loading state shows correctly
- [ ] Error state displays properly
- [ ] Empty state appears when no data
- [ ] Data displays correctly when loaded
- [ ] Real-time updates work
- [ ] CRUD operations succeed
- [ ] Navigation works correctly
- [ ] Korean and English text displays
- [ ] Mobile responsive

### 3. Integration Testing

Test full user flows:

1. **Sign Up → Add Medicine → View List**
   - New user signs up
   - Adds first medicine
   - Sees it in list immediately

2. **Invite Guardian → Accept → View Patient Data**
   - Patient sends invitation
   - Guardian accepts
   - Guardian sees patient's medicines

3. **Update Medicine → See Changes Everywhere**
   - Edit medicine on one device
   - Changes appear on another device in real-time

---

## Debugging Common Issues

### Issue 1: "medicines is empty but data exists in Firebase"

**Cause:** Using wrong user ID

```typescript
// ❌ Wrong
const { medicines } = useMedicines('hardcoded-id', true);

// ✅ Correct
const { user } = useAuth();
const { medicines } = useMedicines(user?.uid, true);
```

### Issue 2: "Component shows loading forever"

**Cause:** User ID is undefined

```typescript
// Add safety check
const { user } = useAuth();

if (!user) {
  return <div>Please log in</div>;
}

const { medicines, loading } = useMedicines(user.uid, true);
```

### Issue 3: "Changes don't show up in real-time"

**Cause:** Realtime flag is false

```typescript
// ❌ One-time fetch
const { medicines } = useMedicines(userId, false);

// ✅ Real-time updates
const { medicines } = useMedicines(userId, true);
```

### Issue 4: "Permission denied error"

**Cause:** Firebase rules or missing userId

```typescript
// Check Firebase rules in Firebase Console
// Ensure userId field is correctly set
await addMedicine({
  userId: user!.uid, // Must match authenticated user
  // ...
});
```

---

## Rollback Strategy

If migration causes issues:

### Step 1: Revert to Mock Data

```typescript
function MedicineListPage() {
  const { user } = useAuth();
  const { medicines: fbMedicines, loading } = useMedicines(user?.uid, true);
  
  // Fallback to mock if Firebase fails
  const mockMedicines = [/* ... */];
  const medicines = loading || fbMedicines.length === 0 
    ? mockMedicines 
    : fbMedicines;
  
  return <div>{/* render */}</div>;
}
```

### Step 2: Add Feature Flag

```typescript
const USE_FIREBASE = false; // Feature flag

function MedicineListPage() {
  if (USE_FIREBASE) {
    // Firebase implementation
  } else {
    // Mock data implementation
  }
}
```

---

## Migration Timeline

### Week 1: Core Pages
- [ ] LoginPage, SignUpPage (Authentication)
- [ ] HomePage (Dashboard)
- [ ] MedicineListPage (Medicine list)

### Week 2: Secondary Pages
- [ ] AddMedicinePage, EditMedicinePage
- [ ] SchedulePage
- [ ] MedicineDetailPage

### Week 3: Guardian Features
- [ ] GuardiansPage
- [ ] GuardianViewPage
- [ ] Invitation flow

### Week 4: Settings & Polish
- [ ] SettingsPage
- [ ] ProfilePage
- [ ] Remove all mock data
- [ ] Final testing

---

## Success Criteria

Migration is complete when:

✅ All components use Firebase hooks  
✅ No mock data remains in components  
✅ Real-time updates work across all pages  
✅ All CRUD operations function correctly  
✅ Loading and error states are handled  
✅ Guardian features work with permissions  
✅ App works offline (with cached data)  
✅ All tests pass  

---

## Additional Resources

- `/lib/README.md` - Firebase documentation
- `/lib/HOOKS-REFERENCE.md` - Hook usage guide
- `/lib/AUTHENTICATION-GUIDE.md` - Auth migration
- `/lib/CARE-RECIPIENT-GUIDE.md` - Guardian features
- `/lib/DATA-MODELS.md` - Data structures

---

**Remember:** Migrate gradually, test thoroughly, and keep mock data as fallback until migration is confirmed working!
