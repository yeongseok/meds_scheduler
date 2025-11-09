# Medicine Reminder App - Project Overview

## 📱 Project Description

A comprehensive medication reminder and tracking application designed specifically for **elderly Korean users** and their family guardians. The app provides medicine scheduling, dose tracking, guardian monitoring, and full-featured medication management with bilingual support (Korean/English).

### Target Audience
- **Primary Users**: Elderly Korean-speaking individuals who need medication management
- **Secondary Users**: Family members/guardians who monitor their loved ones' medication adherence

### Design Philosophy
- **Accessibility First**: Large text, high contrast, simple navigation
- **Korean-centric**: Primary language is Korean with English support
- **Touch-friendly**: Large buttons and touch targets for elderly users
- **Android Patterns**: Bottom navigation, card layouts, material design principles
- **Figma-designed**: All UI components are professionally designed in Figma

## 🛠️ Technology Stack

### Core Technologies
- **React 18+** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **Firebase** - Authentication and Firestore database
- **Vite** - Build tool and dev server

### UI Component Library
- **ShadCN UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Key Features
- 📅 Weekly medication scheduling with visual calendar
- ⏰ Full-screen medication alarms with snooze
- 📊 Medication history tracking with statistics
- 👨‍👩‍👧 Guardian/Care Circle management with invitations
- 🌐 Korean/English localization with full i18n support
- 🎨 Soft pastel color scheme (cream, teal, coral, blue)
- 📱 Responsive mobile-first design for Android
- ♿ Accessibility-first design for elderly users
- 🔒 Firebase authentication with email/phone support
- 💾 Real-time Firestore database synchronization

## 📁 Project Structure

```
├── App.tsx                      # Main application entry point & routing
├── Attributions.md              # Third-party attributions
│
├── components/                  # React components (Figma-designed)
│   ├── [Pages]                 # Full-screen page components
│   ├── [Cards]                 # Reusable card components
│   ├── [Shared]                # Shared UI components
│   ├── figma/                  # Figma-specific utilities
│   └── ui/                     # ShadCN UI primitives
│
├── guidelines/                  # Development guidelines
│   ├── AI-AGENT-RULES.md       # **MUST READ** - AI development rules
│   └── Guidelines.md           # Additional guidelines
│
├── lib/                        # Business logic & Firebase integration
│   ├── firebase/               # Firebase services
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript type definitions
│
└── styles/                     # Global styles and design tokens
    └── globals.css             # Tailwind config + typography tokens
```

## 🗂️ Detailed Folder Structure

### `/components` - React Components

#### **Page Components** (Full Screens)
| File | Purpose | Status |
|------|---------|--------|
| `SplashScreen.tsx` | App splash screen (legacy) | ✅ Complete |
| `WelcomeSplashScreen.tsx` | New welcome splash with language selection | ✅ Complete |
| `LoginPage.tsx` | User authentication with email | ✅ Color standardized |
| `SignUpPage.tsx` | New user registration (main) | ✅ Color standardized |
| `EmailSignUpPage.tsx` | Email-specific signup flow | ✅ Color standardized |
| `PhoneSignUpPage.tsx` | Phone-specific signup flow | ✅ Color standardized |
| `ForgotPasswordPage.tsx` | Password recovery | ✅ Color standardized |
| `HomePage.tsx` | Main dashboard with upcoming doses | ✅ Color standardized |
| `SchedulePage.tsx` | Weekly medication schedule view | ✅ Color standardized |
| `MedicineListPage.tsx` | Medicine list (기록 screen) | ✅ Color standardized |
| `MedicineDetailPage.tsx` | Individual medicine details | ✅ Color standardized |
| `AddMedicinePage.tsx` | Simple add medicine form | ✅ Color standardized |
| `AddMedicineWizard.tsx` | Multi-step medicine creation wizard | ✅ Color standardized |
| `EditMedicinePage.tsx` | Edit existing medicine | ✅ Color standardized |
| `GuardiansPage.tsx` | Guardian/Care Circle management | ✅ Color standardized |
| `GuardianViewPage.tsx` | Guardian's view of patient data | ✅ Color standardized |
| `SettingsPage.tsx` | App settings & preferences | ✅ Color standardized |
| `ProfilePage.tsx` | User profile with account stats | ✅ Color standardized |
| `AlarmScreen.tsx` | Full-screen medication reminder alarm | ✅ Color standardized |
| `PrivacyPolicyPage.tsx` | Privacy policy and data usage | ✅ Complete |
| `TermsOfServicePage.tsx` | Terms of service agreement | ✅ Complete |

