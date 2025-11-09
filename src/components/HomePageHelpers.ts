// Helper functions and data generators for HomePage
// Extracted to avoid recreation on each render

import { calculateMedicineStatus, type MedicineSchedule } from './MedicineStatusHelpers';

/**
 * PRODUCTION-READY STATUS LOGIC
 * Now uses MedicineStatusHelpers.ts for consistent status calculation
 * across Home and Schedule screens
 */

// Parse time string (12-hour format) to 24-hour format for scheduling
const parseTimeTo24Hour = (timeStr: string): string => {
  if (!timeStr) return '00:00';
  
  // Handle "필요시" or "As needed" 
  if (timeStr.includes('필요') || timeStr.toLowerCase().includes('needed')) {
    return '00:00'; // Default time for as-needed
  }
  
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

// Determine status for a specific dose using production logic
const getDoseStatus = (timeStr: string, takenAt?: Date, currentTime: Date = new Date()): string => {
  const time24 = parseTimeTo24Hour(timeStr);
  const today = new Date();
  
  const medicineSchedule: MedicineSchedule = {
    id: 'temp',
    name: 'temp',
    time: time24,
    dosage: 'temp',
    period: 'morning',
    takenAt: takenAt
  };
  
  const status = calculateMedicineStatus(medicineSchedule, today, currentTime);
  
  // Map "missed" to "overdue" for Home screen display
  return status === 'missed' ? 'overdue' : status;
};

// Expand medicines with multiple doses per day into separate dose cards
// Now uses production-ready status calculation
export const expandMedicineDoses = (medicines: any[], currentTime: Date = new Date()): any[] => {
  const expanded: any[] = [];
  
  medicines.forEach(medicine => {
    // As-needed medications don't have time-based status
    if (medicine.asNeeded) {
      expanded.push({
        ...medicine,
        status: medicine.takenAt ? 'taken' : 'as-needed',
        originalId: medicine.id,
        doseIndex: 0,
        totalDoses: 1
      });
      return;
    }

    // If medicine has multiple times, create a card for each time
    if (medicine.times && medicine.times.length > 1) {
      medicine.times.forEach((time: string, index: number) => {
        const doseStatus = getDoseStatus(time, medicine.takenAt, currentTime);
        expanded.push({
          ...medicine,
          id: `${medicine.id}-dose-${index}`,
          originalId: medicine.id,
          time: time,
          status: doseStatus,
          doseIndex: index,
          totalDoses: medicine.times.length
        });
      });
    } else {
      // Single dose medicine - calculate status based on current time
      const timeStr = medicine.times?.[0] || medicine.time;
      const doseStatus = getDoseStatus(timeStr, medicine.takenAt, currentTime);
      expanded.push({
        ...medicine,
        status: doseStatus,
        originalId: medicine.id,
        doseIndex: 0,
        totalDoses: 1
      });
    }
  });
  
  return expanded;
};

export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  
  // Handle "필요시" or "As needed" for as-needed medications
  if (timeStr.includes('필요') || timeStr.toLowerCase().includes('needed')) {
    return -1; // Put as-needed meds at the top of the list
  }
  
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
};

// Helper to create takenAt timestamp for demo purposes
const createTakenTimestamp = (timeStr: string, minutesOffset: number = 5): Date => {
  const time24 = parseTimeTo24Hour(timeStr);
  const [hours, minutes] = time24.split(':').map(Number);
  const timestamp = new Date();
  timestamp.setHours(hours, minutes + minutesOffset, 0, 0);
  return timestamp;
};

export const createMyMedicines = (language: string) => [
  {
    id: '1',
    name: 'Vitamin D',
    dosage: '1000 IU',
    time: '08:00 AM',
    times: ['08:00 AM'],
    type: 'tablet',
    color: 'from-amber-200 to-orange-300',
    bgColor: 'bg-amber-50',
    frequency: language === 'ko' ? '매일' : 'Daily',
    schedule: language === 'ko' ? '매일 오전 08:00' : 'Daily at 08:00 AM'
    // Status will be calculated dynamically
  },
  {
    id: '2',
    name: 'Aspirin',
    dosage: '75mg',
    time: language === 'ko' ? '필요 시 복용' : 'As needed',
    times: [language === 'ko' ? '필요 시 복용' : 'As needed'],
    type: 'tablet',
    color: 'from-orange-300 to-red-400',
    bgColor: 'bg-orange-50',
    asNeeded: true,
    frequency: language === 'ko' ? '필요시' : 'As needed',
    schedule: language === 'ko' ? '필요시 복용' : 'Take as needed'
    // As-needed medicines don't have time-based status
  },
  {
    id: '3',
    name: 'Blood Pressure',
    dosage: '10mg',
    time: '12:00 PM',
    times: ['12:00 PM', '08:00 PM'],
    type: 'tablet',
    color: 'from-amber-300 to-orange-400',
    bgColor: 'bg-amber-50',
    asNeeded: false,
    frequency: language === 'ko' ? '하루 2회' : '2x daily',
    schedule: language === 'ko' ? '매일 오후 12:00, 오후 08:00' : 'Daily at 12:00 PM, 08:00 PM'
    // Status will be calculated dynamically
  },
  {
    id: '4',
    name: 'Calcium',
    dosage: '500mg',
    time: '02:00 PM',
    times: ['02:00 PM', '06:00 PM'],
    type: 'tablet',
    color: 'from-stone-300 to-amber-300',
    bgColor: 'bg-stone-50',
    frequency: language === 'ko' ? '하루 2회' : '2x daily',
    schedule: language === 'ko' ? '매일 오후 02:00, 오후 06:00' : 'Daily at 02:00 PM, 06:00 PM'
    // Status will be calculated dynamically
  },
  {
    id: '5',
    name: 'Sleep Aid',
    dosage: '5mg',
    time: '10:00 PM',
    times: ['10:00 PM'],
    type: 'tablet',
    color: 'from-stone-300 to-amber-400',
    bgColor: 'bg-stone-50',
    frequency: language === 'ko' ? '매일' : 'Daily',
    schedule: language === 'ko' ? '매일 오후 10:00' : 'Daily at 10:00 PM'
    // Status will be calculated dynamically
  }
];

