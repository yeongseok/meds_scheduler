# Authentication Guide - Firebase Auth Integration

## Overview

This guide covers all authentication functions in `/lib/firebase/auth.ts` and the `useAuth` hook for managing user authentication state in the Medicine Reminder App.

## Authentication Functions

### 1. Email/Password Sign Up

Create a new user account with email and password:

```typescript
import { signUpWithEmail } from './lib/firebase';

async function handleSignUp(email: string, password: string, displayName: string) {
  try {
    const user = await signUpWithEmail(email, password, displayName);
    console.log('User created:', user);
    // Automatically logs in the user
    // User profile is created in Firestore
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      alert('Email already registered');
    } else if (error.code === 'auth/weak-password') {
      alert('Password should be at least 6 characters');
    } else {
      alert(error.message);
    }
  }
}
```

**What it does:**
1. Creates Firebase Auth account
2. Updates display name
3. Creates user profile in Firestore `/users/{uid}`
4. Returns User object

**Error Codes:**
- `auth/email-already-in-use` - Email is already registered
- `auth/invalid-email` - Email format is invalid
- `auth/weak-password` - Password is too weak (< 6 characters)

### 2. Email/Password Sign In

Log in existing user:

```typescript
import { signInWithEmail } from './lib/firebase';

async function handleSignIn(email: string, password: string) {
  try {
    const user = await signInWithEmail(email, password);
    console.log('Logged in:', user);
    // User is now authenticated
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      alert('No account found with this email');
    } else if (error.code === 'auth/wrong-password') {
      alert('Incorrect password');
    } else {
      alert(error.message);
    }
  }
}
```

**Error Codes:**
- `auth/user-not-found` - No account with this email
- `auth/wrong-password` - Incorrect password
- `auth/invalid-email` - Email format is invalid
- `auth/user-disabled` - Account has been disabled

### 3. Google Sign In

Sign in with Google account (future implementation):

```typescript
import { signInWithGoogle } from './lib/firebase';

async function handleGoogleSignIn() {
  try {
    const user = await signInWithGoogle();
    console.log('Logged in with Google:', user);
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      // User closed the popup
    } else if (error.code === 'auth/cancelled-popup-request') {
      // Multiple popups opened
    } else {
      alert(error.message);
    }
  }
}
```

**Note:** Google Sign In requires additional Firebase configuration (OAuth client setup).

### 4. Password Reset

Send password reset email:

```typescript
import { resetPassword } from './lib/firebase';

async function handleForgotPassword(email: string) {
  try {
    await resetPassword(email);
    alert('Password reset email sent! Check your inbox.');
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      alert('No account found with this email');
    } else {
      alert(error.message);
    }
  }
}
```

**What it does:**
- Sends password reset email to the user
- User clicks link in email to reset password
- No need to handle the reset in the app

### 5. Log Out

Sign out current user:

```typescript
import { logOut } from './lib/firebase';

async function handleLogOut() {
  try {
    await logOut();
    // User is logged out
    // Redirect to login page
  } catch (error: any) {
    console.error('Logout failed:', error.message);
  }
}
```

### 6. Send Verification Email

Send email verification to user:

```typescript
import { sendVerificationEmail } from './lib/firebase';

async function handleSendVerification() {
  try {
    await sendVerificationEmail();
    alert('Verification email sent! Please check your inbox.');
  } catch (error: any) {
    alert(error.message);
  }
}
```

**When to use:**
- After user signs up
- When user needs to verify their email
- To enable email-verified-only features

### 7. Update User Profile

Update display name or photo URL:

```typescript
import { updateUserProfile } from './lib/firebase';

async function handleUpdateProfile(displayName: string, photoURL?: string) {
  try {
    await updateUserProfile({ displayName, photoURL });
    console.log('Profile updated');
  } catch (error: any) {
    alert(error.message);
  }
}
```

**Updates:**
- Display name
- Photo URL
- Both Firebase Auth and Firestore profile