#### **Reusable Card Components**
| File | Purpose |
|------|---------|
| `MedicineCard.tsx` | Display medicine with status badge |
| `MedicineListCard.tsx` | Medicine item in list view |
| `ScheduleMedicineItem.tsx` | Medicine item in schedule |
| `HistoryMedicineCard.tsx` | Historical dose record card |
| `HomePageAlertCard.tsx` | Alert/notification card for home page |
| `ActiveGuardianCard.tsx` | Active guardian display |
| `PendingInviteCard.tsx` | Pending guardian invitation |
| `ReceivedInvitationCard.tsx` | Received guardian invitation |
| `GuardianInfoCard.tsx` | Guardian information display |
| `PrivacyNoteCard.tsx` | Privacy notice component |
| `AdBanner.tsx` | Advertisement banner for pro upgrade |
| `InAppAdvertise.tsx` | In-app advertisement component |

#### **Shared Components**
| File | Purpose |
|------|---------|
| `SharedHeader.tsx` | Reusable page header with back button |
| `AppIcon.tsx` | Application icon component |
| `ScheduleWeekNavigator.tsx` | Week navigation controls |
| `ScheduleDateSelector.tsx` | Date selection component |
| `HomePageScheduleHeader.tsx` | Schedule header for home page |
| `ScheduleEmptyState.tsx` | Empty state for schedule view |
| `TimePicker.tsx` | Time selection component |
| `HistorySearchFilter.tsx` | Search and filter for history |
| `HistoryFilterChips.tsx` | Filter chip buttons |
| `HistoryEmptyState.tsx` | Empty state placeholder |
| `GuardianSectionHeader.tsx` | Section headers for guardians |
| `InviteGuardianButton.tsx` | Guardian invitation button |
| `UserAuthDialog.tsx` | User authentication dialog |
| `SettingsPrivacyDialog.tsx` | Privacy policy dialog in settings |
| `SettingsTermsDialog.tsx` | Terms of service dialog in settings |
| `LanguageContext.tsx` | **i18n context provider** |

#### **Utility Components**
- `/figma/ImageWithFallback.tsx` - **Protected** - Image component with fallback
- `/ui/*` - **ShadCN Components** - 40+ accessible UI primitives

### `/lib` - Business Logic Layer

#### `/lib/utils` - Utility Functions
| File | Purpose |
|------|---------|
| `index.ts` | Centralized utility exports |
| `medicineStats.ts` | Medicine statistics calculations |
| `scheduleHelpers.ts` | Schedule and date helper functions |

#### `/lib/firebase` - Firebase Integration
| File | Purpose |
|------|---------|
| `config.ts` | Firebase initialization & configuration |
| `auth.ts` | Authentication service (signup, login, etc.) |
| `db.ts` | Firestore database operations (CRUD) |
| `index.ts` | Centralized exports |

**Key Functions:**
- Authentication: `signUpWithEmail()`, `signInWithEmail()`, `signInWithGoogle()`, `logOut()`, `reauthenticateUser()` (NEW)
- User Management: `createUserProfile()`, `getUserProfile()`, `updateUserProfile()`, `deleteUserAccount()`
- Medicine CRUD: `addMedicine()`, `getUserMedicines()`, `updateMedicine()`, `deleteMedicine()`
- Dose Tracking: `addDoseRecord()`, `markDoseAsTaken()`, `markDoseAsMissed()`, `getDoseRecords()`
- Guardian Management: `addGuardian()`, `getGuardians()`, `sendInvitation()`, `acceptInvitation()`, `rejectInvitation()`
- Care Recipients: `getCareRecipients()`, `getRecipientMedicines()`
- Real-time Listeners: `listenToUserMedicines()`, `listenToGuardians()`, `listenToCareRecipients()`

