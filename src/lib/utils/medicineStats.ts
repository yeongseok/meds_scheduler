// Medicine Statistics and Calculation Utilities

import { Medicine, DoseRecord, AdherenceStats, MedicineWithStats, UserStats } from '../types';

/**
 * Calculate adherence statistics for a medicine based on dose records
 * @param medicine - The medicine object
 * @param doseRecords - Array of dose records for the medicine
 * @returns AdherenceStats object with calculated statistics
 */
export const calculateAdherenceStats = (
  medicine: Medicine,
  doseRecords: DoseRecord[]
): AdherenceStats => {
  const totalDoses = doseRecords.length;
  const takenDoses = doseRecords.filter(r => r.status === 'taken').length;
  const missedDoses = doseRecords.filter(r => r.status === 'missed').length;
  const skippedDoses = doseRecords.filter(r => r.status === 'skipped').length;
  
  const adherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;
  
  // Calculate current streak (consecutive taken doses from most recent)
  let streak = 0;
  const sortedRecords = [...doseRecords].sort((a, b) => 
    new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  );
  
  for (const record of sortedRecords) {
    if (record.status === 'taken') {
      streak++;
    } else if (record.status === 'missed' || record.status === 'skipped') {
      break; // Streak ends on first missed/skipped dose
    }
  }
  
  return {
    adherence,
    streak,
    totalDoses,
    takenDoses,
    missedDoses,
    skippedDoses
  };
};

/**
 * Get the next scheduled dose time for a medicine
 * @param medicine - The medicine object
 * @param language - Language for formatting ('ko' | 'en')
 * @returns Formatted next dose time string
 */
export const getNextDoseTime = (medicine: Medicine, language: 'ko' | 'en' = 'ko'): string => {
  if (medicine.status === 'completed') {
    return language === 'ko' ? '완료됨' : 'Completed';
  }
  
  if (medicine.status === 'paused' || medicine.status === 'discontinued') {
    return language === 'ko' ? '일시중지' : 'Paused';
  }
  
  if (!medicine.times || medicine.times.length === 0) {
    return language === 'ko' ? '필요시' : 'As needed';
  }
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Find next dose time today or tomorrow
  for (const time of medicine.times) {
    const [hours, minutes] = time.split(':').map(Number);
    const doseTimeMinutes = hours * 60 + minutes;
    
    if (doseTimeMinutes > currentTime) {
      // Format time based on language
      if (language === 'ko') {
        const period = hours < 12 ? '오전' : '오후';
        const displayHours = hours % 12 || 12;
        return `${period} ${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      } else {
        const period = hours < 12 ? 'AM' : 'PM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
      }
    }
  }
  
  // If no time today, return first time tomorrow
  if (medicine.times.length > 0) {
    const [hours, minutes] = medicine.times[0].split(':').map(Number);
    if (language === 'ko') {
      const period = hours < 12 ? '오전' : '오후';
      const displayHours = hours % 12 || 12;
      return `내일 ${period} ${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const period = hours < 12 ? 'AM' : 'PM';
      const displayHours = hours % 12 || 12;
      return `Tomorrow ${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  }
  
  return language === 'ko' ? '필요시' : 'As needed';
};

/**
 * Get background color class based on medicine type or custom color
 * @param medicine - The medicine object
 * @returns Tailwind background color class
 */
export const getMedicineBgColor = (medicine: Medicine): string => {
  // If medicine has a custom color preference, use it
  if (medicine.color) {
    // Map common colors to Tailwind classes
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-50',
      'green': 'bg-green-50',
      'amber': 'bg-amber-50',
      'orange': 'bg-orange-50',
      'red': 'bg-red-50',
      'pink': 'bg-pink-50',
      'purple': 'bg-purple-50',
      'indigo': 'bg-indigo-50',
      'teal': 'bg-teal-50',
      'gray': 'bg-gray-50',
      'stone': 'bg-stone-50',
    };
    
    const lowerColor = medicine.color.toLowerCase();
    if (colorMap[lowerColor]) {
      return colorMap[lowerColor];
    }
  }
  
  // Default colors based on medicine type
  const typeColorMap: Record<string, string> = {
    'tablet': 'bg-amber-50',
    'capsule': 'bg-orange-50',
    'liquid': 'bg-blue-50',
    'injection': 'bg-red-50',
    'cream': 'bg-green-50',
    'inhaler': 'bg-teal-50',
    'other': 'bg-gray-50'
  };
  
  return typeColorMap[medicine.type] || 'bg-gray-50';
};

/**
 * Enrich medicine object with calculated statistics
 * @param medicine - The medicine object
 * @param doseRecords - Array of dose records for the medicine
 * @param language - Language for formatting
 * @returns Medicine object with additional UI fields
 */
export const enrichMedicineWithStats = (
  medicine: Medicine,
  doseRecords: DoseRecord[],
  language: 'ko' | 'en' = 'ko'
): MedicineWithStats => {
  const stats = calculateAdherenceStats(medicine, doseRecords);
  const nextDose = getNextDoseTime(medicine, language);
  const bgColor = getMedicineBgColor(medicine);
  
  return {
    ...medicine,
    adherence: stats.adherence,
    streak: stats.streak,
    totalDoses: stats.totalDoses,
    takenDoses: stats.takenDoses,
    nextDose,
    bgColor
  };
};

/**
 * Calculate adherence for a date range
 * @param doseRecords - Dose records within the date range
 * @returns Adherence percentage
 */
export const calculateAdherenceForRange = (doseRecords: DoseRecord[]): number => {
  const totalDoses = doseRecords.length;
  if (totalDoses === 0) return 100;
  
  const takenDoses = doseRecords.filter(r => r.status === 'taken').length;
  return Math.round((takenDoses / totalDoses) * 100);
};

/**
 * Get adherence color class based on percentage
 * @param adherence - Adherence percentage (0-100)
 * @returns Tailwind color class
 */
export const getAdherenceColor = (adherence: number): string => {
  if (adherence >= 90) return 'text-green-600';
  if (adherence >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Calculate overall user account statistics
 * @param medicines - Array of user's medicines
 * @param doseRecords - Array of all dose records for the user
 * @returns Account statistics object
 */
export const calculateUserStats = (
  medicines: Medicine[],
  doseRecords: DoseRecord[]
): UserStats => {
  const activeMedicines = medicines.filter(m => m.status === 'active').length;
  
  // Calculate overall adherence
  const totalDoses = doseRecords.length;
  const takenDoses = doseRecords.filter(r => r.status === 'taken').length;
  const overallAdherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;
  
  // Calculate current streak (consecutive days with all doses taken)
  let currentStreak = 0;
  
  // Group dose records by date
  const recordsByDate = new Map<string, DoseRecord[]>();
  doseRecords.forEach(record => {
    const dateKey = new Date(record.scheduledDate).toDateString();
    if (!recordsByDate.has(dateKey)) {
      recordsByDate.set(dateKey, []);
    }
    recordsByDate.get(dateKey)!.push(record);
  });
  
  // Sort dates in descending order
  const sortedDates = Array.from(recordsByDate.keys()).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Count consecutive days where all doses were taken
  for (const dateKey of sortedDates) {
    const dayRecords = recordsByDate.get(dateKey)!;
    const allTaken = dayRecords.every(r => r.status === 'taken');
    
    if (allTaken && dayRecords.length > 0) {
      currentStreak++;
    } else {
      break; // Streak ends on first day with missed/skipped doses
    }
  }
  
  return {
    totalMedicines: medicines.length,
    activeMedicines,
    overallAdherence,
    currentStreak,
    totalDosesTaken: takenDoses
  };
};
