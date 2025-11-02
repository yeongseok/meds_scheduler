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
- 📅 Weekly medication scheduling
- ⏰ Full-screen medication alarms
- 📊 Medication history tracking
- 👨‍👩‍👧 Guardian/Care Circle management
- 🌐 Korean/English localization
- 🎨 Blue color scheme (sky/blue variants)
- 📱 Responsive mobile-first design

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
| `SplashScreen.tsx` | App splash & initial login screen | ✅ Updated to blue |
| `LoginPage.tsx` | User authentication | 🟡 Needs color update |
| `SignUpPage.tsx` | New user registration | 🟡 Needs color update |
| `ForgotPasswordPage.tsx` | Password recovery | 🟡 Needs color update |
| `HomePage.tsx` | Main dashboard with upcoming doses | 🟡 Partially updated |
| `SchedulePage.tsx` | Weekly medication schedule view | 🟡 Needs color update |
| `MedicineListPage.tsx` | Medicine list (기록 screen) | ✅ Optimized |
| `MedicineDetailPage.tsx` | Individual medicine details | ✅ ScrollView added |
| `AddMedicinePage.tsx` | Simple add medicine form | 🟡 Needs color update |
| `AddMedicineWizard.tsx` | Multi-step medicine creation wizard | 🟡 Needs color update |
| `EditMedicinePage.tsx` | Edit existing medicine | 🟡 Needs color update |
| `GuardiansPage.tsx` | Guardian/Care Circle management | 🟡 Needs color update |
| `GuardianViewPage.tsx` | Guardian's view of patient data | 🟡 Needs color update |
| `SettingsPage.tsx` | App settings & preferences | 🟡 Needs color update |
| `ProfilePage.tsx` | User profile management | 🟡 Needs color update |
| `AlarmScreen.tsx` | Full-screen medication reminder alarm | 🟡 Needs color update |

#### **Reusable Card Components**
| File | Purpose |
|------|---------|
| `MedicineCard.tsx` | Display medicine with status badge |
| `MedicineListCard.tsx` | Medicine item in list view |
| `ScheduleMedicineItem.tsx` | Medicine item in schedule |
| `HistoryMedicineCard.tsx` | Historical dose record card |
| `ActiveGuardianCard.tsx` | Active guardian display |
| `PendingInviteCard.tsx` | Pending guardian invitation |
| `ReceivedInvitationCard.tsx` | Received guardian invitation |
| `GuardianInfoCard.tsx` | Guardian information display |
| `PrivacyNoteCard.tsx` | Privacy notice component |
| `AdBanner.tsx` | Advertisement banner | ✅ Partially updated |
| `InAppAdvertise.tsx` | In-app advertisement component |

#### **Shared Components**
| File | Purpose |
|------|---------|
| `SharedHeader.tsx` | Reusable page header with back button |
| `ScheduleWeekNavigator.tsx` | Week navigation controls |
| `ScheduleDateSelector.tsx` | Date selection component |
| `TimePicker.tsx` | Time selection component |
| `HistorySearchFilter.tsx` | Search and filter for history |
| `HistoryFilterChips.tsx` | Filter chip buttons |
| `HistoryEmptyState.tsx` | Empty state placeholder |
| `GuardianSectionHeader.tsx` | Section headers for guardians |
| `InviteGuardianButton.tsx` | Guardian invitation button |
| `LanguageContext.tsx` | **i18n context provider** |

#### **Utility Components**
- `/figma/ImageWithFallback.tsx` - **Protected** - Image component with fallback
- `/ui/*` - **ShadCN Components** - 40+ accessible UI primitives

### `/lib` - Business Logic Layer

#### `/lib/firebase` - Firebase Integration
| File | Purpose |
|------|---------|
| `config.ts` | Firebase initialization & configuration |
| `auth.ts` | Authentication service (signup, login, etc.) |
| `db.ts` | Firestore database operations (CRUD) |
| `index.ts` | Centralized exports |

**Key Functions:**
- Authentication: `signUpWithEmail()`, `signInWithEmail()`, `signInWithGoogle()`, `logOut()`
- User Management: `createUserProfile()`, `getUserProfile()`, `updateUserProfile()`
- Medicine CRUD: `addMedicine()`, `getUserMedicines()`, `updateMedicine()`, `deleteMedicine()`
- Dose Tracking: `addDoseRecord()`, `markDoseAsTaken()`, `markDoseAsMissed()`
- Guardian Management: `addGuardian()`, `getGuardians()`, `sendInvitation()`
- Real-time: `listenToUserMedicines()`, `listenToGuardians()`

#### `/lib/hooks` - Custom React Hooks
| File | Purpose |
|------|---------|
| `useAuth.ts` | Authentication state management |
| `useMedicines.ts` | Medicine list with real-time updates |
| `useGuardians.ts` | Guardian management with real-time updates |
| `index.ts` | Hook exports |

**Usage Example:**
```typescript
const { user, userProfile, loading, isAuthenticated } = useAuth();
const { medicines, addMedicine, updateMedicine } = useMedicines(userId, true);
const { guardians, loading } = useGuardians(userId, true);
```

#### `/lib/types` - TypeScript Definitions
| File | Purpose |
|------|---------|
| `index.ts` | All TypeScript interfaces and types |

**Core Data Models:**
- `User` - User account and profile
- `Medicine` - Medication information
- `DoseRecord` - Individual dose tracking
- `Guardian` - Guardian relationship
- `Invitation` - Guardian invitation
- `UserSettings` - User preferences
- `COLLECTIONS` - Firestore collection names

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

### Current State: Mock Data → Firebase Migration