#### `/lib/hooks` - Custom React Hooks
| File | Purpose |
|------|---------|
| `useAuth.ts` | Authentication state management with user context |
| `useMedicines.ts` | Medicine list with real-time Firestore updates |
| `useGuardians.ts` | Guardian management with real-time updates |
| `useCareRecipients.ts` | Care recipient management (guardian perspective) |
| `useInvitations.ts` | Guardian invitation management |
| `useSettings.ts` | User settings and preferences management |
| `useUserProfile.ts` | User profile data management |
| `index.ts` | Centralized hook exports |

**Usage Example:**
```typescript
// Authentication
const { user, userProfile, loading, isAuthenticated } = useAuth();

// Medicine management (patient perspective)
const { medicines, addMedicine, updateMedicine } = useMedicines(userId, true);

// Guardian management (patient perspective - who is caring for me?)
const { guardians, loading } = useGuardians(userId, true);

// Care recipient management (guardian perspective - who am I caring for?)
const { recipients, getRecipientMedicines } = useCareRecipients(guardianId, true);

// Real-time recipient medication monitoring
const { medicines, loading } = useRecipientMedicines(guardianId, recipientUserId);
```

#### `/lib/types` - TypeScript Definitions
| File | Purpose |
|------|---------|
| `index.ts` | All TypeScript interfaces and types (11 core types) |
| `TYPE-COVERAGE-ANALYSIS.md` | Complete type system analysis |
| `TYPES-CONFIRMATION.md` | Type confirmation documentation |

**Core Data Models:**
- `User` - User account and profile information
- `Medicine` - Medication information and scheduling
- `DoseRecord` - Individual dose tracking records
- `Guardian` - Guardian relationship (bidirectional)
- `CareRecipient` - Extended guardian info with recipient details
- `Invitation` - Guardian invitation system
- `UserSettings` - User preferences and app settings
- `UserStats` - User account statistics (NEW)
- `MedicineWithStats` - Medicine with calculated statistics (NEW)
- `DoseStatus` - Dose status enum ('pending', 'taken', 'missed', 'skipped')
- `COLLECTIONS` - Firestore collection name constants

### `/styles` - Styling

| File | Purpose |
|------|---------|
| `globals.css` | Tailwind v4 config + typography tokens |

**Contains:**
- CSS custom properties for colors
- Typography definitions (h1, h2, h3, p, etc.)
- Noto Sans KR font imports
- Base styles for HTML elements

### `/guidelines` - Development Documentation

| File | Purpose |
|------|---------|
| `AI-AGENT-RULES.md` | **⚠️ MUST READ BEFORE ANY CHANGES** |
| `Guidelines.md` | Additional development guidelines |

### `/components` - Component Documentation

| File | Purpose |
|------|---------|
| `MEDICINE-STATUS-LOGIC.md` | Medicine status calculation logic |
| `STATUS-QUICK-REFERENCE.md` | Quick reference for status badges |
| `STATUS-UNIFICATION-SUMMARY.md` | Status system unification summary |
| `HomePageHelpers.ts` | Helper functions for HomePage |
| `MedicineStatusHelpers.ts` | Shared status calculation utilities |

### `/lib` - Library Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete Firebase integration overview |
| `AUTHENTICATION-GUIDE.md` | Authentication implementation guide |
| `HOOKS-REFERENCE.md` | All custom hooks reference |
| `DATA-MODELS.md` | TypeScript data models documentation |
| `CARE-RECIPIENT-GUIDE.md` | Guardian/care recipient functionality |
| `CARE-RECIPIENT-SUMMARY.md` | Care recipient summary |
| `MIGRATION-GUIDE.md` | Mock to Firebase migration guide |
| `INDEX.md` | Library index and navigation |
| `CHANGELOG.md` | Complete change history |
| `RECENT-UPDATES-SUMMARY.md` | Summary of recent updates |

### Root Documentation

