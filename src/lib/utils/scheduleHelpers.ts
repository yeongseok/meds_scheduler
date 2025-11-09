// Schedule and Home Page Helper Functions

import { Medicine, DoseRecord } from '../types';

/**
 * Parse time string to minutes since midnight
 * Supports both 12-hour (08:00 AM) and 24-hour (08:00) formats
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  
  // Handle "필요시" or "As needed" for as-needed medications
  if (timeStr.includes('필요') || timeStr.toLowerCase().includes('needed')) {
    return -1; // Put as-needed meds at the top of the list
  }
  
  // Try 12-hour format first
  const match12 = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match12) {
    let hours = parseInt(match12[1]);
    const minutes = parseInt(match12[2]);
    const period = match12[3].toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  }
  
  // Try 24-hour format
  const match24 = timeStr.match(/(\d+):(\d+)/);
  if (match24) {
    const hours = parseInt(match24[1]);
    const minutes = parseInt(match24[2]);
    return hours * 60 + minutes;
  }
  
  return 0;
};

/**
 * Convert time string to 24-hour format (HH:MM)
 */
export const parseTimeTo24Hour = (timeStr: string): string => {
  if (!timeStr) return '00:00';
  
  // Handle "필요시" or "As needed" 
  if (timeStr.includes('필요') || timeStr.toLowerCase().includes('needed')) {
    return '00:00'; // Default time for as-needed
  }
  
  // Already in 24-hour format
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr;
  }
  
  // Convert from 12-hour format
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '00:00';
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Convert 24-hour time to 12-hour format with localization
 */
export const formatTimeTo12Hour = (time24: string, language: 'ko' | 'en' = 'ko'): string => {
  const [hoursStr, minutesStr] = time24.split(':');
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);
  
  const period = hours < 12 ? (language === 'ko' ? '오전' : 'AM') : (language === 'ko' ? '오후' : 'PM');
  const displayHours = hours % 12 || 12;
  
  return `${language === 'ko' ? period + ' ' : ''}${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${language === 'ko' ? '' : ' ' + period}`;
};

/**
 * Calculate medicine status based on scheduled time and current time
 * @param scheduledTime - Time in 24-hour format (HH:MM)
 * @param currentTime - Current date/time
 * @param takenAt - When the dose was taken (if taken)
 * @returns Status: 'pending', 'upcoming', 'overdue', 'taken'
 */
export const calculateDoseStatus = (
  scheduledTime: string,
  currentTime: Date = new Date(),
  takenAt?: Date
): 'pending' | 'upcoming' | 'overdue' | 'taken' | 'as-needed' => {
  // If already taken, return taken status
  if (takenAt) return 'taken';
  
  // Parse scheduled time
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  
  // Get current time in minutes
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const scheduledMinutes = hours * 60 + minutes;
  
  // Calculate difference
  const diffMinutes = currentMinutes - scheduledMinutes;
  
  // Status rules:
  // - Upcoming: more than 30 minutes before scheduled time
  // - Pending: within 30 minutes of scheduled time (before or up to 15 mins after)
  // - Overdue: more than 15 minutes after scheduled time
  
  if (diffMinutes < -30) {
    return 'upcoming';
  } else if (diffMinutes >= -30 && diffMinutes <= 15) {
    return 'pending';
  } else {
    return 'overdue';
  }
};

/**
 * Expand medicines with multiple daily doses into individual dose items
 * Each dose gets its own calculated status
 */
export interface ExpandedDose extends Medicine {
  doseTime: string; // The specific time for this dose (24-hour format)
  doseTimeFormatted: string; // Formatted time for display
  doseIndex: number; // Index of this dose (0-based)
  totalDoses: number; // Total number of doses per day
  doseStatus: 'pending' | 'upcoming' | 'overdue' | 'taken' | 'as-needed';
  originalMedicineId: string; // Original medicine ID
  doseId: string; // Unique ID for this specific dose
}

