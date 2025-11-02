# Firebase & Integration To-Do List

## General Guidance
- [ ] Review `README.md`, `src/PROJECT-README.md`, and `src/guidelines/AI-AGENT-RULES.md` before each work session.
- [ ] Avoid modifying existing `/components` files without explicit user approval; keep mock data until the user confirms removal.
- [ ] Use the blue/sky/gray palette for any new styles; never reintroduce amber/orange classes.
- [ ] Preserve accessibility for elderly Korean users and maintain bilingual support via `useLanguage()`.

## Firebase Configuration
- [x] Register the Firebase web app and gather the configuration object (apiKey, authDomain, etc.).
- [x] Point `src/lib/firebase/config.ts` at Vite environment variables so credentials stay outside source control.
- [x] Add `VITE_FIREBASE_*` entries to a git-ignored `.env.local` (or similar) file with real project values.
- [ ] Enable App Check, email verification, and other recommended Firebase security features once infrastructure is stable.

## Authentication
- [ ] Connect existing authentication UI (Login, Sign Up, Forgot Password) to functions in `src/lib/firebase/auth.ts` while keeping mock flows until approved. *(Login wired; Sign Up & Forgot Password pending)*
- [ ] Verify email/password sign-in and optional Google provider work through Firebase Auth.
- [ ] Ensure `useAuth` hook surfaces Firebase-backed user/session data without breaking current component layouts.
- [ ] Confirm localization strings and accessibility cues remain intact after wiring up Firebase responses.

## Firestore Database
- [ ] Validate Firestore security rules listed in `src/lib/README.md` inside the Firebase console or emulator.
- [ ] Gradually migrate mock medicine, guardian, and dose data to Firestore reads/writes, guarding existing behavior with feature flags or fallbacks.
- [ ] Implement listener-based updates (`realtime: true`) only after verifying performance and accessibility implications.
- [ ] Document any new collections or schema changes in `src/lib/types/index.ts` and update related hooks as needed.

## Hooks & Business Logic
- [ ] Enhance hooks in `src/lib/hooks` to support Firebase-backed operations while preserving current signatures.
- [ ] Add error-handling and loading states that match existing UI expectations without altering component structure.
- [ ] Introduce unit or integration tests for hook logic where feasible, keeping test assets separate from production code.

## Guardians & Invitations
- [ ] Wire guardian management flows to Firestore (`guardians`, `invitations` collections) using the provided service functions.
- [ ] Maintain the current UI for pending/active invitations, only swapping data sources when parity with mock data is confirmed.
- [ ] Confirm guardians can read relevant user data while respecting security rules (userId or guardianId ownership).

## Dose Tracking & Scheduling
- [ ] Persist dose records through Firestore functions (`addDoseRecord`, `markDoseAsTaken`, `getDoseRecords`).
- [ ] Ensure scheduling logic respects Korean/English localization and large-touch-target requirements.
- [ ] Validate that notification or alarm placeholders align with planned real-time features before expanding functionality.

## Testing & Verification
- [ ] Use the Firebase emulator suite for local testing to avoid production data changes.
- [ ] Manually validate flows in Korean and English, on mobile viewport sizes (375–428px), and check the blue color scheme adherence.
- [ ] Keep a log of verified scenarios and outstanding gaps for future QA passes.