| File | Purpose |
|------|---------|
| `PROJECT-README.md` | This file - complete project overview |
| `PROFILE-AUTH-TEST.md` | Profile and authentication testing guide |
| `Attributions.md` | Third-party library attributions |

## 🏗️ Application Architecture

### Component Hierarchy

```
App.tsx (Router)
├── LanguageContext.Provider
│   ├── SplashScreen
│   ├── LoginPage
│   ├── SignUpPage
│   ├── ForgotPasswordPage
│   │
│   └── Main App (After Login)
│       ├── HomePage
│       │   ├── MedicineCard (multiple)
│       │   └── AdBanner
│       │
│       ├── SchedulePage
│       │   ├── ScheduleWeekNavigator
│       │   ├── ScheduleDateSelector
│       │   └── ScheduleMedicineItem (multiple)
│       │
│       ├── MedicineListPage (기록)
│       │   ├── MedicineListCard (multiple)
│       │   └── ScheduleMedicineItem (upcoming)
│       │
│       ├── GuardiansPage
│       │   ├── ActiveGuardianCard (multiple)
│       │   ├── PendingInviteCard (multiple)
│       │   ├── ReceivedInvitationCard (multiple)
│       │   └── InviteGuardianButton
│       │
│       ├── SettingsPage
│       ├── ProfilePage
│       │
│       └── Bottom Navigation (4 tabs)
│           ├── Home (집)
│           ├── Schedule (스케줄)
│           ├── Records (기록)
│           └── More (더보기)
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Components                     │
│  (HomePage, MedicineListPage, GuardiansPage, etc.)      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Custom React Hooks                     │
│     useAuth(), useMedicines(), useGuardians()           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Firebase Services                       │
│           /lib/firebase/auth.ts & db.ts                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Firebase Backend                       │
│         Authentication + Firestore Database              │
└─────────────────────────────────────────────────────────┘
```

### Current State: Firebase Integration Status

**Phase 1: ✅ Complete**
- Firebase infrastructure fully implemented
- TypeScript interfaces and types defined (11 core types)
- Custom React hooks implemented (7 hooks)
- Comprehensive documentation written
- Utility functions for stats and scheduling

**Phase 2: ✅ Complete**
- Color system standardized across all 34+ components
- All components updated to use semantic color variables
- Typography system centralized in globals.css
- Medicine status logic unified and documented
- User authentication flow with email/phone support

**Phase 3: 🚧 In Progress**
- Firebase integration in select components
- Real-time data synchronization
- Mock data still primary in some components
- Testing authentication flows
- Performance optimization

**Migration Pattern:**
```typescript
// Current state (most components)
const medicines = mockMedicineData; // Using mock data for stability

// Transition state (some components)
const mockData = [...]; // Keep existing
const { medicines: fbMedicines } = useMedicines(userId); // Add Firebase
const displayData = mockData; // Still use mock

// Final state (future - planned)
const { medicines } = useMedicines(userId); // Only Firebase
```

**Note:** Mock data is intentionally retained for development stability. Firebase migration is happening incrementally with thorough testing.

## 🎨 Design System

### Color Scheme

**✅ COMPLETE: Soft Pastel Color Palette with Semantic Variables**

All colors are now controlled through semantic CSS variables in `/styles/globals.css`:

| Usage | CSS Variable | Tailwind Classes | Hex Value |
|-------|-------------|------------------|-----------|
| **Background** | `--color-background` | `bg-background` | `#FAF9F6` (Cream) |
| **Primary** | `--color-primary` | `bg-primary` | `#88C9C3` (Teal) |
| **Primary Light** | `--color-primary-light` | `bg-primary-light` | `#E0F2F1` (Light Teal) |
| **Primary Hover** | `--color-primary-hover` | `hover:bg-primary-hover` | `#6FB3AD` |
| **Secondary** | `--color-secondary` | `bg-secondary` | `#3674B5` (Blue) |
| **Secondary Light** | `--color-secondary-light` | `bg-secondary-light` | `#D7E8F8` |
| **Accent** | `--color-accent` | `bg-accent` | `#FFB6A3` (Coral) |
| **Accent Light** | `--color-accent-light` | `bg-accent-light` | `#FFE4DD` |
| **Text Primary** | `--color-text-primary` | `text-text-primary` | `#2C3E50` |
| **Text Secondary** | `--color-text-secondary` | `text-text-secondary` | `#64748B` |
| **Border** | `--color-border` | `border-border` | `#E2E8F0` |
| **Success** | `--color-success` | `bg-success` | `#86EFAC` (Green) |
| **Error** | `--color-error` | `bg-error` | `#FCA5A5` (Red) |