export const expandMedicineDoses = (
  medicines: Medicine[],
  currentTime: Date = new Date(),
  language: 'ko' | 'en' = 'ko'
): ExpandedDose[] => {
  const expanded: ExpandedDose[] = [];
  
  medicines.forEach(medicine => {
    // Check if medicine has times array
    if (!medicine.times || medicine.times.length === 0) {
      // No schedule, treat as as-needed
      expanded.push({
        ...medicine,
        doseTime: '00:00',
        doseTimeFormatted: language === 'ko' ? '필요시' : 'As needed',
        doseIndex: 0,
        totalDoses: 1,
        doseStatus: 'as-needed',
        originalMedicineId: medicine.id,
        doseId: `${medicine.id}-dose-0`
      });
      return;
    }
    
    // Expand each scheduled time into a separate dose
    medicine.times.forEach((timeStr, index) => {
      const time24 = parseTimeTo24Hour(timeStr);
      const doseStatus = calculateDoseStatus(time24, currentTime);
      
      expanded.push({
        ...medicine,
        doseTime: time24,
        doseTimeFormatted: formatTimeTo12Hour(time24, language),
        doseIndex: index,
        totalDoses: medicine.times.length,
        doseStatus,
        originalMedicineId: medicine.id,
        doseId: `${medicine.id}-dose-${index}`
      });
    });
  });
  
  return expanded;
};

/**
 * Filter dose records for today for a specific medicine
 */
export const filterTodayDoseRecords = (
  medicineId: string,
  doseRecords: DoseRecord[]
): DoseRecord[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return doseRecords.filter(record => {
    if (record.medicineId !== medicineId) return false;
    
    const recordDate = new Date(record.scheduledDate);
    return recordDate >= today && recordDate < tomorrow;
  });
};

/**
 * Check if a specific dose has been taken today
 */
export const isDoseTakenToday = (
  medicineId: string,
  scheduledTime: string,
  doseRecords: DoseRecord[]
): { taken: boolean; record?: DoseRecord } => {
  const todayRecords = filterTodayDoseRecords(medicineId, doseRecords);
  
  const record = todayRecords.find(r => 
    r.scheduledTime === scheduledTime && r.status === 'taken'
  );
  
  return { taken: !!record, record };
};

/**
 * Group doses by time for display with time headers
 */
export interface DoseGroup {
  time: string;
  timeFormatted: string;
  doses: ExpandedDose[];
}

export const groupDosesByTime = (
  doses: ExpandedDose[],
  language: 'ko' | 'en' = 'ko'
): DoseGroup[] => {
  // Separate overdue doses
  const overdueDoses = doses.filter(d => d.doseStatus === 'overdue');
  const scheduledDoses = doses.filter(d => d.doseStatus !== 'overdue');
  
  // Sort scheduled doses by time
  scheduledDoses.sort((a, b) => {
    const aMinutes = parseTimeToMinutes(a.doseTime);
    const bMinutes = parseTimeToMinutes(b.doseTime);
    return aMinutes - bMinutes;
  });
  
  const groups: DoseGroup[] = [];
  
  // Add overdue group if there are overdue doses
  if (overdueDoses.length > 0) {
    groups.push({
      time: 'overdue',
      timeFormatted: language === 'ko' ? '지연됨' : 'Overdue',
      doses: overdueDoses
    });
  }
  
  // Group scheduled doses by time
  let currentTime = '';
  let currentGroup: ExpandedDose[] = [];
  
  scheduledDoses.forEach(dose => {
    if (dose.doseTime !== currentTime) {
      if (currentGroup.length > 0) {
        groups.push({
          time: currentTime,
          timeFormatted: formatTimeTo12Hour(currentTime, language),
          doses: currentGroup
        });
      }
      currentTime = dose.doseTime;
      currentGroup = [dose];
    } else {
      currentGroup.push(dose);
    }
  });
  
  // Add last group
  if (currentGroup.length > 0) {
    groups.push({
      time: currentTime,
      timeFormatted: formatTimeTo12Hour(currentTime, language),
      doses: currentGroup
    });
  }
  
  return groups;
};

/**
 * Calculate today's status counts for a user
 */
export interface TodayStatus {
  total: number;
  taken: number;
  overdue: number;
  pending: number;
  upcoming: number;
}