### 8. Get Current User

Get currently authenticated user:

```typescript
import { getCurrentUser } from './lib/firebase';

const user = getCurrentUser();
if (user) {
  console.log('User is logged in:', user.email);
} else {
  console.log('No user logged in');
}
```

**Returns:**
- `User | null` - Current user or null if not authenticated

### 9. Check Authentication Status

Check if user is authenticated:

```typescript
import { isAuthenticated } from './lib/firebase';

if (isAuthenticated()) {
  // User is logged in
} else {
  // Redirect to login
}
```

### 10. Auth State Change Listener

Listen to authentication state changes:

```typescript
import { onAuthStateChange } from './lib/firebase';

const unsubscribe = onAuthStateChange((user) => {
  if (user) {
    console.log('User logged in:', user.email);
    // Update UI for logged-in state
  } else {
    console.log('User logged out');
    // Update UI for logged-out state
  }
});

// Cleanup when component unmounts
return () => unsubscribe();
```

**Use cases:**
- Persist login state across page refreshes
- Redirect based on auth state
- Sync UI with authentication status

### 11. Re-authenticate User

Re-authenticate user before sensitive operations (required for profile changes, password changes, account deletion):

```typescript
import { reauthenticateUser } from './lib/firebase';

async function handleSensitiveOperation() {
  try {
    // Re-authenticate user with their password
    await reauthenticateUser(userEmail, password);
    console.log('User re-authenticated successfully');
    
    // Now perform sensitive operation
    await updateUserProfile({ email: newEmail });
    
  } catch (error: any) {
    if (error.code === 'auth/wrong-password') {
      alert('Incorrect password');
    } else if (error.code === 'auth/invalid-credential') {
      alert('Invalid credentials');
    } else if (error.code === 'auth/too-many-requests') {
      alert('Too many attempts. Please try again later.');
    } else {
      alert('Authentication failed: ' + error.message);
    }
  }
}
```

**When to use:**
- Before changing user email
- Before changing user password
- Before deleting user account
- Before updating profile information (recommended)
- Any operation requiring recent authentication

**Security Benefits:**
- Prevents unauthorized changes from stolen session tokens
- Ensures user is present and actively making changes
- Required by Firebase for sensitive operations

**Error Codes:**
- `auth/wrong-password` - Password is incorrect
- `auth/invalid-credential` - Credentials are invalid
- `auth/too-many-requests` - Too many failed attempts
- `auth/user-mismatch` - Credential doesn't match current user
- `auth/network-request-failed` - Network error

**Example Use Case - Profile Update with Auth Dialog:**

```typescript
import { useState } from 'react';
import { reauthenticateUser, updateUserProfile } from '../lib/firebase';
import { useAuth } from '../lib/hooks';

function ProfilePage() {
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  
  const handleSaveClick = () => {
    // Show authentication dialog before saving
    setShowAuthDialog(true);
  };
  
  const handleAuthenticated = async () => {
    try {
      // Re-authenticate user
      await reauthenticateUser(user!.email!, password);
      
      // If successful, save profile changes
      await updateUserProfile({ displayName: newDisplayName });
      
      toast.success('Profile updated successfully!');
      setShowAuthDialog(false);
    } catch (error: any) {
      // Handle errors
      if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else {
        toast.error('Authentication failed');
      }
    }
  };
  
  return (
    <div>
      <input 
        value={newDisplayName} 
        onChange={(e) => setNewDisplayName(e.target.value)} 
      />
      <button onClick={handleSaveClick}>Save Changes</button>
      
      {/* Auth Dialog */}
      {showAuthDialog && (
        <div>
          <h3>Verify Your Identity</h3>
          <p>Please enter your password to save changes</p>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleAuthenticated}>Authenticate</button>
        </div>
      )}
    </div>
  );
}
```

## useAuth Hook

The `useAuth` hook provides authentication state management in React components:

### Basic Usage