**Design Principles:**
- ✅ No gradients - all solid colors
- ✅ White backgrounds for main content areas
- ✅ Soft pastels for primary interactions
- ✅ High contrast for accessibility
- ✅ Consistent semantic naming

### Typography

**⚠️ IMPORTANT: Typography is controlled by `/styles/globals.css`**

**DO NOT use Tailwind typography classes unless explicitly requested:**
- ❌ `text-2xl`, `text-lg`, `text-sm`
- ❌ `font-bold`, `font-semibold`, `font-medium`
- ❌ `leading-tight`, `leading-relaxed`

**Typography is pre-defined for:**
- `<h1>`, `<h2>`, `<h3>` - Headings with appropriate sizes
- `<p>` - Body text
- Font family: **Noto Sans KR** for Korean, system fonts for English

### Component Patterns

1. **Cards**: Primary content container
   - Use `<Card>` from `/components/ui/card`
   - Rounded corners, shadow, padding
   
2. **Buttons**: Call-to-action elements
   - Use `<Button>` from `/components/ui/button`
   - Variants: default, outline, ghost, destructive
   
3. **Badges**: Status indicators
   - Use `<Badge>` from `/components/ui/badge`
   - For medicine status, dose status, etc.

4. **Bottom Navigation**: Main navigation
   - Always visible
   - 4 tabs: Home, Schedule, Records, More
   - Active state with blue highlight

5. **Headers**: Page headers
   - Use `<SharedHeader>` component
   - Back button + title + optional action

## 🌐 Internationalization (i18n)

### Language Support
- **Korean (ko)**: Primary language
- **English (en)**: Secondary language

### Implementation

**LanguageContext Provider** (`/components/LanguageContext.tsx`):
```typescript
const { language, setLanguage, t } = useLanguage();

// Usage
<h1>{t.home.title}</h1> // "홈" or "Home"
<p>{language === 'ko' ? '한국어 텍스트' : 'English text'}</p>
```

**Translation Pattern:**
```typescript
// In component
const { language, t } = useLanguage();

return (
  <div>
    {language === 'ko' ? (
      <span>복용 예정</span>
    ) : (
      <span>Upcoming Doses</span>
    )}
  </div>
);
```

**All text must support both languages.**

## 🔥 Firebase Integration

### Collections Structure

```
Firestore Database
├── users/{userId}
│   ├── uid, email, displayName
│   ├── language, isPro
│   └── createdAt
│
├── medicines/{medicineId}
│   ├── userId, name, dosage, type
│   ├── frequency, times[], startDate, endDate
│   ├── status, reminderEnabled
│   └── createdAt, updatedAt
│
├── doseRecords/{recordId}
│   ├── medicineId, userId
│   ├── scheduledDate, scheduledTime
│   ├── status, takenAt, note
│   └── createdAt, updatedAt
│
├── guardians/{guardianId}
│   ├── userId (care recipient), guardianId (guardian)
│   ├── guardianName, guardianEmail, guardianPhone
│   ├── relationship, status, permissions{}
│   └── createdAt, updatedAt, invitedAt, acceptedAt
│   │
│   │   Note: Bidirectional queries supported
│   │   - Query by userId: Get who is caring for me
│   │   - Query by guardianId: Get who I'm caring for
│
├── invitations/{invitationId}
│   ├── fromUserId, toEmail, relationship
│   ├── status, invitedAt, expiresAt
│   └── respondedAt
│
└── settings/{userId}
    ├── language, theme, fontSize
    ├── notifications{enabled, sound, vibration}
    └── updatedAt
```