export const calculateTodayStatus = (
  doses: ExpandedDose[],
  doseRecords: DoseRecord[]
): TodayStatus => {
  let taken = 0;
  let overdue = 0;
  let pending = 0;
  let upcoming = 0;
  
  doses.forEach(dose => {
    const { taken: isTaken } = isDoseTakenToday(
      dose.originalMedicineId,
      dose.doseTime,
      doseRecords
    );
    
    if (isTaken) {
      taken++;
    } else if (dose.doseStatus === 'overdue') {
      overdue++;
    } else if (dose.doseStatus === 'pending') {
      pending++;
    } else if (dose.doseStatus === 'upcoming') {
      upcoming++;
    }
  });
  
  return {
    total: doses.length,
    taken,
    overdue,
    pending,
    upcoming
  };
};

/**
 * Generate schedule items for a specific date from medicines
 * Maps each medicine time to a schedule item with calculated status
 */
export interface ScheduleItem {
  id: string;
  name: string;
  time: string;
  dosage: string;
  status: 'taken' | 'missed' | 'pending' | 'upcoming';
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  takenAt?: Date;
}

export const generateScheduleForDate = (
  medicines: Medicine[],
  targetDate: Date,
  doseRecords: DoseRecord[],
  currentTime: Date = new Date()
): ScheduleItem[] => {
  const scheduleItems: ScheduleItem[] = [];
  
  // Check if target date is today
  const isToday = targetDate.toDateString() === new Date().toDateString();
  
  medicines.forEach(medicine => {
    // Skip medicines without schedule
    if (!medicine.times || medicine.times.length === 0) return;
    
    // For each scheduled time, create a schedule item
    medicine.times.forEach((timeStr, index) => {
      const time24 = parseTimeTo24Hour(timeStr);
      const [hours] = time24.split(':').map(Number);
      
      // Determine period
      let period: 'morning' | 'afternoon' | 'evening' | 'night';
      if (hours < 12) period = 'morning';
      else if (hours < 17) period = 'afternoon';
      else if (hours < 21) period = 'evening';
      else period = 'night';
      
      // Find dose record for this medicine + time + date
      const record = doseRecords.find(r => {
        if (r.medicineId !== medicine.id) return false;
        if (r.scheduledTime !== time24) return false;
        
        const recordDate = new Date(r.scheduledDate);
        return recordDate.toDateString() === targetDate.toDateString();
      });
      
      // Calculate status
      let status: 'taken' | 'missed' | 'pending' | 'upcoming';
      let takenAt: Date | undefined;
      
      if (record) {
        if (record.status === 'taken') {
          status = 'taken';
          takenAt = record.takenAt;
        } else if (record.status === 'missed' || record.status === 'skipped') {
          status = 'missed';
        } else {
          // Pending record - calculate status based on time
          if (isToday) {
            const doseStatus = calculateDoseStatus(time24, currentTime);
            status = doseStatus === 'overdue' ? 'missed' : doseStatus === 'upcoming' ? 'upcoming' : 'pending';
          } else {
            status = 'pending';
          }
        }
      } else {
        // No record - calculate status
        if (isToday) {
          const doseStatus = calculateDoseStatus(time24, currentTime);
          status = doseStatus === 'overdue' ? 'missed' : doseStatus === 'upcoming' ? 'upcoming' : 'pending';
        } else if (targetDate < new Date()) {
          // Past date with no record = missed
          status = 'missed';
        } else {
          // Future date = upcoming
          status = 'upcoming';
        }
      }
      
      scheduleItems.push({
        id: `${medicine.id}-${index}`,
        name: medicine.name,
        time: time24,
        dosage: medicine.dosage,
        status,
        period,
        takenAt
      });
    });
  });
  
  // Sort by time
  scheduleItems.sort((a, b) => {
    const aMinutes = parseTimeToMinutes(a.time);
    const bMinutes = parseTimeToMinutes(b.time);
    return aMinutes - bMinutes;
  });
  
  return scheduleItems;
};

/**
 * Check if a date has any missed medications
 */
export const hasMissedMedicationsOnDate = (
  medicines: Medicine[],
  targetDate: Date,
  doseRecords: DoseRecord[],
  currentTime: Date = new Date()
): boolean => {
  const schedule = generateScheduleForDate(medicines, targetDate, doseRecords, currentTime);
  return schedule.some(item => item.status === 'missed');
};
