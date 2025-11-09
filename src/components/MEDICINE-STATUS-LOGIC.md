# Medicine Status Logic - Production Ready

## Overview
The medication status system uses **unified real-time calculation** across both Home and Schedule screens. Status is determined dynamically based on the current system time and scheduled medication times.

## Unified Implementation ✅
**Both screens now use the same production logic:**
- Home Screen: Pills/cards on the main screen
- Schedule Screen: Weekly/monthly medication calendar
- **Single source of truth**: `MedicineStatusHelpers.ts`

## Status Types

### 1. **Taken** ✅
- **Condition**: Medication has a `takenAt` timestamp
- **Meaning**: User has marked this medication as taken
- **Display**: 
  - Home: Green checkmark badge
  - Schedule: Green checkmark badge

### 2. **Pending** 🔔
- **Condition**: Current time is within the "take now" window
- **Time Window**: 30 minutes before scheduled time → 2 hours after scheduled time
- **Meaning**: It's time to take this medication
- **Display**: 
  - Home: Pulsing blue badge with bell icon
  - Schedule: Pulsing blue badge with bell icon

### 3. **Overdue/Missed** ⚠️
- **Condition**: Current time is more than 2 hours past scheduled time AND medication not taken
- **Internal Status**: `missed` (in MedicineStatusHelpers)
- **Display Label**: 
  - Home: "Overdue" (more familiar to users, Korean: "지연됨")
  - Schedule: "Missed" (Korean: "놓침")
- **Meaning**: User missed the 2-hour grace period
- **Display**: Pink/coral badge with warning icon

### 4. **Upcoming** ⏰
- **Condition**: Current time is more than 30 minutes before scheduled time
- **Meaning**: Medication is scheduled for later
- **Display**: Gray badge with clock icon

## Time Windows (Configurable)

Default configuration in `MedicineStatusHelpers.ts`:
```typescript
const DEFAULT_CONFIG = {
  pendingWindowBefore: 30,  // 30 minutes before
  pendingWindowAfter: 120,  // 2 hours after
};
```

## Example Timeline

For a medication scheduled at **12:00 PM**:

| Time | Status | Reason |
|------|--------|--------|
| 10:00 AM | Upcoming | More than 30 mins before |
| 11:20 AM | Upcoming | Still more than 30 mins before |
| 11:31 AM | **Pending** | Within 30 min window before |
| 12:00 PM | **Pending** | Exact scheduled time |
| 1:30 PM | **Pending** | Within 2 hour window after |
| 2:01 PM | **Missed** | More than 2 hours after, not taken |

If taken at any point → Status becomes **Taken**

## Auto-Update Feature

The system automatically updates every minute:
```typescript
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // Update every minute
  return () => clearInterval(timer);
}, []);
```

This ensures:
- Upcoming medications become Pending at the right time
- Pending medications become Missed if not taken
- Status reflects real-time without page refresh

## Implementation Files

1. **`MedicineStatusHelpers.ts`** - Core calculation logic (shared)
   - `calculateMedicineStatus()` - Single medication
   - `calculateScheduleStatus()` - Multiple medications
   - `hasMissedMedications()` - Check for missed doses
   - `getMedicationSummary()` - Summary counts

2. **`HomePageHelpers.ts`** - Home screen integration
   - Uses `MedicineStatusHelpers` for status calculation
   - `expandMedicineDoses()` - Expands multi-dose medications
   - Maps `missed` → `overdue` for display
   - Parses 12-hour time format to 24-hour

3. **`HomePage.tsx`** - Home screen UI
   - Real-time updates via `currentTime` state
   - Auto-refresh every minute
   - Status displayed on medicine cards
   - Handles taken/skip/undo actions

4. **`SchedulePage.tsx`** - Schedule screen UI
   - Real-time updates via `currentTime` state
   - Dynamic status calculation via `getScheduleForDay()`
   - Missed dose indicators on calendar dates
   - Weekly/monthly view support

## Future Integration

For backend integration with Supabase/Firebase:
1. Store `takenAt` timestamps in database
2. Fetch medication schedules from database
3. Keep calculation logic the same
4. Add real-time listeners for cross-device sync

## Testing

To test different scenarios:
1. **Change device time** - Status will update based on system clock
2. **Wait 1 minute** - Auto-update will trigger
3. **Add `takenAt` timestamp** - Status changes to "Taken"
4. **Remove `takenAt`** - Status recalculates based on time

## Production Checklist

✅ Time-based status calculation
✅ Configurable time windows (30 min before, 2 hours after)
✅ Auto-update every minute on both screens
✅ Handles past/present/future dates
✅ Supports "taken" tracking via timestamps
✅ Missed dose indicators on calendar
✅ Type-safe implementation
✅ Reusable helper functions
✅ **Unified logic across Home and Schedule screens**
✅ Display label mapping (missed → overdue for Home)
✅ Multi-dose medication support
✅ As-needed medication handling