### Guardian/Care Recipient Relationship

The `guardians` collection supports **bidirectional relationships**:

**Patient Perspective** (Who is caring for me?):
```typescript
const { guardians } = useGuardians(userId, true);
// Returns: People who have access to monitor my medications
```

**Guardian Perspective** (Who am I caring for?):
```typescript
const { recipients } = useCareRecipients(guardianId, true);
// Returns: People I'm monitoring/caring for
```

**Permission System:**
- `viewMedications` - Guardian can see recipient's medicines
- `viewHistory` - Guardian can see dose records
- `receiveAlerts` - Guardian gets notifications (future)

### Security Rules

User data is protected by Firebase Security Rules:
- Users can only access their own data
- Guardians can read recipient data ONLY if they have active permissions
- Permission checks are enforced in all database functions
- All writes are validated

See `/lib/README.md` for complete security rules.

## 🚀 Development Workflow

### For AI Agents

1. **Before ANY changes:**
   - ✅ Read `/guidelines/AI-AGENT-RULES.md` **COMPLETELY**
   - ✅ Check if file is in protected list
   - ✅ Verify you have explicit permission
   - ✅ Review `/lib/RECENT-UPDATES-SUMMARY.md` for latest changes

2. **When adding features:**
   - ✅ Check existing patterns in similar components
   - ✅ Use semantic color variables from `globals.css` (e.g., `bg-primary`, `bg-secondary`)
   - ✅ NO hardcoded Tailwind colors unless necessary
   - ✅ Support Korean and English with `useLanguage()` hook
   - ✅ Import types from `/lib/types`
   - ✅ Use UI components from `/components/ui`
   - ✅ Use helper utilities from `/lib/utils`

3. **When integrating Firebase:**
   - ✅ Import from `/lib/firebase` or `/lib/hooks`
   - ✅ Keep mock data initially for development stability
   - ✅ Add Firebase hooks as optional/alternative code
   - ✅ Test thoroughly before switching to live data
   - ✅ Document any database schema changes

4. **When modifying existing components:**
   - ⚠️ **EXTREME CAUTION REQUIRED**
   - ⚠️ Only modify if explicitly requested
   - ⚠️ Never "refactor" or "improve" without permission
   - ⚠️ Preserve all Tailwind classes and structure
   - ⚠️ Maintain color consistency with semantic variables
   - ⚠️ Test in both Korean and English

5. **When working with colors:**
   - ✅ ALWAYS use semantic CSS variables (e.g., `bg-primary`, `text-secondary`)
   - ❌ NEVER use hardcoded Tailwind colors (e.g., `bg-blue-500`, `text-teal-600`)
   - ✅ Refer to color table in Design System section
   - ✅ No gradients - solid colors only

### File Modification Rules

| File Location | Modification Policy |
|---------------|-------------------|
| `/components/ui/*` | ⛔️ NEVER modify (ShadCN) |
| `/components/figma/*` | ⛔️ NEVER modify (Protected) |
| `/components/*.tsx` | ⚠️ ASK FIRST (Figma-designed) |
| `/lib/**/*` | ✅ Safe to modify |
| `/styles/globals.css` | ⚠️ ASK FIRST (Design tokens) |
| New files | ✅ Safe to create |

## 📊 Key Features Overview

### 1. Authentication & Onboarding
- Splash screen with language selection
- Email/password signup and login
- Google authentication (future)
- Password recovery
- Email verification

### 2. Medicine Management
- Add medicine (simple form or wizard)
- Edit/delete medicines
- Medicine details with history
- Status tracking (active, paused, completed)
- Dose scheduling with multiple times per day

### 3. Reminders & Alarms
- Full-screen alarm notifications
- Snooze functionality
- Sound and vibration alerts
- Advance reminders

### 4. History & Tracking
- View all dose history
- Filter by medicine, status, date
- Take/miss/skip dose recording
- Adherence statistics (future)

### 5. Guardian/Care Circle
- Invite family members as guardians
- Accept/reject invitations
- Guardian view of patient medications
- Alert guardians on missed doses (future)
- Privacy controls