**Phase 1: ✅ Complete**
- Firebase infrastructure created
- TypeScript interfaces defined
- Custom hooks implemented
- Documentation written

**Phase 2: 🚧 In Progress**
- Components still use **mock data**
- Firebase hooks exist but are **commented out**
- Gradual migration component-by-component
- **DO NOT remove mock data without approval**

**Migration Pattern:**
```typescript
// Current state (most components)
const medicines = mockMedicineData; // Using mock data

// Transition state (in progress)
const mockData = [...]; // Keep existing
const { medicines: fbMedicines } = useMedicines(userId); // Add Firebase
const displayData = mockData; // Still use mock

// Final state (future)
const { medicines } = useMedicines(userId); // Only Firebase
```

## 🎨 Design System

### Color Scheme

**🔄 MIGRATION IN PROGRESS: Amber/Orange → Sky/Blue**

| Usage | Old (⛔️ Don't Use) | New (✅ Use) |
|-------|-------------------|-------------|
| Primary | `amber-500`, `orange-500` | `sky-500`, `blue-500` |
| Primary Light | `amber-50`, `orange-50` | `sky-50`, `blue-50` |
| Primary Dark | `amber-800`, `orange-800` | `sky-800`, `blue-800` |
| Neutral | `gray-*`, `stone-*` | `gray-*`, `stone-*` |
| Success | `green-*` | `green-*` |
| Error | `red-*` | `red-*` |
| Warning | `amber-*` | `yellow-*` or `sky-*` |

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
│   ├── userId, guardianId, guardianName
│   ├── relationship, status, permissions
│   └── createdAt, updatedAt
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

### Security Rules

User data is protected by Firebase Security Rules:
- Users can only access their own data
- Guardians can read data they have permissions for
- All writes are validated

See `/lib/README.md` for complete security rules.

## 🚀 Development Workflow

### For AI Agents

1. **Before ANY changes:**
   - ✅ Read `/guidelines/AI-AGENT-RULES.md` **COMPLETELY**
   - ✅ Check if file is in protected list
   - ✅ Verify you have explicit permission

2. **When adding features:**
   - ✅ Check existing patterns in similar components
   - ✅ Use blue color scheme (`sky-*`, `blue-*`)
   - ✅ Support Korean and English
   - ✅ Import types from `/lib/types`
   - ✅ Use UI components from `/components/ui`

3. **When integrating Firebase:**
   - ✅ Import from `/lib/firebase` or `/lib/hooks`
   - ✅ Keep mock data initially
   - ✅ Add Firebase hooks as commented code first
   - ✅ Wait for approval before switching to live data

4. **When modifying existing components:**
   - ⚠️ **EXTREME CAUTION REQUIRED**
   - ⚠️ Only modify if explicitly requested
   - ⚠️ Never "refactor" or "improve" without permission
   - ⚠️ Preserve all Tailwind classes and structure

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
- ✅ Verify color consistency (blue scheme)
- ✅ Check typography (no Tailwind overrides)
- ✅ Test touch targets (minimum 44px)

### Firebase Testing
- Test with Firebase emulator (recommended)
- Use test accounts, not production data
- Verify security rules work correctly

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

### ✅ Completed
- [x] Complete Figma UI design (37+ components)
- [x] Firebase infrastructure setup
- [x] TypeScript interfaces and types
- [x] Custom React hooks (useAuth, useMedicines, useGuardians)
- [x] Korean/English localization system
- [x] Component extraction and optimization
- [x] ScrollView implementation for detail pages
- [x] Documentation (README, AI-AGENT-RULES.md)

### 🚧 In Progress
- [ ] Color scheme migration (amber → blue)
- [ ] Firebase integration in components
- [ ] Mock data → Firebase migration
- [ ] Testing and debugging

### ⏳ Planned
- [ ] Real-time notifications
- [ ] Push notifications (if supported)
- [ ] Adherence statistics
- [ ] Export medication history
- [ ] Dark mode theme
- [ ] Pro features implementation

## 🆘 Quick Reference

### Most Important Files
1. `/guidelines/AI-AGENT-RULES.md` - **READ FIRST**
2. `/lib/README.md` - Firebase integration guide
3. `/components/LanguageContext.tsx` - i18n implementation
4. `/lib/types/index.ts` - Data models
5. `/App.tsx` - Application routing

### Common Tasks

**Add a new page:**
1. Create file in `/components/PageName.tsx`
2. Import and use in `/App.tsx`
3. Support Korean/English with `useLanguage()`
4. Use blue color scheme

**Add Firebase integration:**
1. Check existing patterns in `/lib/firebase/db.ts`
2. Add functions if needed
3. Import in component: `import { functionName } from '../lib/firebase'`
4. Use hooks: `const { data } = useCustomHook(userId, true)`

**Modify existing component:**
1. **STOP** - Read AI-AGENT-RULES.md first
2. Ask for permission
3. Make minimal changes
4. Preserve structure and classes

## 🔗 External Resources

- **ShadCN UI**: https://ui.shadcn.com
- **Tailwind CSS v4**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **Firebase Docs**: https://firebase.google.com/docs
- **React Docs**: https://react.dev

---

## 📝 Final Notes

This is a **user-facing healthcare application** designed with care for elderly Korean users. Every component has been thoughtfully designed in Figma with accessibility and usability in mind.

**Remember:**
- Respect the existing design
- Ask before modifying
- Support both languages
- Keep elderly users in mind
- Test thoroughly

**Questions?** → Ask the human user before proceeding.

---

**Last Updated:** November 2, 2025  
**Version:** 1.0  
**Maintained By:** Development Team
