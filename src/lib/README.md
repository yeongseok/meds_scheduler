# Firebase Integration for Medicine Reminder App

This folder contains all Firebase authentication and database integration code for the medicine reminder application.

## 📁 Folder Structure

```
/lib
├── firebase/
│   ├── config.ts           # Firebase configuration
│   ├── auth.ts             # Authentication functions
│   ├── db.ts               # Firestore database functions
│   └── index.ts            # Main export file
├── hooks/
│   ├── useAuth.ts          # Authentication hook
│   ├── useMedicines.ts     # Medicine management hook
│   ├── useGuardians.ts     # Guardian management hook
│   └── index.ts            # Hooks export file
├── types/
│   └── index.ts            # TypeScript interfaces
└── README.md               # This file
```

## 🚀 Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - **Email/Password** (required)
   - **Google** (optional, recommended)

### 3. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode** or **Test mode**
4. Select your region

### 4. Set Up Security Rules

Copy these security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Medicines
    match /medicines/{medicineId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Dose Records
    match /doseRecords/{recordId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Guardians - allow guardians to read
    match /guardians/{guardianId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.uid == resource.data.guardianId);
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Invitations
    match /invitations/{invitationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.fromUserId;
    }
    
    // Settings
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** → **Web** (</> icon)
4. Register your app
5. Copy the configuration object

### 6. Update Configuration File

Open `/lib/firebase/config.ts` and replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 📖 Usage Examples

### Authentication

```typescript
import { 
  signUpWithEmail, 
  signInWithEmail, 
  logOut,
  resetPassword 
} from './lib/firebase';

// Sign up
await signUpWithEmail('user@example.com', 'password123', 'John Doe');

// Sign in
await signInWithEmail('user@example.com', 'password123');

// Sign out
await logOut();

// Reset password
await resetPassword('user@example.com');
```

### Using Authentication Hook

```typescript
import { useAuth } from './lib/hooks';

function MyComponent() {
  const { user, userProfile, loading, isAuthenticated } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <div>Welcome, {userProfile?.displayName}</div>;
}
```

### Medicine Management

```typescript
import { addMedicine, getUserMedicines, updateMedicine } from './lib/firebase';

// Add a medicine
const medicineId = await addMedicine({
  userId: 'user-id',
  name: '혈압약',
  dosage: '10mg',
  type: 'tablet',
  frequency: '1일 2회',
  times: ['08:00', '20:00'],
  // ... other fields
});

// Get user's medicines
const medicines = await getUserMedicines('user-id');

// Update medicine
await updateMedicine(medicineId, {
  dosage: '20mg'
});
```

### Using Medicines Hook

```typescript
import { useMedicines } from './lib/hooks';

function MedicinesList() {
  const { medicines, loading, addMedicine } = useMedicines(userId, true);
  
  const handleAdd = async () => {
    await addMedicine({
      userId,
      name: 'Aspirin',
      // ... other fields
    });
  };
  
  return (
    <div>
      {medicines.map(med => (
        <div key={med.id}>{med.name}</div>
      ))}
    </div>
  );
}
```

### Dose Record Management

```typescript
import { addDoseRecord, markDoseAsTaken, getDoseRecords } from './lib/firebase';

// Add dose record
await addDoseRecord({
  medicineId: 'medicine-id',
  userId: 'user-id',
  scheduledDate: new Date(),
  scheduledTime: '08:00',
  status: 'pending'
});

// Mark as taken
await markDoseAsTaken('record-id', 'Took with breakfast');

// Get records
const records = await getDoseRecords('medicine-id');
```

### Guardian Management

```typescript
import { useGuardians } from './lib/hooks';
import { sendInvitation } from './lib/firebase';

function GuardiansPage() {
  const { guardians, loading } = useGuardians(userId, true);
  
  const handleInvite = async () => {
    await sendInvitation({
      fromUserId: userId,
      fromUserName: 'John Doe',
      fromUserEmail: 'john@example.com',
      toEmail: 'guardian@example.com',
      relationship: 'Family',
      status: 'pending'
    });
  };
  
  return <div>...</div>;
}
```

## 🔒 Security Best Practices

1. **Never commit your Firebase config to public repositories**
   - Use environment variables in production
   - Add `.env` to `.gitignore`

2. **Enable App Check** (recommended for production)
   - Protects your backend from abuse

3. **Use Security Rules**
   - Always implement proper Firestore security rules
   - Test your rules before deploying

4. **Enable Email Verification**
   - Require email verification for new users
   - Already implemented in the auth service

## 📊 Data Models

All TypeScript interfaces are defined in `/lib/types/index.ts`:

- `User` - User profile
- `Medicine` - Medicine information
- `DoseRecord` - Individual dose records
- `Guardian` - Guardian relationships
- `Invitation` - Guardian invitations
- `Reminder` - Medication reminders
- `UserSettings` - User preferences

## 🔄 Real-time Updates

For real-time updates, use the hooks with `realtime: true`:

```typescript
const { medicines } = useMedicines(userId, true);
const { guardians } = useGuardians(userId, true);
```

## 📱 Integration with React Native (Future)

This Firebase setup is compatible with React Native. Simply:
1. Install `@react-native-firebase` packages
2. Follow platform-specific setup
3. Update the config file accordingly

## 🛠️ Troubleshooting

**Authentication errors:**
- Check if Email/Password is enabled in Firebase Console
- Verify your Firebase config is correct

**Firestore permission errors:**
- Review your security rules
- Make sure user is authenticated
- Check that userId matches the authenticated user

**Import errors:**
- Make sure all Firebase packages are installed
- Check your import paths

## 📦 Required NPM Packages

```bash
npm install firebase
```

Or with yarn:
```bash
yarn add firebase
```

## 🤝 Contributing

When adding new features:
1. Add TypeScript interfaces to `/lib/types/index.ts`
2. Add database functions to `/lib/firebase/db.ts`
3. Create custom hooks in `/lib/hooks/` if needed
4. Update this README with examples

## 📄 License

This Firebase integration is part of the Medicine Reminder App project.