### 6. Schedule View
- Weekly calendar view
- Daily dose list
- Quick mark as taken
- Navigate between weeks

### 7. Settings & Profile
- Language preference (Korean/English)
- Notification settings
- Theme (future)
- Account management
- Pro upgrade (premium features)

### 8. Accessibility Features
- Large text for elderly users
- High contrast design
- Simple navigation
- Touch-friendly buttons (minimum 44px)
- Korean language priority

## 🧪 Testing Considerations

### Manual Testing Checklist
- ✅ Test in Korean language
- ✅ Test in English language
- ✅ Test on mobile viewport (375px - 428px)
- ✅ Test all navigation flows
- ✅ Verify color consistency (soft pastel palette)
- ✅ Check typography (globals.css controls)
- ✅ Test touch targets (minimum 44px for elderly users)
- ✅ Test all authentication flows (email, phone, forgot password)
- ✅ Test guardian invitation system
- ✅ Test medicine CRUD operations
- ✅ Test schedule view and date navigation
- ✅ Test profile page statistics

### Firebase Testing
- ✅ Test with Firebase emulator (recommended)
- ✅ Use test accounts, not production data
- ✅ Verify security rules work correctly
- ✅ Test real-time listeners and data sync
- ✅ Test authentication state persistence
- ✅ Test guardian permission system
- ✅ Verify user data isolation

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM rendering
- `typescript` - Type safety

### Firebase
- `firebase` - Authentication & Firestore

### UI & Styling
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `@radix-ui/*` - Accessible primitives (via ShadCN)

### Utilities
- `date-fns` - Date manipulation (if needed)
- `clsx` - Conditional classes
- `tailwind-merge` - Merge Tailwind classes

## 🎯 Project Status

### ✅ Completed (v1.2.0)
- [x] Complete Figma UI design (50+ components)
- [x] Firebase infrastructure with authentication and Firestore
- [x] TypeScript type system (11 core types + utilities)
- [x] Custom React hooks (7 hooks: useAuth, useMedicines, useGuardians, useCareRecipients, useInvitations, useSettings, useUserProfile)
- [x] Korean/English localization system with full i18n
- [x] Component extraction and optimization (34+ core components)
- [x] Color system standardization (soft pastel palette)
- [x] Semantic color variables in globals.css
- [x] Typography system with Noto Sans KR
- [x] Medicine status logic unification
- [x] User authentication (email and phone)
- [x] Profile page with account statistics
- [x] Guardian/Care Circle invitation system
- [x] Privacy policy and terms of service pages
- [x] Comprehensive documentation (15+ MD files)
- [x] Helper utilities (medicineStats, scheduleHelpers, status helpers)
- [x] ScrollView implementation for detail pages
- [x] Welcome splash screen with language selection

### 🚧 In Progress
- [ ] Complete Firebase integration in all components
- [ ] Mock data → Firebase migration (incremental)
- [ ] Real-time data synchronization testing
- [ ] Authentication flow testing and refinement
- [ ] Performance optimization
- [ ] Accessibility testing for elderly users

### ⏳ Planned (v1.3.0+)
- [ ] Real-time push notifications
- [ ] Medication adherence statistics dashboard
- [ ] Export medication history (PDF/CSV)
- [ ] Dark mode theme support
- [ ] Pro features implementation (premium unlock)
- [ ] Offline mode with local storage
- [ ] Multi-device synchronization
- [ ] Advanced reminder customization
- [ ] Photo upload for medicines
- [ ] Voice input for elderly users

## 🆘 Quick Reference

### Most Important Files

**For AI Agents (Read First):**
1. `/guidelines/AI-AGENT-RULES.md` - **MUST READ** - Development rules
2. `/PROJECT-README.md` - This file (complete project overview)
3. `/lib/INDEX.md` - Library navigation and quick reference

**Firebase & Backend Integration:**
4. `/lib/README.md` - Firebase integration overview
5. `/lib/AUTHENTICATION-GUIDE.md` - Complete authentication documentation
6. `/lib/HOOKS-REFERENCE.md` - All 7 custom React hooks reference
7. `/lib/DATA-MODELS.md` - TypeScript interfaces and data models
8. `/lib/CARE-RECIPIENT-GUIDE.md` - Guardian/care recipient functionality
9. `/lib/MIGRATION-GUIDE.md` - Mock to Firebase migration guide