```typescript
import { useAuth } from './lib/hooks';

function MyComponent() {
  const { user, userProfile, loading, isAuthenticated } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {userProfile?.displayName || user?.email}</h1>
      <p>Language: {userProfile?.language}</p>
      <p>Pro User: {userProfile?.isPro ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Return Values

```typescript
interface UseAuthReturn {
  user: FirebaseUser | null;           // Firebase Auth user
  userProfile: User | null;            // Firestore user profile
  loading: boolean;                    // Loading state
  isAuthenticated: boolean;            // Is user logged in?
}
```

### User vs UserProfile

**`user` (Firebase Auth User):**
- From Firebase Authentication
- Contains: `uid`, `email`, `displayName`, `photoURL`, `emailVerified`
- Available immediately after login
- Used for authentication checks

**`userProfile` (Firestore User):**
- From Firestore `/users/{uid}` collection
- Contains: All Firebase Auth data + `language`, `isPro`, `createdAt`
- May load slightly after `user`
- Used for app-specific data

### Complete Hook Implementation

```typescript
import { useAuth } from './lib/hooks';

function AppLayout() {
  const { user, userProfile, loading, isAuthenticated } = useAuth();
  
  // Show loading screen while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Not logged in - show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  // Logged in but profile not loaded yet
  if (!userProfile) {
    return <div>Loading profile...</div>;
  }
  
  // Fully authenticated with profile
  return (
    <div>
      <Header user={userProfile} />
      <MainContent userId={user!.uid} />
    </div>
  );
}
```

## Authentication Flow Diagrams

### Sign Up Flow

```
User fills form
     ↓
signUpWithEmail(email, password, name)
     ↓
Create Firebase Auth account
     ↓
Update display name
     ↓
Create Firestore user profile
     ↓
Auto sign in
     ↓
User is authenticated
```

### Sign In Flow

```
User enters credentials
     ↓
signInWithEmail(email, password)
     ↓
Firebase Auth validates
     ↓
User is authenticated
     ↓
useAuth hook fetches userProfile
     ↓
App redirects to home
```

### Password Reset Flow

```
User clicks "Forgot Password"
     ↓
resetPassword(email)
     ↓
Firebase sends reset email
     ↓
User clicks link in email
     ↓
User enters new password
     ↓
User can now sign in with new password
```

## Component Integration Examples

### Login Page

```typescript
import { signInWithEmail } from '../lib/firebase';
import { useAuth } from '../lib/hooks';

function LoginPage() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmail(email, password);
      // useAuth will automatically update
      // User will be redirected by route protection
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### Sign Up Page

```typescript
import { signUpWithEmail } from '../lib/firebase';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = await signUpWithEmail(email, password, displayName);
      console.log('Account created:', user.uid);
      // User is automatically signed in
    } catch (err: any) {
      alert(err.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        placeholder="Full Name"
        value={displayName} 
        onChange={(e) => setDisplayName(e.target.value)} 
      />
      <input 
        type="email" 
        placeholder="Email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password (min 6 characters)"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit">Create Account</button>
    </form>
  );
}
```

### Protected Route

```typescript
import { useAuth } from '../lib/hooks';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Checking authentication...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

// Usage
<ProtectedRoute>
  <HomePage />
</ProtectedRoute>
```

### Settings Page with Profile Update

```typescript
import { useAuth } from '../lib/hooks';
import { updateUserProfile } from '../lib/firebase';

function SettingsPage() {
  const { userProfile } = useAuth();
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  
  const handleSave = async () => {
    try {
      await updateUserProfile({ displayName });
      alert('Profile updated!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };
  
  return (
    <div>
      <input 
        value={displayName} 
        onChange={(e) => setDisplayName(e.target.value)} 
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
```

## Error Handling Best Practices

### 1. User-Friendly Error Messages

```typescript
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
}

// Usage
try {
  await signInWithEmail(email, password);
} catch (error: any) {
  const message = getErrorMessage(error.code);
  setError(message);
}
```

