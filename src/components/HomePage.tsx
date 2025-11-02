import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { SharedHeader, CareRecipient } from './SharedHeader';
import { MedicineCard } from './MedicineCard';
import { useAuth, useMedicines } from '../lib/hooks';
import type { Medicine as FirebaseMedicine } from '../lib/types';

interface NewMedicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  status: string;
  type: string;
  color: string;
  bgColor: string;
  asNeeded?: boolean;
}

interface HomePageProps {
  onViewMedicine: (medicineId: string) => void;
  onNavigateToSettings: () => void;
  onNavigateToAddMedicine?: () => void;
  newMedicine?: NewMedicine | null;
  onClearNewMedicine?: () => void;
  selectedView: string;
  setSelectedView: (view: string) => void;
}

// Mock data generators moved outside component to avoid recreation
const createMyMedicines = (language: string) => [
  {
    id: '1',
    name: 'Vitamin D',
    dosage: '1000 IU',
    time: '08:00 AM',
    status: 'taken',
    type: 'tablet',
    color: 'from-amber-200 to-orange-300',
    bgColor: 'bg-amber-50',
    frequency: language === 'ko' ? '매일' : 'Daily',
    schedule: language === 'ko' ? '매일 오전 08:00' : 'Daily at 08:00 AM'
  },
  {
    id: '2',
    name: 'Aspirin',
    dosage: '75mg',
    time: '09:00 AM',
    status: 'overdue',
    overdueBy: '3 hours',
    type: 'tablet',
    color: 'from-orange-300 to-red-400',
    bgColor: 'bg-orange-50',
    asNeeded: true,
    frequency: language === 'ko' ? '필요시' : 'As needed',
    schedule: language === 'ko' ? '필요시 복용' : 'Take as needed'
  },
  {
    id: '3',
    name: 'Blood Pressure',
    dosage: '10mg',
    time: '12:00 PM',
    status: 'pending',
    type: 'tablet',
    color: 'from-amber-300 to-orange-400',
    bgColor: 'bg-amber-50',
    asNeeded: false,
    frequency: language === 'ko' ? '하루 2회' : '2x daily',
    schedule: language === 'ko' ? '매일 오후 12:00, 오후 08:00' : 'Daily at 12:00 PM, 08:00 PM'
  },
  {
    id: '4',
    name: 'Calcium',
    dosage: '500mg',
    time: '06:00 PM',
    status: 'upcoming',
    type: 'tablet',
    color: 'from-stone-300 to-amber-300',
    bgColor: 'bg-stone-50',
    frequency: language === 'ko' ? '하루 2회' : '2x daily',
    schedule: language === 'ko' ? '매일 오후 02:00, 오후 06:00' : 'Daily at 02:00 PM, 06:00 PM'
  },
  {
    id: '5',
    name: 'Sleep Aid',
    dosage: '5mg',
    time: '10:00 PM',
    status: 'upcoming',
    type: 'tablet',
    color: 'from-stone-300 to-amber-400',
    bgColor: 'bg-stone-50',
    frequency: language === 'ko' ? '매일' : 'Daily',
    schedule: language === 'ko' ? '매일 오후 10:00' : 'Daily at 10:00 PM'
  }
];

const createCareRecipientMedicines = (language: string) => ({
  person1: [
    {
      id: 'p1-1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      time: '08:00 AM',
      status: 'taken',
      takenAt: '08:15 AM',
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
      status: 'overdue',
      overdueBy: '3 hours',
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
      status: 'pending',
      color: 'from-amber-300 to-orange-400',
      type: 'tablet',
      frequency: language === 'ko' ? '하루 2회' : '2x daily',
      schedule: language === 'ko' ? '매일 오후 12:00, 오후 08:00' : 'Daily at 12:00 PM, 08:00 PM'
    },
    {
      id: 'p1-4',
      name: 'Calcium',
      dosage: '500mg',
      time: '06:00 PM',
      status: 'upcoming',
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
      status: 'upcoming',
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
      status: 'taken',
      takenAt: '08:00 AM',
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
      status: 'taken',
      takenAt: '09:10 AM',
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
      status: 'taken',
      takenAt: '12:05 PM',
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
      status: 'upcoming',
      color: 'from-stone-300 to-amber-300',
      type: 'tablet',
      frequency: language === 'ko' ? '매일' : 'Daily',
      schedule: language === 'ko' ? '매일 오후 08:00' : 'Daily at 08:00 PM'
    }
  ]
});