**Code Structure:**
10. `/lib/types/index.ts` - All TypeScript data models (11 core types)
11. `/lib/types/TYPE-COVERAGE-ANALYSIS.md` - Complete type system analysis
12. `/components/LanguageContext.tsx` - i18n implementation
13. `/App.tsx` - Application routing
14. `/styles/globals.css` - Semantic color variables and typography

**Recent Updates:**
15. `/lib/CHANGELOG.md` - Complete change history
16. `/lib/RECENT-UPDATES-SUMMARY.md` - Summary of latest improvements
17. `/components/MEDICINE-STATUS-LOGIC.md` - Status calculation logic
18. `/PROFILE-AUTH-TEST.md` - Authentication testing guide

### Common Tasks

**Add a new page:**
1. Create file in `/components/PageName.tsx`
2. Import and use in `/App.tsx` with proper routing
3. Support Korean/English with `useLanguage()` hook
4. Use semantic color variables from `globals.css`
5. Follow existing component patterns for consistency
6. Add SharedHeader if needed for navigation

**Add Firebase integration:**
1. Check existing patterns in `/lib/firebase/db.ts`
2. Add new functions if needed (auth.ts for auth, db.ts for data)
3. Create or use existing hook in `/lib/hooks/`
4. Import in component: `import { functionName } from '../lib/firebase'`
5. Use hooks: `const { data, loading, error } = useCustomHook(userId, true)`
6. Handle loading and error states properly
7. Document in `/lib/README.md` or appropriate guide

**Modify existing component:**
1. **STOP** - Read `/guidelines/AI-AGENT-RULES.md` first
2. Read `/lib/RECENT-UPDATES-SUMMARY.md` to understand latest changes
3. Ask for permission if unsure
4. Make minimal, targeted changes
5. Preserve structure, classes, and semantic color variables
6. Test in both Korean and English
7. Verify color consistency with palette

**Add utility function:**
1. Check if similar utility exists in `/lib/utils/`
2. Create in appropriate file (medicineStats, scheduleHelpers, or new file)
3. Export from `/lib/utils/index.ts`
4. Document purpose and usage
5. Use TypeScript for type safety

## 🔗 External Resources

- **ShadCN UI**: https://ui.shadcn.com
- **Tailwind CSS v4**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Firebase Docs**: https://firebase.google.com/docs
- **React Docs**: https://react.dev

---

## 📝 Final Notes

This is a **user-facing healthcare application** designed with care for elderly Korean users. Every component has been thoughtfully designed with accessibility and usability in mind.

**Remember:**
- 🎨 **Respect the existing design** - Colors, layout, and structure are intentional
- 🙋 **Ask before modifying** - Especially for core components
- 🌐 **Support both languages** - Korean primary, English secondary
- 👴 **Keep elderly users in mind** - Large text, simple navigation, high contrast
- 🧪 **Test thoroughly** - Both languages, mobile viewports, touch interactions
- 🎨 **Use semantic colors** - Always use CSS variables, never hardcode colors
- 📚 **Document changes** - Update relevant MD files when making significant changes

**Key Achievements:**
- ✅ 50+ React components fully implemented
- ✅ Complete Firebase backend integration ready
- ✅ Comprehensive type system (11 core types)
- ✅ Full Korean/English localization
- ✅ Soft pastel color palette standardized across all components
- ✅ Guardian/Care Circle system with invitations
- ✅ 25+ documentation files for maintainability
- ✅ Accessibility-first design for elderly users

**Questions?** → Ask the human user before proceeding.

**Need Help?** → Check `/lib/INDEX.md` for quick navigation to all documentation.

---

**Last Updated:** November 8, 2025  
**Version:** 1.2.0  
**Maintained By:** Development Team  
**Total Components:** 50+ React components  
**Total Documentation:** 25+ MD files  
**Lines of Code:** 10,000+ lines
