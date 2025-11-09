# Firestore Composite Index Setup

The guardian medicine permission flow relies on four composite indexes so Firestore queries against `medicinePermissionRequests` stay under index limits. Follow these steps in the Firebase Console to create them in your project (all instructions follow `PROJECT-README.md` and `/lib` docs).

## Steps (repeat for each index)
1. Open **Firebase Console → Firestore Database → Indexes**.
2. Click **Add index** under the *Composite indexes* section.
3. Set **Collection ID** to `medicinePermissionRequests`.
4. Add the fields and sort orders exactly as shown in the table below.
5. Leave **Query scope** as *Collection*.
6. Click **Create index** and wait for Firestore to finish building it (a few minutes).

## Required Indexes

| # | Fields (in order) | Purpose |
|---|-------------------|---------|
| 1 | `careRecipientId` Asc, `requestedAt` Desc | Care recipient inbox ordered by newest |
| 2 | `careRecipientId` Asc, `status` Asc, `requestedAt` Desc | Care recipient filtered views (pending/approved/denied) |
| 3 | `guardianId` Asc, `requestedAt` Desc | Guardian “sent requests” list ordered by newest |
| 4 | `guardianId` Asc, `status` Asc, `requestedAt` Desc | Guardian filtered views (pending/approved/denied) |

## Notes
- Keep all field names and sort orders exactly as defined above; Firestore treats different ordering as separate indexes.
- If you run a query before an index exists, Firestore logs an error with a direct “Create index” link—use it if you prefer.
- Re-run the queries once the indexes finish building to confirm there are no `FAILED_PRECONDITION` errors.
- Documented originally in `/lib/PERMISSION-QUICK-REFERENCE.md`; this file provides the explicit console steps to keep the repo aligned with the guidelines in `PROJECT-README.md`.
