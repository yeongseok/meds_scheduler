import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Pill } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from './LanguageContext';
import { SharedHeader, CareRecipient } from './SharedHeader';
import { ScheduleWeekNavigator } from './ScheduleWeekNavigator';
import { ScheduleDateSelector } from './ScheduleDateSelector';
import { ScheduleMedicineItem } from './ScheduleMedicineItem';
import { MedicineListCard } from './MedicineListCard';
import { AdBanner } from './AdBanner';
import { 
  useAuth, 
  useMedicines, 
  useCareRecipients,
  getWeekDoseRecords
} from '../lib';
import {
  generateScheduleForDate,
  hasMissedMedicationsOnDate,
  calculateTodayStatus,
  expandMedicineDoses,
  type ScheduleItem
} from '../lib/utils';

interface SchedulePageProps {
  onEditMedicine?: (medicineId: string, medicineName: string) => void;
  onNavigateToSettings?: () => void;
  selectedView?: string;
  setSelectedView?: (view: string) => void;
}

export function SchedulePage({ 
  onEditMedicine, 
  onNavigateToSettings, 
  selectedView: propSelectedView, 
  setSelectedView: propSetSelectedView 
}: SchedulePageProps = {}) {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  
  const [currentWeek, setCurrentWeek] = useState(0);
  const [localSelectedView, setLocalSelectedView] = useState('my-meds');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Use props if provided, otherwise use local state
  const selectedView = propSelectedView ?? localSelectedView;
  const setSelectedView = propSetSelectedView ?? setLocalSelectedView;
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  ); // Monday=0

  // State for dose records
  const [weekDoseRecords, setWeekDoseRecords] = useState<Record<string, any[]>>({});
  
  // Fetch user's medicines with real-time updates
  const { medicines: userMedicines, loading: medicinesLoading } = useMedicines(user?.uid, true);
  
  // Fetch care recipients with real-time updates
  const { 
    recipients: careRecipients, 
    loading: recipientsLoading, 
    getRecipientMedicines 
  } = useCareRecipients(user?.uid, true);
  
  // State for care recipient medicines
  const [recipientMedicinesMap, setRecipientMedicinesMap] = useState<Record<string, any[]>>({});

  // Update current time every minute for real-time status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Fetch care recipient medicines when view changes
  useEffect(() => {
    if (!user || selectedView === 'my-meds') return;
    
    const recipientId = selectedView;
    
    // Check if we already have this recipient's medicines
    if (recipientMedicinesMap[recipientId]) return;
    
    const fetchRecipientMedicines = async () => {
      try {
        const medicines = await getRecipientMedicines(recipientId);
        setRecipientMedicinesMap(prev => ({ ...prev, [recipientId]: medicines }));
      } catch (error) {
        console.error('Error fetching recipient medicines:', error);
      }
    };

    fetchRecipientMedicines();
  }, [selectedView, user, getRecipientMedicines, recipientMedicinesMap]);

  // Fetch dose records for the current week
  useEffect(() => {
    if (!user) return;
    
    const fetchWeekDoseRecords = async () => {
      try {
        const userId = selectedView === 'my-meds' ? user.uid : selectedView;
        const weekStart = getDateForDayIndex(0); // Monday of current week
        const records = await getWeekDoseRecords(userId, weekStart);
        setWeekDoseRecords(prev => ({ ...prev, [userId]: records }));
      } catch (error) {
        console.error('Error fetching week dose records:', error);
      }
    };
    
    fetchWeekDoseRecords();
  }, [user, selectedView, currentWeek]);

  // Convert care recipients to SharedHeader format
  const careRecipientsForHeader: CareRecipient[] = useMemo(() => {
    return careRecipients.map(recipient => {
      const recipientId = recipient.userId;
      const medicines = recipientMedicinesMap[recipientId] || [];
      const doseRecords = weekDoseRecords[recipientId] || [];
      
      // Expand doses and calculate today's status
      const expandedDoses = expandMedicineDoses(medicines, currentTime, language);
      const todayStatus = calculateTodayStatus(expandedDoses, doseRecords);
      
      return {
        ...recipient,
        id: recipientId,
        name: recipient.guardianName || 'Unknown',
        initials: recipient.guardianName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
        color: 'bg-[#3674B5]',
        relation: recipient.relationship || 'Family',
        adherence: 0,
        todayStatus
      };
    });
  }, [careRecipients, recipientMedicinesMap, weekDoseRecords, currentTime, language]);

  // Get base medicines for current view
  const baseMedicines = useMemo(
    () => {
      if (selectedView === 'my-meds') {
        return userMedicines;
      } else {
        return recipientMedicinesMap[selectedView] || [];
      }
    },
    [selectedView, userMedicines, recipientMedicinesMap]
  );

  // Get current dose records
  const currentDoseRecords = useMemo(() => {
    const userId = selectedView === 'my-meds' ? (user?.uid || '') : selectedView;
    return weekDoseRecords[userId] || [];
  }, [selectedView, user, weekDoseRecords]);

  // Always use Korean names for data keys
  const daysKorean = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  
  // Display names based on language
  const days = language === 'ko' 
    ? ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const currentDate = new Date();
  const currentDayIndex = (currentDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

  const formatDate = (dayIndex: number) => {
    const date = new Date();
    const diff = dayIndex - currentDayIndex + (currentWeek * 7);
    date.setDate(date.getDate() + diff);
    return date.getDate();
  };

  // Get the actual date for a given day index
  const getDateForDayIndex = (dayIndex: number): Date => {
    const date = new Date();
    const diff = dayIndex - currentDayIndex + (currentWeek * 7);
    date.setDate(date.getDate() + diff);
    return date;
  };

  // Calculate schedule with dynamic status for a specific day
  const getScheduleForDay = (dayIndex: number): ScheduleItem[] => {
    const targetDate = getDateForDayIndex(dayIndex);
    return generateScheduleForDate(baseMedicines, targetDate, currentDoseRecords, currentTime);
  };

  const navigateToPreviousWeek = () => {
    setCurrentWeek(prev => prev - 1);
  };

  const navigateToNextWeek = () => {
    setCurrentWeek(prev => prev + 1);
  };

  const navigateToToday = () => {
    setCurrentWeek(0);
    setSelectedDateIndex(currentDayIndex);
  };

  const getCurrentWeekMonthYear = () => {
    const date = new Date();
    const diff = (currentWeek * 7);
    date.setDate(date.getDate() + diff);
    
    const monthNames = language === 'ko'
      ? ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const hasMissedDose = (dayIndex: number): boolean => {
    const targetDate = getDateForDayIndex(dayIndex);
    return hasMissedMedicationsOnDate(baseMedicines, targetDate, currentDoseRecords, currentTime);
  };

  // Show loading state
  const isLoading = authLoading || medicinesLoading || recipientsLoading;

  return (
    <div className="h-full flex flex-col bg-white">
      <SharedHeader
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        careRecipients={careRecipientsForHeader}
        setCareRecipients={() => {}} // Care recipients managed by Firebase
        onNavigateToSettings={onNavigateToSettings}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Ad Banner */}
        <AdBanner />
        
        <div className="p-4">

        {/* Medication Plans */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 flex items-center space-x-2">
              <Calendar className="text-brand-accent" size={22} />
              <span className="text-xl font-bold text-[18px]">
                {language === 'ko' ? '복약 계획' : 'Medication Plans'}
              </span>
            </h2>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-white p-1 h-auto rounded-full border-2 border-brand-primary">
              <TabsTrigger 
                value="all" 
                className="text-[18px] font-semibold py-2.5 rounded-full data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 transition-all duration-200"
              >
                {language === 'ko' ? '전체' : 'All'}
              </TabsTrigger>
              <TabsTrigger 
                value="weekly" 
                className="text-[18px] font-semibold py-2.5 rounded-full data-[state=active]:bg-brand-primary data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 transition-all duration-200"
              >
                {language === 'ko' ? '주간' : 'Weekly'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3674B5] border-r-transparent mb-2"></div>
                    <p className="text-gray-500">
                      {language === 'ko' ? '불러오는 중...' : 'Loading...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && baseMedicines.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Pill className="mx-auto mb-2 text-gray-300" size={48} />
                  <p className="text-[18px] mb-2">
                    {language === 'ko' ? '등록된 약이 없습니다' : 'No medications registered'}
                  </p>
                  <p className="text-[14px] text-gray-400">
                    {language === 'ko' 
                      ? '+ 버튼을 눌러 약을 추가해보세요' 
                      : 'Press the + button to add medications'}
                  </p>
                </div>
              )}

              {/* Medicine List */}
              {!isLoading && baseMedicines.map((medicine) => {
                // Format times for display
                const timesDisplay = medicine.times && medicine.times.length > 0
                  ? medicine.times.join(', ')
                  : (language === 'ko' ? '시간 미설정' : 'No time set');
                
                // Format frequency
                const frequency = medicine.times && medicine.times.length > 0
                  ? (language === 'ko' 
                      ? (medicine.times.length === 1 ? '매일' : `하루 ${medicine.times.length}회`)
                      : (medicine.times.length === 1 ? 'Daily' : `${medicine.times.length}x daily`))
                  : (language === 'ko' ? '필요시' : 'As needed');

                return (
                  <MedicineListCard
                    key={medicine.id}
                    id={medicine.id}
                    name={medicine.name}
                    dosage={medicine.dosage}
                    formType={medicine.type || (language === 'ko' ? '정제' : 'Tablet')}
                    frequency={frequency}
                    times={timesDisplay}
                    gradientColors="bg-brand-primary"
                    onEdit={onEditMedicine}
                    editIconColor="text-brand-accent"
                    language={language}
                  />
                );
              })}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-3">
              {/* Date Selector */}
              <div className="bg-white rounded-xl p-3 border border-gray-200 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 text-[18px]">
                    {language === 'ko' ? '날짜 선택' : 'Select Date'}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={navigateToToday}
                    className="h-7 px-3 text-[14px] bg-brand-surface text-brand-accent border-brand-primary hover:bg-brand-primary hover:border-brand-accent hover:text-gray-800"
                  >
                    {language === 'ko' ? '오늘로 이동' : 'Go to today'}
                  </Button>
                </div>
                
                {/* Week Navigation */}
                <ScheduleWeekNavigator
                  currentWeekMonthYear={getCurrentWeekMonthYear()}
                  onPreviousWeek={navigateToPreviousWeek}
                  onNextWeek={navigateToNextWeek}
                  onToday={navigateToToday}
                  language={language}
                />
                
                <ScheduleDateSelector
                  days={days}
                  currentDayIndex={currentDayIndex}
                  currentWeek={currentWeek}
                  selectedDateIndex={selectedDateIndex}
                  formatDate={formatDate}
                  hasMissedDose={hasMissedDose}
                  onDateSelect={setSelectedDateIndex}
                  language={language}
                />
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3674B5] border-r-transparent mb-2"></div>
                    <p className="text-gray-500">
                      {language === 'ko' ? '불러오는 중...' : 'Loading...'}
                    </p>
                  </div>
                </div>
              )}

              {/* Scheduled Pills for Selected Date */}
              {!isLoading && (
                <div className="space-y-2">
                  {(() => {
                    const daySchedule = getScheduleForDay(selectedDateIndex);
                    return daySchedule.length > 0 ? (
                      daySchedule.map((medicine, index) => (
                        <ScheduleMedicineItem
                          key={`${medicine.id}-${medicine.time}-${index}`}
                          medicine={medicine}
                          index={index}
                          language={language}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Pill className="mx-auto mb-2 text-gray-300" size={32} />
                        <p className="text-[16px]">
                          {language === 'ko' ? '예정된 약이 없습니다' : 'No medications scheduled'}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </div>
    </div>
  );
}
