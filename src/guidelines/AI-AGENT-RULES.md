# AI Agent Development Guidelines - Medicine Reminder App

**⚠️ CRITICAL: READ THIS ENTIRE DOCUMENT BEFORE MAKING ANY CHANGES ⚠️**

## 🚨 STRICT RULES - MUST FOLLOW

### Rule #1: DO NOT MODIFY EXISTING COMPONENTS WITHOUT EXPLICIT PERMISSION

**All components in `/components` directory are Figma-designed and human-reviewed.**

You **MUST NOT**:
- Change component structure or layout
- Modify Tailwind classes unless explicitly requested
- Remove or add HTML elements
- Change component logic or behavior
- Refactor or "improve" existing code
- Apply "best practices" that alter functionality

You **MAY ONLY**:
- Add new features when explicitly requested
- Fix critical bugs that break functionality
- Update specific lines when user provides exact selection
- Add Firebase integration hooks as instructed
- Create NEW components in addition to existing ones

### Rule #2: PRESERVE THE COLOR SCHEME MIGRATION

**Current Color Migration Status:**
- **FROM:** Amber/Orange tones (`amber-*`, `orange-*`)
- **TO:** Light Blue tones (`sky-*`, `blue-*`)

**Completed Files:**
- `/App.tsx` - Partially updated
- `/components/AdBanner.tsx` - Partially updated  
- `/components/SplashScreen.tsx` - Completed
- `/components/MedicineCard.tsx` - Line 72 updated

**Pending Files (DO NOT UPDATE WITHOUT PERMISSION):**
- ~20+ component files still need systematic color updates
- User is manually reviewing and updating each file

**When Adding New Code:**
- Use `sky-*` and `blue-*` classes for primary colors
- Use `gray-*` for neutral colors
- Never introduce `amber-*` or `orange-*` classes

### Rule #3: PRESERVE DESIGN FOR ELDERLY USERS

**This app is designed for elderly Korean users with specific requirements:**

1. **Typography:**
   - Noto Sans KR font for Korean text
   - Enlarged text sizes (larger than standard)
   - DO NOT change font sizes unless explicitly requested
   - DO NOT add Tailwind font size/weight classes (`text-2xl`, `font-bold`) unless requested

2. **Layout:**
   - Bottom navigation (Android pattern)
   - Card-based layouts for easy touch targets
   - High contrast for readability
   - Large touch targets for buttons

3. **Localization:**
   - Korean (ko) and English (en) support
   - Never remove language context
   - Maintain `useLanguage()` hook usage

### Rule #4: FIREBASE INTEGRATION GUIDELINES

**Firebase Setup Location:** `/lib/firebase/`

**Integration Approach:**
- Firebase code is in `/lib` directory
- Components should import from `/lib/firebase` or `/lib/hooks`
- DO NOT modify existing component state management without approval
- ADD Firebase hooks alongside existing mock data initially
- DO NOT remove mock data until user approves migration

**Example Integration:**
```typescript
// ✅ CORRECT - Add alongside existing code
import { useMedicines } from '../lib/hooks';

function HomePage() {
  // Existing mock data (keep for now)
  const mockData = [...];
  
  // New Firebase hook (add when ready)
  // const { medicines } = useMedicines(userId);
  
  // Use mock data until migration approved
  const displayData = mockData;
}

// ❌ WRONG - Don't immediately replace
import { useMedicines } from '../lib/hooks';

function HomePage() {
  const { medicines } = useMedicines(userId); // Too aggressive!
  return <div>{medicines.map(...)}</div>;
}
```

### Rule #5: FILE STRUCTURE RULES

**Protected Files (NEVER MODIFY):**
- `/components/figma/ImageWithFallback.tsx`
- `/styles/globals.css` (unless explicitly changing design tokens)
- All files in `/components/ui/` (ShadCN components)

**Existing Component Files (MODIFY WITH EXTREME CAUTION):**
All files in `/components/` that are NOT in subdirectories

**Safe to Modify:**
- `/lib/` directory (Firebase integration)
- New files you create
- Files user explicitly selects for editing

### Rule #6: WHEN USER PROVIDES SELECTION

When user provides a code selection using `<figma_current_snippet_selection>`:

