# Medication Status - Quick Reference Card

## 🎯 For Developers

### Status Flow Chart
```
Current Time vs Scheduled Time
│
├─ Has takenAt timestamp? ───────────────────► TAKEN ✅
│
├─ More than 30 mins before? ────────────────► UPCOMING ⏰
│
├─ Within 30 mins before to 2 hrs after? ────► PENDING 🔔
│
└─ More than 2 hours after? ─────────────────► MISSED/OVERDUE ⚠️
```

---

## 📋 Quick Implementation

### Using the Status Calculator

```typescript
import { 
  calculateMedicineStatus, 
  type MedicineSchedule 
} from './MedicineStatusHelpers';

// Create medicine object
const medicine: MedicineSchedule = {
  id: 'med-123',
  name: 'Aspirin',
  time: '14:00',        // 24-hour format: HH:MM
  dosage: '75mg',
  period: 'afternoon',
  takenAt: undefined    // or Date if taken
};

// Calculate status
const status = calculateMedicineStatus(
  medicine,
  new Date(),          // Target date
  new Date()           // Current time
);

// Returns: 'upcoming' | 'pending' | 'missed' | 'taken'
```

---

## 🏠 Home Screen vs 📅 Schedule Screen

| Feature | Home Screen | Schedule Screen |
|---------|-------------|-----------------|
| **Logic** | MedicineStatusHelpers | MedicineStatusHelpers |
| **Update** | Every 60 seconds | Every 60 seconds |
| **Label** | "Overdue" | "Missed" |
| **Time** | 12-hour (AM/PM) | 24-hour (HH:MM) |

---

## ⚙️ Time Windows (Default)

```typescript
const DEFAULT_CONFIG = {
  pendingWindowBefore: 30,   // mins before = pending
  pendingWindowAfter: 120,   // mins after = pending
};
```

### Example Timeline (12:00 PM medicine)
```
09:00 AM ───► UPCOMING
11:30 AM ───► PENDING STARTS (30 mins before)
12:00 PM ───► SCHEDULED TIME
12:30 PM ───► Still PENDING
01:59 PM ───► Still PENDING
02:01 PM ───► MISSED/OVERDUE (2 hours passed)
```

---

## 🔄 Status Display Mapping

```typescript
// Internal status from MedicineStatusHelpers
const internalStatus = calculateMedicineStatus(...);

// Display on Home Screen
const homeDisplay = internalStatus === 'missed' 
  ? 'overdue'   // More user-friendly
  : internalStatus;

// Display on Schedule Screen  
const scheduleDisplay = internalStatus; // Use as-is
```

---

## 📝 Common Patterns

### 1. Get Status for Today
```typescript
const today = new Date();
const status = calculateMedicineStatus(medicine, today);
```

### 2. Get Status for Specific Date
```typescript
const targetDate = new Date('2025-11-10');
const status = calculateMedicineStatus(medicine, targetDate);
```

### 3. Check if Missed
```typescript
const isMissed = status === 'missed';
```

### 4. Handle As-Needed Medications
```typescript
if (medicine.asNeeded) {
  return 'as-needed'; // Don't calculate time-based status
}
```

### 5. Auto-Update Component
```typescript
const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // Every minute
  
  return () => clearInterval(timer);
}, []);

// Use currentTime in calculations
const status = calculateMedicineStatus(medicine, today, currentTime);
```

---

## 🎨 Status Badge Colors

```typescript
const statusColors = {
  taken: 'bg-brand-accent text-white',        // Green
  pending: 'bg-brand-primary text-white',     // Blue (pulse)
  overdue: 'bg-brand-light text-red-700',     // Pink/Coral
  upcoming: 'bg-gray-100 text-gray-700',      // Gray
};
```

---

## 🚫 Don't Do This

```typescript
// ❌ DON'T hardcode status
const medicine = {
  status: 'overdue' // Bad! Calculate dynamically
};

// ❌ DON'T use string timestamps
takenAt: '08:15 AM' // Bad! Use Date object

// ❌ DON'T forget as-needed check
if (medicine.asNeeded) {
  // Must handle separately
}
```

---

## ✅ Do This Instead

```typescript
// ✅ Calculate status dynamically
const status = calculateMedicineStatus(medicine, targetDate, currentTime);

// ✅ Use Date objects
takenAt: new Date()

// ✅ Handle as-needed medications
if (medicine.asNeeded) {
  return { ...medicine, status: 'as-needed' };
}
```

---

## 🐛 Debugging

### Check Status Calculation
```typescript
console.log({
  scheduledTime: medicine.time,
  currentTime: new Date().toLocaleTimeString(),
  targetDate: targetDate.toLocaleDateString(),
  takenAt: medicine.takenAt,
  calculatedStatus: calculateMedicineStatus(medicine, targetDate),
});
```

### Verify Time Windows
```typescript
import { StatusConfig } from './MedicineStatusHelpers';

const customConfig: StatusConfig = {
  pendingWindowBefore: 15,  // Test with 15 mins
  pendingWindowAfter: 60,   // Test with 1 hour
};

const status = calculateMedicineStatus(
  medicine, 
  targetDate, 
  currentTime,
  customConfig
);
```

---

## 📚 Related Files

- **Core Logic**: `components/MedicineStatusHelpers.ts`
- **Home Integration**: `components/HomePageHelpers.ts`
- **Home UI**: `components/HomePage.tsx`
- **Schedule UI**: `components/SchedulePage.tsx`
- **Card Display**: `components/MedicineCard.tsx`
- **Full Docs**: `components/MEDICINE-STATUS-LOGIC.md`

---

## 💡 Tips

1. **Always pass currentTime** - Enables real-time updates
2. **Use 24-hour format internally** - Easier calculations (HH:MM)
3. **Map status for display** - Different labels for different contexts
4. **Handle as-needed separately** - No time-based status needed
5. **Test with different times** - Change device clock to verify

---

## 🎓 Example: Full Implementation

```typescript
import { useState, useEffect } from 'react';
import { calculateMedicineStatus, type MedicineSchedule } from './MedicineStatusHelpers';

function MedicineList() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Auto-update every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  const medicines: MedicineSchedule[] = [
    {
      id: '1',
      name: 'Aspirin',
      time: '08:00',
      dosage: '75mg',
      period: 'morning',
    },
  ];
  
  const medicinesWithStatus = medicines.map(med => ({
    ...med,
    status: calculateMedicineStatus(med, new Date(), currentTime)
  }));
  
  return (
    <div>
      {medicinesWithStatus.map(med => (
        <MedicineCard 
          key={med.id} 
          medicine={med}
          status={med.status}
        />
      ))}
    </div>
  );
}
```

---

**Remember**: One source of truth, consistent everywhere! 🎯
