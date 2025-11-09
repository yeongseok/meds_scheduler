# Firebase / Firestore / Authentication To‑Do List

## Must Read / Reference
- Re-read `PROJECT-README.md`, `README.md`, `/guidelines/AI-AGENT-RULES.md`, `/lib/README.md`, `/lib/INDEX.md`, `/lib/AUTHENTICATION-GUIDE.md`, `/lib/HOOKS-REFERENCE.md`, `/lib/DATA-MODELS.md`, `/lib/MIGRATION-GUIDE.md` before touching any Firebase-linked code to stay aligned with the documented patterns and protected-component rules.

## Firebase & Firestore Infrastructure
- [ ] Verify Firebase project config in `/lib/firebase/config.ts` matches the environment being targeted; follow `firebase-config-checklist.md` to keep secrets out of source control.
- [x] Confirm Firestore security rules include sections for `users`, `medicines`, `doseRecords`, `guardians`, `invitations`, `settings`, and `medicinePermissionRequests` exactly as documented in `/lib/README.md` and `/PERMISSION-SYSTEM-PRODUCTION-READY.md`.
- [x] Deploy Firebase Storage rules covering both `/profile-photos/{userId}/` and `/medicine-photos/{userId}/` buckets (5 MB size cap, `image/*` MIME check).
- [ ] Create the four composite indexes listed in `/lib/PERMISSION-QUICK-REFERENCE.md` (see `firebase-indexes.md` for exact console steps) for the permission request queries.

## Authentication & Profile Security
- [ ] Ensure all profile editing flows use `reauthenticateUser()` (see `/lib/RECENT-UPDATES-SUMMARY.md` & `/PROFILE-AUTH-TEST.md`) before calling update functions.
- [ ] Add tests/scripts that exercise signup, signin, password reset, and reauthentication using the flows defined in `/lib/AUTHENTICATION-GUIDE.md`.
- [ ] Confirm `useAuth` consumers gate protected pages and show bilingual toasts as described in `PROJECT-README.md` (test in ko/en).

## Guardian Permission System
- [ ] Replace mock permission request data in `MedicinePermissionRequestsPage`, `MedicinePermissionRequestDialog`, `MedicinePermissionBadge`, and `GuardiansPage` with the production hooks (`useMedicinePermissionRequests`, `useCreateMedicinePermissionRequest`) while preserving Figma layouts (see `/PERMISSION-SYSTEM-PRODUCTION-READY.md` & `/components/GUARDIAN-PERMISSION-REQUEST-FLOW.md`).
- [ ] Wire `AddMedicineWizard`’s guardian flow to the real `createRequest` hook in all code paths, verifying success/error toasts respect the Korean/English text from `/TOAST-LANGUAGE-FIX.md`.
- [ ] After integration, run manual tests described in `/lib/MEDICINE-PERMISSION-REQUESTS-GUIDE.md` and `/lib/MEDICINE-PERMISSION-INTEGRATION-SUMMARY.md`.

## Care Recipient Monitoring
- [ ] Ensure guardian dashboards use `useCareRecipients`/`useRecipientMedicines` plus the permission-checked helpers from `/lib/CARE-RECIPIENT-GUIDE.md`; add tests covering permission denials.
- [ ] Validate bidirectional guardian relationships (`guardians` collection) stay in sync when approving/denying requests or revoking access.

## Media Uploads
- [ ] Confirm `ProfilePhotoCropDialog` and `MedicinePhotoCropDialog` flows upload via `uploadProfilePhoto` / `uploadMedicinePhoto`, enforce validation, and handle bilingual messaging per `/lib/PROFILE-PHOTO-UPLOAD.md` and `/lib/MEDICINE-PHOTO-UPLOAD.md`.
- [ ] Periodically audit Storage buckets for orphaned images and call the delete helpers when photos are replaced.

## Migration From Mock Data
- [ ] For each component listed in `/lib/MIGRATION-GUIDE.md` Phase 2 (LoginPage, HomePage, MedicineListPage, SchedulePage, GuardiansPage, GuardianViewPage, SettingsPage): add Firebase hooks alongside mock data, gate behind feature flags if needed, and keep mock fallbacks until user approval.
- [ ] Document migration progress in a changelog entry referencing the guide steps.

## Status Logic & Localization
- [ ] Keep all status calculations routed through `MedicineStatusHelpers.ts`; never hardcode status strings (follow `/components/STATUS-UNIFICATION-SUMMARY.md`).
- [ ] Double-check every toast, dialog, and CTA is bilingual, using either `useLanguage()` conditional strings or existing translation keys (per `/PROJECT-README.md` and `/TOAST-LANGUAGE-FIX.md`).

## General Compliance
- [ ] Never modify Figma-designed components or color tokens without explicit approval (see `/guidelines/AI-AGENT-RULES.md`).
- [ ] When adding Firebase logic to UI components, retain existing structure, use semantic Tailwind tokens, and test in Korean + English as mandated in `PROJECT-README.md`.