### 2. Form Validation

```typescript
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 6;
}

// Before submitting
if (!validateEmail(email)) {
  setError('Invalid email format');
  return;
}

if (!validatePassword(password)) {
  setError('Password must be at least 6 characters');
  return;
}
```

## Security Best Practices

### 1. Never Store Passwords

```typescript
// ❌ NEVER DO THIS
localStorage.setItem('password', password);

// ✅ Use Firebase Auth - it handles security
await signInWithEmail(email, password);
```

### 2. Check Email Verification

```typescript
const { user } = useAuth();

if (user && !user.emailVerified) {
  return (
    <div>
      <p>Please verify your email</p>
      <button onClick={sendVerificationEmail}>
        Resend Verification Email
      </button>
    </div>
  );
}
```

### 3. Secure User Data

```typescript
// Only access user's own data
const { user } = useAuth();
const userId = user?.uid;

// Always use userId from authenticated user
const medicines = await getUserMedicines(userId);

// ❌ NEVER allow user to specify userId from URL or input
```

## Testing

### Manual Testing Checklist

- [ ] Sign up with new email
- [ ] Sign up with existing email (should fail)
- [ ] Sign in with correct credentials
- [ ] Sign in with wrong password (should fail)
- [ ] Sign in with unregistered email (should fail)
- [ ] Password reset email sent
- [ ] Email verification sent
- [ ] Profile update works
- [ ] Sign out works
- [ ] Auth state persists on refresh
- [ ] Protected routes redirect when not logged in

### Test Users

Create test accounts for development:

```typescript
// Test accounts (for development only)
const testUsers = [
  { email: 'patient1@test.com', password: 'test123', name: 'Patient One' },
  { email: 'guardian1@test.com', password: 'test123', name: 'Guardian One' }
];

// Create test users
for (const user of testUsers) {
  await signUpWithEmail(user.email, user.password, user.name);
}
```

## Common Issues and Solutions

### Issue 1: "User is null after sign in"

**Solution:** Wait for auth state to update

```typescript
const { user, loading } = useAuth();

if (loading) {
  return <div>Loading...</div>; // Wait for auth state
}

if (!user) {
  // Now it's safe to redirect
}
```

### Issue 2: "Profile not found after signup"

**Solution:** User profile creation may be delayed

```typescript
const { user, userProfile } = useAuth();

if (user && !userProfile) {
  return <div>Setting up your account...</div>;
}
```

### Issue 3: "Network error on sign in"

**Solution:** Check Firebase configuration

```typescript
// Verify firebase/config.ts has correct credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Must be correct
  authDomain: "YOUR_DOMAIN",
  // ...
};
```

## Migration from Mock Data

When adding authentication to existing components:

```typescript
// Before (mock data)
const userId = 'mock-user-id';

// After (real auth)
import { useAuth } from '../lib/hooks';

function Component() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  const userId = user.uid; // Use real user ID
  
  // Rest of component
}
```

## Summary

### Key Functions
- `signUpWithEmail()` - Create account
- `signInWithEmail()` - Log in
- `signInWithGoogle()` - Google auth
- `resetPassword()` - Send reset email
- `logOut()` - Sign out
- `sendVerificationEmail()` - Verify email
- `updateUserProfile()` - Update profile
- `reauthenticateUser()` - Re-authenticate for sensitive operations

### Key Hook
- `useAuth()` - Get auth state in components

### Best Practices
- ✅ Always use `useAuth` hook in components
- ✅ Show loading state while checking auth
- ✅ Validate input before submitting
- ✅ Provide user-friendly error messages
- ✅ Never store passwords locally
- ✅ Check authentication before accessing user data

---

**For more information:**
- `/lib/README.md` - General Firebase guide
- `/lib/firebase/auth.ts` - Source code
- `/lib/hooks/useAuth.ts` - Hook implementation