const DEFAULT_MEDICINE_COLOR = 'from-sky-300 to-blue-500';
const DEFAULT_MEDICINE_BG_COLOR = 'bg-sky-50';

interface ParsedTime {
  hour24: number;
  minute: number;
  minutePadded: string;
  meridiem: 'AM' | 'PM' | null;
  totalMinutes: number;
}

const parseTimeParts = (time: string | undefined): ParsedTime | null => {
  if (!time) return null;

  const match = time.trim().match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
  if (!match) return null;

  const rawHour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() as 'AM' | 'PM' : null;

  let hour24 = rawHour;
  if (meridiem === 'PM' && rawHour < 12) {
    hour24 = rawHour + 12;
  } else if (meridiem === 'AM' && rawHour === 12) {
    hour24 = 0;
  }

  return {
    hour24,
    minute,
    minutePadded: match[2],
    meridiem,
    totalMinutes: hour24 * 60 + minute
  };
};

const formatTimeForLanguage = (time: string | undefined, language: string) => {
  if (!time) {
    return language === 'ko' ? '시간 미정' : 'No time set';
  }

  const parsed = parseTimeParts(time);
  if (!parsed) {
    return time;
  }

  if (language === 'ko') {
    return `${parsed.hour24.toString().padStart(2, '0')}:${parsed.minutePadded}`;
  }

  const hour12 = ((parsed.hour24 + 11) % 12) + 1;
  const suffix = parsed.hour24 >= 12 ? 'PM' : 'AM';
  return `${hour12}:${parsed.minutePadded} ${suffix}`;
};

const buildScheduleText = (times: string[] | undefined, language: string) => {
  if (!times || times.length === 0) {
    return language === 'ko'
      ? '복용 시간이 아직 설정되지 않았어요'
      : 'No schedule set yet';
  }

  const formattedTimes = times.map(time => formatTimeForLanguage(time, language));
  if (language === 'ko') {
    return `${formattedTimes.join(', ')} 복용`;
  }
  return `Take at ${formattedTimes.join(', ')}`;
};