export const createCareRecipientMedicines = (language: string) => ({
  person1: [
    {
      id: 'p1-1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      time: '08:00 AM',
      times: ['08:00 AM'],
      takenAt: createTakenTimestamp('08:00 AM', 15), // Taken 15 mins after scheduled
      color: 'from-amber-200 to-orange-300',
      type: 'tablet',
      frequency: language === 'ko' ? '매일' : 'Daily',
      schedule: language === 'ko' ? '매일 오전 08:00' : 'Daily at 08:00 AM'
    },
    {
      id: 'p1-2',
      name: 'Aspirin',
      dosage: '75mg',
      time: '09:00 AM',
      times: ['09:00 AM'],
      // Not taken - will show as overdue/pending based on current time
      color: 'from-orange-300 to-red-400',
      type: 'tablet',
      frequency: language === 'ko' ? '매일' : 'Daily',
      schedule: language === 'ko' ? '매일 오전 09:00' : 'Daily at 09:00 AM'
    },
    {
      id: 'p1-3',
      name: 'Blood Pressure',
      dosage: '10mg',
      time: '12:00 PM',
      times: ['12:00 PM', '08:00 PM'],
      color: 'from-amber-300 to-orange-400',
      type: 'tablet',
      frequency: language === 'ko' ? '하루 2회' : '2x daily',
      schedule: language === 'ko' ? '매일 오후 12:00, 오후 08:00' : 'Daily at 12:00 PM, 08:00 PM'
    },
    {
      id: 'p1-4',
      name: 'Calcium',
      dosage: '500mg',
      time: '02:00 PM',
      times: ['02:00 PM', '06:00 PM'],
      color: 'from-stone-300 to-amber-300',
      type: 'tablet',
      frequency: language === 'ko' ? '하루 2회' : '2x daily',
      schedule: language === 'ko' ? '매일 오후 02:00, 오후 06:00' : 'Daily at 02:00 PM, 06:00 PM'
    },
    {
      id: 'p1-5',
      name: 'Sleep Aid',
      dosage: '5mg',
      time: '10:00 PM',
      times: ['10:00 PM'],
      color: 'from-stone-300 to-amber-400',
      type: 'tablet',
      frequency: language === 'ko' ? '매일' : 'Daily',
      schedule: language === 'ko' ? '매일 오후 10:00' : 'Daily at 10:00 PM'
    }
  ],
  person2: [
    {
      id: 'p2-1',
      name: 'Diabetes Med',
      dosage: '500mg',
      time: '08:00 AM',
      times: ['08:00 AM'],
      takenAt: createTakenTimestamp('08:00 AM', 0),
      color: 'from-amber-200 to-orange-300',
      type: 'tablet',
      frequency: language === 'ko' ? '매일' : 'Daily',
      schedule: language === 'ko' ? '매일 오전 08:00' : 'Daily at 08:00 AM'
    },
    {
      id: 'p2-2',
      name: 'Heart Medication',
      dosage: '25mg',
      time: '09:00 AM',
      times: ['09:00 AM'],
      takenAt: createTakenTimestamp('09:00 AM', 10),
      color: 'from-orange-200 to-amber-300',
      type: 'tablet',
      frequency: language === 'ko' ? '매일' : 'Daily',
      schedule: language === 'ko' ? '매일 오전 09:00' : 'Daily at 09:00 AM'
    },
    {
      id: 'p2-3',
      name: 'Vitamin B12',
      dosage: '100mcg',
      time: '12:00 PM',
      times: ['12:00 PM'],
      takenAt: createTakenTimestamp('12:00 PM', 5),
      color: 'from-amber-300 to-orange-400',
      type: 'tablet',
      frequency: language === 'ko' ? '매일' : 'Daily',
      schedule: language === 'ko' ? '매일 오후 12:00' : 'Daily at 12:00 PM'
    },
    {
      id: 'p2-4',
      name: 'Calcium',
      dosage: '600mg',
      time: '08:00 PM',
      times: ['08:00 PM'],
      color: 'from-stone-300 to-amber-300',
      type: 'tablet',
      frequency: language === 'ko' ? '매일' : 'Daily',
      schedule: language === 'ko' ? '매일 오후 08:00' : 'Daily at 08:00 PM'
    }
  ]
});

export const createInitialCareRecipients = () => [
  {
    id: 'person1',
    name: 'Mom (Linda)',
    initials: 'LM',
    color: 'bg-[#3674B5]',
    relation: 'Mother',
    todayStatus: {
      total: 5,
      taken: 1,
      overdue: 1,
      pending: 1,
      upcoming: 2
    },
    healthScore: 75
  },
  {
    id: 'person2',
    name: 'Dad (Robert)',
    initials: 'RM',
    color: 'bg-[#F0EBE3]',
    relation: 'Father',
    todayStatus: {
      total: 4,
      taken: 3,
      overdue: 0,
      pending: 0,
      upcoming: 1
    },
    healthScore: 92
  }
];
