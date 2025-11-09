# Firebase Configuration Checklist

Follow this before editing `src/lib/firebase/config.ts` to keep secrets out of the repo and stay aligned with `PROJECT-README.md`, `/lib/README.md`, and `/guidelines/AI-AGENT-RULES.md`.

## 1. Gather Credentials
- Open **Firebase Console → Project Settings → General → Your apps (Web)**.
- Copy the full config object (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, optional `measurementId`).
- Never commit real keys. Store them in `.env.local` (ignored by Git) or your secrets manager.

## 2. Provide Local Environment Values
1. Create `.env.local` (or use your preferred secret store) with:
   ```bash
   VITE_FIREBASE_API_KEY="PASTE_FROM_CONSOLE"
   VITE_FIREBASE_AUTH_DOMAIN="project-id.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="project-id"
   VITE_FIREBASE_STORAGE_BUCKET="project-id.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
   VITE_FIREBASE_APP_ID="1:1234567890:web:abc123"
   VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXX" # optional
   ```
2. Reference the variables inside `src/lib/firebase/config.ts` using `import.meta.env.VITE_FIREBASE_*` so the repo keeps placeholders only.

## 3. Local Verification
- Run `npm run dev` and ensure Firebase initializes without console errors.
- Test authentication (signup/signin), Firestore reads/writes, and Storage uploads using the new config.
- Confirm `firestore.rules` and `storage.rules` match the project (deploy via `firebase deploy --only firestore:rules,storage:rules`).

## 4. Deployment Notes
- For CI/CD, inject the same env vars via the platform’s secret manager (never commit them).
- Keep `README.md`/`PROJECT-README.md` references intact so other contributors know where configuration lives.

Use this checklist any time you switch Firebase projects or rotate credentials.