1. **ONLY modify the selected element/code**
2. **DO NOT** make related changes elsewhere in the file
3. **DO NOT** "improve" surrounding code
4. If changes are needed outside selection:
   - List what needs to change in plain English
   - Ask user for confirmation
   - Wait for approval before proceeding

### Rule #7: CODE QUALITY GUIDELINES

**DO:**
- Follow existing patterns in the codebase
- Use TypeScript interfaces from `/lib/types/index.ts`
- Import UI components from `./components/ui/`
- Use lucide-react for icons
- Maintain Korean and English translations
- Add comments for complex logic
- Test Firebase integration with mock data first

**DON'T:**
- Refactor working code without permission
- Change variable naming conventions
- Reorganize file structure
- Add unnecessary dependencies
- Remove comments
- Change indentation or formatting style

## 📋 COMPONENT INVENTORY

### Pages (Main Screens)
1. `/components/SplashScreen.tsx` - Initial splash/login screen ✅ Updated
2. `/components/LoginPage.tsx` - User login
3. `/components/SignUpPage.tsx` - User registration
4. `/components/ForgotPasswordPage.tsx` - Password recovery
5. `/components/HomePage.tsx` - Main dashboard
6. `/components/SchedulePage.tsx` - Weekly medication schedule
7. `/components/MedicineListPage.tsx` - Medicine list (기록 screen) ✅ Optimized
8. `/components/MedicineDetailPage.tsx` - Individual medicine details ✅ ScrollView added
9. `/components/AddMedicinePage.tsx` - Add medicine form
10. `/components/AddMedicineWizard.tsx` - Multi-step medicine wizard
11. `/components/EditMedicinePage.tsx` - Edit medicine form
12. `/components/GuardiansPage.tsx` - Guardian management
13. `/components/GuardianViewPage.tsx` - Guardian view of patient data
14. `/components/SettingsPage.tsx` - App settings
15. `/components/ProfilePage.tsx` - User profile
16. `/components/AlarmScreen.tsx` - Full-screen medication alarm

### Reusable Components
17. `/components/MedicineCard.tsx` - Medicine display card
18. `/components/MedicineListCard.tsx` - Extracted from MedicineListPage
19. `/components/ScheduleMedicineItem.tsx` - Extracted from MedicineListPage
20. `/components/HistoryMedicineCard.tsx` - History item card
21. `/components/HistorySearchFilter.tsx` - History search/filter
22. `/components/HistoryFilterChips.tsx` - Filter chips
23. `/components/HistoryEmptyState.tsx` - Empty state for history
24. `/components/ActiveGuardianCard.tsx` - Active guardian display
25. `/components/PendingInviteCard.tsx` - Pending guardian invite
26. `/components/ReceivedInvitationCard.tsx` - Received invitation
27. `/components/GuardianInfoCard.tsx` - Guardian information
28. `/components/GuardianSectionHeader.tsx` - Section headers
29. `/components/InviteGuardianButton.tsx` - Invite button
30. `/components/PrivacyNoteCard.tsx` - Privacy notice
31. `/components/AdBanner.tsx` - Advertisement banner
32. `/components/InAppAdvertise.tsx` - In-app ads
33. `/components/SharedHeader.tsx` - Shared page header
34. `/components/ScheduleWeekNavigator.tsx` - Week navigation
35. `/components/ScheduleDateSelector.tsx` - Date selector
36. `/components/TimePicker.tsx` - Time picker component
37. `/components/LanguageContext.tsx` - Language context provider

## 🎨 DESIGN SYSTEM

### Color Palette (Updated)
**Primary:** Sky/Blue tones
- `sky-50` to `sky-950`
- `blue-50` to `blue-950`

**Neutral:** Gray tones
- `gray-50` to `gray-950`
- `stone-*` for subtle variations

**Semantic Colors:**
- Success: `green-*`
- Error: `red-*`
- Warning: Previously `amber-*` → NOW use `sky-*` or `yellow-*` (case by case)

### Typography Tokens
Defined in `/styles/globals.css` - DO NOT override with Tailwind classes

### Component Patterns
- Bottom navigation with 4 tabs
- Card-based content layout
- Full-width buttons for primary actions
- Badge components for status indicators
- Modal/Sheet for secondary actions