const deriveStatusFromTimes = (times: string[] | undefined) => {
  if (!times || times.length === 0) {
    return 'upcoming';
  }

  const parsedTimes = times
    .map(parseTimeParts)
    .filter((parsed): parsed is ParsedTime => parsed !== null)
    .sort((a, b) => a.totalMinutes - b.totalMinutes);

  if (parsedTimes.length === 0) {
    return 'pending';
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const upcoming = parsedTimes.find(time => time.totalMinutes >= nowMinutes);

  if (!upcoming) {
    const diff = nowMinutes - parsedTimes[parsedTimes.length - 1].totalMinutes;
    return diff >= 60 ? 'overdue' : 'pending';
  }

  const diff = upcoming.totalMinutes - nowMinutes;
  if (diff <= 30) {
    return 'pending';
  }

  return 'upcoming';
};

const mapFirebaseMedicine = (medicine: FirebaseMedicine, language: string) => {
  const status = deriveStatusFromTimes(medicine.times);
  const formattedTime = formatTimeForLanguage(medicine.times?.[0], language);

  const frequencyLabel = medicine.frequency
    ? medicine.frequency
    : language === 'ko'
      ? '맞춤 일정'
      : 'Custom schedule';

  const schedule = buildScheduleText(medicine.times, language);

  return {
    id: medicine.id,
    name: medicine.name,
    dosage: medicine.dosage,
    time: formattedTime,
    status,
    type: medicine.type || 'tablet',
    color: DEFAULT_MEDICINE_COLOR,
    bgColor: DEFAULT_MEDICINE_BG_COLOR,
    frequency: frequencyLabel,
    schedule,
    asNeeded: Boolean(medicine.frequency && medicine.frequency.toLowerCase().includes('need'))
  };
};

const mapFirebaseMedicines = (medicines: FirebaseMedicine[], language: string) =>
  medicines.map(medicine => mapFirebaseMedicine(medicine, language));

export function HomePage({ 
  onViewMedicine, 
  onNavigateToSettings, 
  onNavigateToAddMedicine, 
  newMedicine, 
  onClearNewMedicine, 
  selectedView, 
  setSelectedView 
}: HomePageProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const {
    medicines: firebaseMedicines,
    loading: firebaseMedicinesLoading,
    error: firebaseMedicinesError
  } = useMedicines(user?.uid, false);
  
  // State
  const [skippedMedicines, setSkippedMedicines] = useState<string[]>([]);
  const [takenMedicines, setTakenMedicines] = useState<string[]>([]);
  const [addedMedicines, setAddedMedicines] = useState<NewMedicine[]>([]);
  const [untakenMedicines, setUntakenMedicines] = useState<string[]>([]);
  const [careRecipients, setCareRecipients] = useState<CareRecipient[]>([
    {
      id: 'person1',
      name: 'Mom (Linda)',
      initials: 'LM',
      color: 'bg-orange-300',
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
      color: 'bg-amber-400',
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
  ]);

  useEffect(() => {
    if (firebaseMedicinesError) {
      console.error('Failed to load medicines', firebaseMedicinesError);
    }
  }, [firebaseMedicinesError]);

  // Memoized data sources
  const fallbackMyMedicines = useMemo(() => createMyMedicines(language), [language]);
  const firebaseHomeMedicines = useMemo(
    () => mapFirebaseMedicines(firebaseMedicines, language),
    [firebaseMedicines, language]
  );
  const myMedicines = useMemo(() => {
    if (!user?.uid) {
      return fallbackMyMedicines;
    }

    if (firebaseMedicinesLoading) {
      return [];
    }

    if (firebaseMedicinesError) {
      return [];
    }

    return firebaseHomeMedicines;
  }, [
    user?.uid,
    firebaseMedicinesLoading,
    firebaseMedicinesError,
    firebaseHomeMedicines,
    fallbackMyMedicines
  ]);
  const careRecipientMedicines = useMemo(() => createCareRecipientMedicines(language), [language]);

  // Memoized computed values
  const currentPerson = useMemo(
    () => careRecipients.find(p => p.id === selectedView),
    [careRecipients, selectedView]
  );

  const baseMedicines = useMemo(
    () => selectedView === 'my-meds' 
      ? myMedicines 
      : (careRecipientMedicines[selectedView as keyof typeof careRecipientMedicines] || myMedicines),
    [selectedView, myMedicines, careRecipientMedicines]
  );

  const allMedicines = useMemo(
    () => selectedView === 'my-meds' ? [...addedMedicines, ...baseMedicines] : baseMedicines,
    [selectedView, addedMedicines, baseMedicines]
  );

  // Sort medicines: taken and skipped pills go to the bottom
  const todayMedicines = useMemo(() => {
    return [...allMedicines].sort((a, b) => {
      const aIsTaken = (a.status === 'taken' && !untakenMedicines.includes(a.id)) || takenMedicines.includes(a.id);
      const bIsTaken = (b.status === 'taken' && !untakenMedicines.includes(b.id)) || takenMedicines.includes(b.id);
      const aIsSkipped = skippedMedicines.includes(a.id);
      const bIsSkipped = skippedMedicines.includes(b.id);
      
      const aIsCompleted = aIsTaken || aIsSkipped;
      const bIsCompleted = bIsTaken || bIsSkipped;
      
      if (aIsCompleted && !bIsCompleted) return 1;
      if (!aIsCompleted && bIsCompleted) return -1;
      return 0;
    });
  }, [allMedicines, untakenMedicines, takenMedicines, skippedMedicines]);

  // Handlers with useCallback
  const handleTakeMedicine = useCallback((medicineId: string) => {
    setTakenMedicines(prev => [...prev, medicineId]);
  }, []);

  const handleSkipMedicine = useCallback((medicineId: string) => {
    setSkippedMedicines(prev => [...prev, medicineId]);
  }, []);

  const handleUndoTaken = useCallback((medicineId: string) => {
    setTakenMedicines(prev => prev.filter(id => id !== medicineId));
  }, []);

  const handleUndoSkip = useCallback((medicineId: string) => {
    setSkippedMedicines(prev => prev.filter(id => id !== medicineId));
  }, []);

  const handleUndoPreTaken = useCallback((medicineId: string) => {
    setUntakenMedicines(prev => [...prev, medicineId]);
  }, []);

  const handleSendReminder = useCallback(() => {
    toast.success(language === 'ko' ? '알림이 전송되었습니다!' : 'Reminder sent!', {
      description: language === 'ko' 
        ? `${currentPerson?.name.split(' ')[0]}님에게 약 복용 알림을 보냈습니다.`
        : `Medication reminder sent to ${currentPerson?.name.split(' ')[0]}.`,
      duration: 3000,
    });
  }, [language, currentPerson]);

  // Handle new medicine from add page
  useEffect(() => {
    if (newMedicine) {
      setAddedMedicines(prev => [newMedicine, ...prev]);
      if (onClearNewMedicine) {
        onClearNewMedicine();
      }
    }
  }, [newMedicine, onClearNewMedicine]);

  return (
    <div className="h-full overflow-y-auto">
      <SharedHeader
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        careRecipients={careRecipients}
        setCareRecipients={setCareRecipients}
        onNavigateToSettings={onNavigateToSettings}
      />

      <div className="p-4 space-y-6 m-[0px]">
        {/* Alert for Guardian View with Overdue */}
        {selectedView !== 'my-meds' && (currentPerson?.todayStatus.overdue || 0) > 0 && (
          <Card className="p-4 bg-orange-50 border-orange-200 border-2">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-orange-700" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1 text-lg text-[18px]">{t('home.attentionNeeded')}</h3>
                <p className="text-base text-orange-800 text-[16px]">
                  {language === 'ko' 
                    ? `${currentPerson?.name.split(' ')[0]}님은 ${currentPerson?.todayStatus.overdue}개의 약을 복용하지 않았습니다. 확인해 주세요.`
                    : `${currentPerson?.name.split(' ')[0]} ${t('home.overdueMessage').replace('{count}', String(currentPerson?.todayStatus.overdue || 0))}`}
                </p>
                <Button className="mt-3 bg-orange-600 hover:bg-orange-700 text-white h-10 text-base" onClick={handleSendReminder}>
                  {t('home.sendReminder')}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Today's Schedule */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 flex items-center space-x-2">
              <Activity className="text-amber-600" size={22} />
              <span className="text-xl font-bold text-[18px]">
                {selectedView === 'my-meds' 
                  ? t('home.todaySchedule')
                  : language === 'ko' 
                    ? `${currentPerson?.name.split(' ')[0]}의 일정`
                    : `${currentPerson?.name.split(' ')[0]}'s Schedule`}
              </span>
            </h2>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="sync">
              {todayMedicines.map((medicine, index) => (
                <motion.div
                  key={`${selectedView}-${medicine.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ 
                    duration: 0.2,
                    delay: index * 0.03,
                    ease: "easeOut"
                  }}
                >
                  <MedicineCard
                    medicine={medicine}
                    isMyMeds={selectedView === 'my-meds'}
                    isTaken={takenMedicines.includes(medicine.id)}
                    isSkipped={skippedMedicines.includes(medicine.id)}
                    isUntaken={untakenMedicines.includes(medicine.id)}
                    onTake={handleTakeMedicine}
                    onSkip={handleSkipMedicine}
                    onUndoTaken={handleUndoTaken}
                    onUndoSkip={handleUndoSkip}
                    onUndoPreTaken={handleUndoPreTaken}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}
