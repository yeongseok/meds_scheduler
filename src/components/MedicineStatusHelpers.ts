/**
 * Medicine Status Helpers
 * Production-ready utilities for calculating medication status based on real-time
 */

export type MedicineStatus = 'taken' | 'missed' | 'pending' | 'upcoming';

export interface MedicineSchedule {
  id: string;
  name: string;
  time: string; // Format: "HH:MM" (24-hour)
  dosage: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  takenAt?: Date; // Timestamp when medication was marked as taken
}

export interface StatusConfig {
  pendingWindowBefore: number; // Minutes before scheduled time to show "pending"
  pendingWindowAfter: number; // Minutes after scheduled time before marking "missed"
}

const DEFAULT_CONFIG: StatusConfig = {
  pendingWindowBefore: 30, // 30 minutes before
  pendingWindowAfter: 120, // 2 hours after
};

/**
 * Parse time string (HH:MM) and create a Date object for a specific day
 */
function parseScheduledTime(timeStr: string, targetDate: Date): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const scheduledTime = new Date(targetDate);
  scheduledTime.setHours(hours, minutes, 0, 0);
  return scheduledTime;
}

/**
 * Calculate medication status based on current time and scheduled time
 */
export function calculateMedicineStatus(
  medicine: MedicineSchedule,
  targetDate: Date,
  currentTime: Date = new Date(),
  config: StatusConfig = DEFAULT_CONFIG
): MedicineStatus {
  // If medication was already taken, return 'taken'
  if (medicine.takenAt) {
    return 'taken';
  }

  // Parse the scheduled time for the target date
  const scheduledTime = parseScheduledTime(medicine.time, targetDate);
  
  // Calculate time difference in milliseconds
  const timeDiff = currentTime.getTime() - scheduledTime.getTime();
  const timeDiffMinutes = timeDiff / (1000 * 60);

  // For dates in the future, all medications are upcoming
  if (targetDate.toDateString() !== currentTime.toDateString()) {
    const isTargetFuture = targetDate.getTime() > currentTime.getTime();
    if (isTargetFuture) {
      return 'upcoming';
    }
    // For past dates, if not taken, it's missed
    return 'missed';
  }

  // For today, calculate status based on time windows
  
  // Check if it's before the pending window (still upcoming)
  if (timeDiffMinutes < -config.pendingWindowBefore) {
    return 'upcoming';
  }

  // Check if it's within the pending window (time to take)
  if (timeDiffMinutes >= -config.pendingWindowBefore && timeDiffMinutes <= config.pendingWindowAfter) {
    return 'pending';
  }

  // If we're past the pending window and not taken, it's missed
  return 'missed';
}

/**
 * Calculate status for multiple medicines
 */
export function calculateScheduleStatus(
  medicines: MedicineSchedule[],
  targetDate: Date,
  currentTime: Date = new Date(),
  config?: StatusConfig
): Array<MedicineSchedule & { status: MedicineStatus }> {
  return medicines.map(medicine => ({
    ...medicine,
    status: calculateMedicineStatus(medicine, targetDate, currentTime, config),
  }));
}

/**
 * Check if any medication was missed on a specific date
 */
export function hasMissedMedications(
  medicines: MedicineSchedule[],
  targetDate: Date,
  currentTime: Date = new Date(),
  config?: StatusConfig
): boolean {
  const medicinesWithStatus = calculateScheduleStatus(medicines, targetDate, currentTime, config);
  return medicinesWithStatus.some(med => med.status === 'missed');
}

/**
 * Get summary counts for a list of medications
 */
export function getMedicationSummary(
  medicines: MedicineSchedule[],
  targetDate: Date,
  currentTime: Date = new Date(),
  config?: StatusConfig
): {
  total: number;
  taken: number;
  missed: number;
  pending: number;
  upcoming: number;
} {
  const medicinesWithStatus = calculateScheduleStatus(medicines, targetDate, currentTime, config);
  
  return {
    total: medicinesWithStatus.length,
    taken: medicinesWithStatus.filter(m => m.status === 'taken').length,
    missed: medicinesWithStatus.filter(m => m.status === 'missed').length,
    pending: medicinesWithStatus.filter(m => m.status === 'pending').length,
    upcoming: medicinesWithStatus.filter(m => m.status === 'upcoming').length,
  };
}

/**
 * Normalize date to start of day (00:00:00)
 */
export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}