## 🔥 FIREBASE INTEGRATION PLAN

### Phase 1: Setup (✅ Completed)
- Created `/lib/firebase/` structure
- Created TypeScript interfaces
- Created custom React hooks
- Created README documentation

### Phase 2: Component Integration (🚧 In Progress)
**Approach:**
1. Add Firebase imports to components
2. Keep existing mock data initially
3. Add commented-out Firebase hooks
4. Test with Firebase config
5. Switch from mock to real data with user approval

**Priority Components for Firebase:**
1. LoginPage / SignUpPage (Authentication)
2. HomePage (Medicine list, reminders)
3. MedicineListPage (Medicine CRUD)
4. GuardiansPage (Guardian relationships)
5. SettingsPage (User settings)

### Phase 3: Data Migration (⏳ Pending)
- User approval required before removing mock data
- Gradual transition per component
- Maintain backward compatibility

## 🚀 WHEN MAKING CHANGES

### Before You Start:
1. ✅ Read this entire document
2. ✅ Check if file is in "Protected" or "Existing Components" list
3. ✅ Verify you have explicit permission
4. ✅ Understand the color scheme migration status
5. ✅ Check for user code selection

### During Development:
1. ✅ Make minimal changes
2. ✅ Preserve existing structure
3. ✅ Use blue color scheme for new code
4. ✅ Test Korean and English languages
5. ✅ Keep accessibility in mind (elderly users)

### After Changes:
1. ✅ Verify no unintended modifications
2. ✅ Check color consistency
3. ✅ Confirm layout preserved
4. ✅ Test in context of full app

## 📞 WHEN TO ASK FOR PERMISSION

**Always Ask Before:**
- Modifying any component structure
- Changing Tailwind classes in existing components
- Removing or adding HTML elements
- Refactoring working code
- Changing component props/interfaces
- Updating color classes (unless part of approved migration)
- Integrating Firebase hooks into components
- Removing mock data

**You Can Proceed Without Asking:**
- Adding new files in `/lib/`
- Creating new components (not modifying existing)
- Fixing TypeScript errors
- Adding comments
- Updating Firebase configuration
- Making changes to code explicitly selected by user

## ⚠️ COMMON MISTAKES TO AVOID

1. **"I'll just refactor this while I'm here"** → ❌ NO
2. **"This code could be cleaner"** → ❌ DON'T
3. **"Let me update all components at once"** → ❌ STOP
4. **"I'll remove this mock data since we have Firebase"** → ❌ WAIT
5. **"These colors should all be blue now"** → ❌ ASK FIRST
6. **"Let me add this helpful feature"** → ❌ GET PERMISSION

## 📚 REFERENCE

### Key Files to Review:

**Project Overview:**
- `/PROJECT-README.md` - Complete project structure and overview

**Firebase & Backend:**
- `/lib/README.md` - Firebase integration overview
- `/lib/AUTHENTICATION-GUIDE.md` - Complete authentication guide
- `/lib/CARE-RECIPIENT-GUIDE.md` - Guardian/care recipient functionality
- `/lib/HOOKS-REFERENCE.md` - All React hooks quick reference
- `/lib/DATA-MODELS.md` - TypeScript interfaces explained
- `/lib/MIGRATION-GUIDE.md` - Mock data to Firebase migration

**Design & Frontend:**
- `/styles/globals.css` - Design tokens and typography
- `/components/LanguageContext.tsx` - i18n patterns

**Development Guidelines:**
- `/guidelines/AI-AGENT-RULES.md` - This file (development rules)
- `/guidelines/Guidelines.md` - Additional guidelines

### External Resources:
- Firebase Documentation: https://firebase.google.com/docs
- ShadCN UI: https://ui.shadcn.com
- Tailwind CSS v4: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

## 🎯 SUMMARY

**The Golden Rule:**
> "When in doubt, DON'T change it. Ask the user first."

**The Primary Mission:**
> "Integrate Firebase authentication and database WITHOUT breaking existing Figma-designed UI/UX."

**The Sacred Principle:**
> "This app was carefully designed for elderly Korean users. Respect that design."

---

**Last Updated:** November 2, 2025
**Maintained By:** Development Team
**For Questions:** Ask the human user before proceeding with uncertain changes
