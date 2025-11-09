# Medicine Permission Requests - Quick Reference Card

## ✅ STATUS: PRODUCTION READY

---

## 📦 Import Paths

```typescript
// Types
import { MedicinePermissionRequest, COLLECTIONS } from '../lib/types';

// Hooks
import { 
  useMedicinePermissionRequests,
  useCreateMedicinePermissionRequest,
  useMedicinePermissionRequest 
} from '../lib/hooks';

// Database Functions
import {
  createMedicinePermissionRequest,
  getMedicinePermissionRequests,
  approveMedicinePermissionRequest,
  denyMedicinePermissionRequest
} from '../lib/firebase/db';
```

---

## 🎣 Hook Usage

### For Care Recipients (View Requests)
```typescript
const { 
  requests,              // MedicinePermissionRequest[]
  loading,               // boolean
  error,                 // Error | null
  approveRequest,        // (id: string) => Promise<string>
  denyRequest,           // (id: string, reason?: string) => Promise<void>
  pendingCount,          // number
  refetch                // () => void
} = useMedicinePermissionRequests(userId, 'pending');
```

### For Guardians (Create Request)
```typescript
const { 
  createRequest,         // (request) => Promise<string>
  loading,               // boolean
  error                  // Error | null
} = useCreateMedicinePermissionRequest();

await createRequest({
  guardianId,
  guardianName,
  guardianEmail,
  careRecipientId,
  careRecipientName,
  careRecipientEmail,
  medicineName,
  dosage,
  medicineType,
  // ... other fields
});
```

### For Single Request
```typescript
const { 
  request,               // MedicinePermissionRequest | null
  loading,               // boolean
  error                  // Error | null
} = useMedicinePermissionRequest(requestId);
```

---

## 💾 Database Functions

### Create
```typescript
const id = await createMedicinePermissionRequest({
  // All fields except id, status, requestedAt, createdAt, updatedAt
});
```

### Read
```typescript
// Get all for recipient
const requests = await getMedicinePermissionRequests(userId, 'pending');

// Get single
const request = await getMedicinePermissionRequest(requestId);

// Get guardian's sent requests
const sent = await getGuardianSentRequests(guardianId, 'pending');
```

### Update
```typescript
// Approve (creates medicine automatically)
const medicineId = await approveMedicinePermissionRequest(requestId);

// Deny
await denyMedicinePermissionRequest(requestId, 'Optional reason');
```

### Delete
```typescript
await deleteMedicinePermissionRequest(requestId);
```

### Real-time Listener
```typescript
const unsubscribe = listenToMedicinePermissionRequests(
  userId,
  (requests) => {
    console.log('Updated requests:', requests);
  },
  'pending'  // optional status filter
);

// Cleanup
unsubscribe();
```

---

## 📋 Type Definition

```typescript
interface MedicinePermissionRequest {
  id: string;
  
  // Guardian (4 fields)
  guardianId: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhotoURL?: string;
  
  // Recipient (3 fields)
  careRecipientId: string;
  careRecipientName: string;
  careRecipientEmail: string;
  
  // Medicine (13 fields)
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
  
  // Metadata (5 fields)
  status: 'pending' | 'approved' | 'denied';
  requestedAt: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🗄️ Firestore Path

```
Collection: medicinePermissionRequests
Document ID: Auto-generated
```

---

## 🔐 Security Rules

```javascript
match /medicinePermissionRequests/{requestId} {
  allow read: if request.auth != null && 
    (resource.data.careRecipientId == request.auth.uid ||
     resource.data.guardianId == request.auth.uid);
  
  allow create: if request.auth != null && 
    request.resource.data.guardianId == request.auth.uid;
  
  allow update: if request.auth != null && 
    resource.data.careRecipientId == request.auth.uid;
  
  allow delete: if request.auth != null;
}
```

---

## 📇 Required Indexes

1. `careRecipientId` (Asc) + `requestedAt` (Desc)
2. `careRecipientId` (Asc) + `status` (Asc) + `requestedAt` (Desc)
3. `guardianId` (Asc) + `requestedAt` (Desc)
4. `guardianId` (Asc) + `status` (Asc) + `requestedAt` (Desc)

---

## 🎨 Component Integration Examples

### Show Badge Count
```typescript
const { pendingCount } = useMedicinePermissionRequests(userId, 'pending');
<MedicinePermissionBadge count={pendingCount} />
```

### List Requests
```typescript
const { requests, loading } = useMedicinePermissionRequests(userId, 'pending');

if (loading) return <Spinner />;

return requests.map(request => (
  <RequestCard key={request.id} request={request} />
));
```

### Approve/Deny
```typescript
const { approveRequest, denyRequest } = useMedicinePermissionRequests(userId);

<button onClick={() => approveRequest(request.id)}>
  Approve
</button>
<button onClick={() => denyRequest(request.id)}>
  Deny
</button>
```

---

## ⚡ Quick Tips

### 1. Always Check Loading State
```typescript
if (loading) return <Spinner />;
```

### 2. Handle Errors
```typescript
if (error) {
  toast.error(error.message);
}
```

### 3. Use Pending Count for Badges
```typescript
const { pendingCount } = useMedicinePermissionRequests(userId, 'pending');
{pendingCount > 0 && <Badge>{pendingCount}</Badge>}
```

### 4. Cleanup Listeners
```typescript
useEffect(() => {
  const unsubscribe = listenToMedicinePermissionRequests(...);
  return () => unsubscribe();
}, [userId]);
```

### 5. Toast Notifications
```typescript
await approveRequest(id);
toast.success('Medicine added successfully!');
```

---

## 🐛 Common Issues

### Issue: "Permission denied"
**Solution:** Check Firestore security rules are deployed

### Issue: "Index not found"
**Solution:** Click the error link to create the index automatically

### Issue: "Hook returns empty array"
**Solution:** Verify userId is not null and user has permission requests

### Issue: "Real-time updates not working"
**Solution:** Check that listener cleanup is in useEffect return

---

## 📚 Documentation Links

- Full Guide: `/lib/MEDICINE-PERMISSION-REQUESTS-GUIDE.md`
- Integration Summary: `/lib/MEDICINE-PERMISSION-INTEGRATION-SUMMARY.md`
- Type Confirmation: `/lib/types/PERMISSION-TYPES-CONFIRMATION.md`
- Production Ready: `/PERMISSION-SYSTEM-PRODUCTION-READY.md`

---

## ✅ Checklist for Integration

- [ ] Import hooks from `/lib/hooks`
- [ ] Replace mock data with `useMedicinePermissionRequests`
- [ ] Add loading states to UI
- [ ] Add error handling
- [ ] Deploy Firestore security rules
- [ ] Create Firestore indexes
- [ ] Test approve flow
- [ ] Test deny flow
- [ ] Test real-time updates
- [ ] Test badge count

---

**Last Updated:** 2025-01-09  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
