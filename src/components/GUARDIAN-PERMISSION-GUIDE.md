# Guardian Medicine Permission System

## Overview
This system allows guardians to request permission before adding new medicines on behalf of care recipients. The care recipient must approve or deny each request.

## Components Created

### 1. MedicinePermissionRequestDialog.tsx
A beautiful dialog that shows the complete medicine details when a care recipient reviews a permission request.

**Features:**
- Guardian information display
- Complete medicine details preview
- Medicine photo (if uploaded)
- Dosage, schedule, and duration information
- Approve/Deny action buttons
- Bilingual support (Korean/English)

### 2. MedicinePermissionRequestsPage.tsx
A dedicated page listing all pending permission requests from guardians.

**Features:**
- Header with back navigation
- List of pending requests with quick actions
- Empty state when no requests
- Relative time stamps (e.g., "2h ago")
- Click-through to detailed dialog
- Quick approve/deny buttons on each card

### 3. MedicinePermissionBadge.tsx
A reusable notification badge component showing the count of pending requests.

**Features:**
- Red notification badge
- Shows count (9+ for counts over 9)
- Auto-hides when count is 0
- Customizable positioning

## Integration Points

### GuardiansPage
Added a prominent "Approval Requests" button at the top of the guardians page with:
- Bell icon in blue circle
- Badge showing pending request count
- Navigation to permission requests page

### App.tsx
- Added 'permission-requests' to the Page type
- Integrated MedicinePermissionRequestsPage with routing
- Added handlers for approve/deny actions
- Full-screen page (no bottom navigation)

## Data Flow (Production Implementation)

### When Guardian Adds Medicine:
1. Guardian fills out AddMedicineWizard
2. Instead of directly saving to medicines collection, create a permission request in Firestore
3. Send push notification to care recipient
4. Show badge on GuardiansPage

### Permission Request Structure:
```typescript
interface MedicinePermissionRequest {
  id: string;
  guardianId: string;
  guardianName: string;
  guardianPhotoURL?: string;
  medicineName: string;
  dosage: string;
  medicineType: string;
  frequency: string;
  times: string[];
  startDate: string;
  duration: number;
  instructions?: string;
  photoURL?: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'denied';
}
```

### When Care Recipient Approves:
1. Create medicine record in medicines collection
2. Update request status to 'approved'
3. Send notification to guardian
4. Remove from pending requests list

### When Care Recipient Denies:
1. Update request status to 'denied'
2. Send notification to guardian
3. Remove from pending requests list
4. Optionally keep in history for 7 days

## Firebase Collections Needed

### medicine_permission_requests
```
medicine_permission_requests/
  {requestId}/
    - guardianId: string
    - careRecipientId: string
    - medicineData: object (all medicine fields)
    - status: 'pending' | 'approved' | 'denied'
    - requestedAt: timestamp
    - respondedAt?: timestamp
    - createdAt: timestamp
```

## Real-time Updates

Use Firestore real-time listeners to:
- Show new requests immediately
- Update badge count in real-time
- Auto-remove approved/denied requests from list

## Notifications

### Push Notifications:
1. **To Care Recipient:** When guardian requests to add medicine
2. **To Guardian:** When request is approved/denied

### In-App Notifications:
- Badge on Guardians nav icon (if requests pending)
- Badge on Approval Requests button

## User Experience

### Care Recipient Flow:
1. See notification badge on Guardians page
2. Tap "Approval Requests" button
3. See list of pending requests
4. Tap to view detailed dialog
5. Review complete medicine information
6. Approve or Deny with one tap
7. See confirmation toast

### Guardian Flow:
1. Complete AddMedicineWizard
2. Submit creates permission request
3. See toast: "Permission request sent to [name]"
4. Receive notification when approved/denied
5. If approved: Medicine appears in care recipient's list
6. If denied: Receive explanation (optional feature)

## Design Features

- Clean white background
- Blue accent color (#3674B5) for primary actions
- Green approval button (#4CAF50)
- Red notification badges (#FF4444)
- Smooth transitions and hover states
- Responsive layout
- Accessibility-friendly
- Consistent with app design system

## Future Enhancements

1. **Reason for Denial:** Allow care recipient to provide reason
2. **Request History:** View past approved/denied requests
3. **Bulk Actions:** Approve/deny multiple requests at once
4. **Request Expiration:** Auto-deny after 7 days
5. **Draft Requests:** Guardian can save draft before submitting
6. **Photo Upload:** Guardian can include medicine photo in request
7. **Edit Requests:** Care recipient can suggest edits instead of denying
8. **Scheduling Conflicts:** Warn if new medicine conflicts with existing schedule
