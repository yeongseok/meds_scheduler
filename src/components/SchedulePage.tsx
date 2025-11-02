import React, { useState } from 'react';
import { Calendar, Pill } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from './LanguageContext';
import { SharedHeader, CareRecipient } from './SharedHeader';
import { ScheduleWeekNavigator } from './ScheduleWeekNavigator';
import { ScheduleDateSelector } from './ScheduleDateSelector';
import { ScheduleMedicineItem } from './ScheduleMedicineItem';
import { MedicineListCard } from './MedicineListCard';

interface SchedulePageProps {
  onEditMedicine?: (medicineId: string, medicineName: string) => void;
  onNavigateToSettings?: () => void;
  selectedView?: string;
  setSelectedView?: (view: string) => void;
}

interface Medicine {
  id: string;
  name: string;
  time: string;
  dosage: string;
  status: 'taken' | 'missed' | 'pending' | 'upcoming';
  period: 'morning' | 'afternoon' | 'evening' | 'night';
}

type ScheduleData = Record<string, Medicine[]>;

export function SchedulePage({ onEditMedicine, onNavigateToSettings, selectedView: propSelectedView, setSelectedView: propSetSelectedView }: SchedulePageProps = {}) {
  const { t, language } = useLanguage();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [localSelectedView, setLocalSelectedView] = useState('my-meds');
  
  // Use props if provided, otherwise use local state
  const selectedView = propSelectedView ?? localSelectedView;
  const setSelectedView = propSetSelectedView ?? setLocalSelectedView;
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); // Monday=0

  // Mock data for care recipients
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
      }
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
      }
    }
  ]);

  // Mock schedule data with enhanced time periods (My medications)
  const myScheduleData: ScheduleData = {
    '월요일': [
      { id: '1', name: 'Vitamin D', time: '08:00', dosage: '1000 IU', status: 'taken', period: 'morning' },
      { id: '2', name: 'Blood Pressure Med', time: '12:00', dosage: '10mg', status: 'taken', period: 'afternoon' },
      { id: '3', name: 'Calcium', time: '18:00', dosage: '500mg', status: 'taken', period: 'evening' },
      { id: '4', name: 'Blood Pressure Med', time: '20:00', dosage: '10mg', status: 'taken', period: 'night' }
    ],
    '화요일': [
      { id: '1', name: 'Vitamin D', time: '08:00', dosage: '1000 IU', status: 'taken', period: 'morning' },
      { id: '2', name: 'Blood Pressure Med', time: '12:00', dosage: '10mg', status: 'taken', period: 'afternoon' },
      { id: '4', name: 'Calcium', time: '18:00', dosage: '500mg', status: 'taken', period: 'evening' },
      { id: '2', name: 'Blood Pressure Med', time: '20:00', dosage: '10mg', status: 'taken', period: 'night' }
    ],
    '수요일': [
      { id: '1', name: 'Vitamin D', time: '08:00', dosage: '1000 IU', status: 'taken', period: 'morning' },
      { id: '2', name: 'Blood Pressure Med', time: '12:00', dosage: '10mg', status: 'taken', period: 'afternoon' },
      { id: '4', name: 'Calcium', time: '18:00', dosage: '500mg', status: 'missed', period: 'evening' },
      { id: '2', name: 'Blood Pressure Med', time: '20:00', dosage: '10mg', status: 'taken', period: 'night' }
    ],
    '목요일': [
      { id: '1', name: 'Vitamin D', time: '08:00', dosage: '1000 IU', status: 'pending', period: 'morning' },
      { id: '2', name: 'Blood Pressure Med', time: '12:00', dosage: '10mg', status: 'upcoming', period: 'afternoon' },
      { id: '4', name: 'Calcium', time: '18:00', dosage: '500mg', status: 'upcoming', period: 'evening' },
      { id: '2', name: 'Blood Pressure Med', time: '20:00', dosage: '10mg', status: 'upcoming', period: 'night' }
    ],
    '금요일': [
      { id: '1', name: 'Vitamin D', time: '08:00', dosage: '1000 IU', status: 'upcoming', period: 'morning' },
      { id: '2', name: 'Blood Pressure Med', time: '12:00', dosage: '10mg', status: 'upcoming', period: 'afternoon' },
      { id: '4', name: 'Calcium', time: '18:00', dosage: '500mg', status: 'upcoming', period: 'evening' },
      { id: '2', name: 'Blood Pressure Med', time: '20:00', dosage: '10mg', status: 'upcoming', period: 'night' }
    ],
    '토요일': [
      { id: '1', name: 'Vitamin D', time: '08:00', dosage: '1000 IU', status: 'upcoming', period: 'morning' },
      { id: '2', name: 'Blood Pressure Med', time: '12:00', dosage: '10mg', status: 'upcoming', period: 'afternoon' },
      { id: '4', name: 'Calcium', time: '18:00', dosage: '500mg', status: 'upcoming', period: 'evening' },
      { id: '2', name: 'Blood Pressure Med', time: '20:00', dosage: '10mg', status: 'upcoming', period: 'night' }
    ],
    '일요일': [
      { id: '1', name: 'Vitamin D', time: '08:00', dosage: '1000 IU', status: 'upcoming', period: 'morning' },
      { id: '2', name: 'Blood Pressure Med', time: '12:00', dosage: '10mg', status: 'upcoming', period: 'afternoon' },
      { id: '4', name: 'Calcium', time: '18:00', dosage: '500mg', status: 'upcoming', period: 'evening' },
      { id: '2', name: 'Blood Pressure Med', time: '20:00', dosage: '10mg', status: 'upcoming', period: 'night' }
    ]
  };

  // Schedule data for care recipients
  const careRecipientSchedules: Record<string, ScheduleData> = {
    person1: {
      '월요일': [
        { id: 'p1-1', name: 'Diabetes Med', time: '07:30', dosage: '500mg', status: 'taken', period: 'morning' },
        { id: 'p1-2', name: 'Heart Med', time: '13:00', dosage: '25mg', status: 'taken', period: 'afternoon' },
        { id: 'p1-3', name: 'Vitamin B12', time: '19:00', dosage: '100mcg', status: 'taken', period: 'evening' }
      ],
      '화요일': [
        { id: 'p1-1', name: 'Diabetes Med', time: '07:30', dosage: '500mg', status: 'taken', period: 'morning' },
        { id: 'p1-2', name: 'Heart Med', time: '13:00', dosage: '25mg', status: 'taken', period: 'afternoon' },
        { id: 'p1-3', name: 'Vitamin B12', time: '19:00', dosage: '100mcg', status: 'taken', period: 'evening' }
      ],
      '수요일': [
        { id: 'p1-1', name: 'Diabetes Med', time: '07:30', dosage: '500mg', status: 'taken', period: 'morning' },
        { id: 'p1-2', name: 'Heart Med', time: '13:00', dosage: '25mg', status: 'missed', period: 'afternoon' },
        { id: 'p1-3', name: 'Vitamin B12', time: '19:00', dosage: '100mcg', status: 'taken', period: 'evening' }
      ],
      '목요일': [
        { id: 'p1-1', name: 'Diabetes Med', time: '07:30', dosage: '500mg', status: 'pending', period: 'morning' },
        { id: 'p1-2', name: 'Heart Med', time: '13:00', dosage: '25mg', status: 'upcoming', period: 'afternoon' },
        { id: 'p1-3', name: 'Vitamin B12', time: '19:00', dosage: '100mcg', status: 'upcoming', period: 'evening' }
      ],
      '금요일': [
        { id: 'p1-1', name: 'Diabetes Med', time: '07:30', dosage: '500mg', status: 'upcoming', period: 'morning' },
        { id: 'p1-2', name: 'Heart Med', time: '13:00', dosage: '25mg', status: 'upcoming', period: 'afternoon' },
        { id: 'p1-3', name: 'Vitamin B12', time: '19:00', dosage: '100mcg', status: 'upcoming', period: 'evening' }
      ],
      '토요일': [
        { id: 'p1-1', name: 'Diabetes Med', time: '07:30', dosage: '500mg', status: 'upcoming', period: 'morning' },
        { id: 'p1-2', name: 'Heart Med', time: '13:00', dosage: '25mg', status: 'upcoming', period: 'afternoon' },
        { id: 'p1-3', name: 'Vitamin B12', time: '19:00', dosage: '100mcg', status: 'upcoming', period: 'evening' }
      ],
      '일요일': [
        { id: 'p1-1', name: 'Diabetes Med', time: '07:30', dosage: '500mg', status: 'upcoming', period: 'morning' },
        { id: 'p1-2', name: 'Heart Med', time: '13:00', dosage: '25mg', status: 'upcoming', period: 'afternoon' },
        { id: 'p1-3', name: 'Vitamin B12', time: '19:00', dosage: '100mcg', status: 'upcoming', period: 'evening' }
      ]
    },
    person2: {
      '월요일': [
        { id: 'p2-1', name: 'Blood Thinner', time: '08:00', dosage: '5mg', status: 'taken', period: 'morning' },
        { id: 'p2-2', name: 'Cholesterol', time: '20:00', dosage: '20mg', status: 'taken', period: 'night' }
      ],
      '화요일': [
        { id: 'p2-1', name: 'Blood Thinner', time: '08:00', dosage: '5mg', status: 'taken', period: 'morning' },
        { id: 'p2-2', name: 'Cholesterol', time: '20:00', dosage: '20mg', status: 'taken', period: 'night' }
      ],
      '수요일': [
        { id: 'p2-1', name: 'Blood Thinner', time: '08:00', dosage: '5mg', status: 'taken', period: 'morning' },
        { id: 'p2-2', name: 'Cholesterol', time: '20:00', dosage: '20mg', status: 'taken', period: 'night' }
      ],
      '목요일': [
        { id: 'p2-1', name: 'Blood Thinner', time: '08:00', dosage: '5mg', status: 'pending', period: 'morning' },
        { id: 'p2-2', name: 'Cholesterol', time: '20:00', dosage: '20mg', status: 'upcoming', period: 'night' }
      ],
      '금요일': [
        { id: 'p2-1', name: 'Blood Thinner', time: '08:00', dosage: '5mg', status: 'upcoming', period: 'morning' },
        { id: 'p2-2', name: 'Cholesterol', time: '20:00', dosage: '20mg', status: 'upcoming', period: 'night' }
      ],
      '토요일': [
        { id: 'p2-1', name: 'Blood Thinner', time: '08:00', dosage: '5mg', status: 'upcoming', period: 'morning' },
        { id: 'p2-2', name: 'Cholesterol', time: '20:00', dosage: '20mg', status: 'upcoming', period: 'night' }
      ],
      '일요일': [
        { id: 'p2-1', name: 'Blood Thinner', time: '08:00', dosage: '5mg', status: 'upcoming', period: 'morning' },
        { id: 'p2-2', name: 'Cholesterol', time: '20:00', dosage: '20mg', status: 'upcoming', period: 'night' }
      ]
    }
  };

  const scheduleData = selectedView === 'my-meds' ? myScheduleData : (careRecipientSchedules[selectedView] || myScheduleData);

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

  const hasMissedDose = (dayIndex: number) => {
    const dayName = daysKorean[dayIndex];
    const daySchedule = scheduleData[dayName];
    if (!daySchedule) return false;
    return daySchedule.some(medicine => medicine.status === 'missed');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 to-orange-50">
      <SharedHeader
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        careRecipients={careRecipients}
        setCareRecipients={setCareRecipients}
        onNavigateToSettings={onNavigateToSettings}
      />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">

        {/* Medication Plans */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-800 flex items-center space-x-2">
              <Calendar className="text-amber-600" size={22} />
              <span className="text-xl font-bold text-[18px]">
                {language === 'ko' ? '복약 계획' : 'Medication Plans'}
              </span>
            </h2>
          </div>

          <Tabs defaultValue="weekly" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 p-1 h-auto border border-amber-100">
              <TabsTrigger 
                value="weekly" 
                className="text-[18px] font-semibold py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 transition-all duration-200"
              >
                {language === 'ko' ? '주간' : 'Weekly'}
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="text-[18px] font-semibold py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-gray-600 transition-all duration-200"
              >
                {language === 'ko' ? '전체' : 'All'}
              </TabsTrigger>
            </TabsList>

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
                    className="h-7 px-3 text-[14px] bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 hover:text-amber-800"
                  >
                    {language === 'ko' ? '오늘' : 'Today'}
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

              {/* Scheduled Pills for Selected Date */}
              <div className="space-y-2">
                {scheduleData[daysKorean[selectedDateIndex]]?.length > 0 ? (
                  scheduleData[daysKorean[selectedDateIndex]].map((medicine, index) => (
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
                    <p className="text-[16px]">{language === 'ko' ? '예정된 약이 없습니다' : 'No medications scheduled'}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-3">
              <MedicineListCard
                id="1"
                name="Vitamin D"
                dosage="1000 IU"
                formType={language === 'ko' ? '정제' : 'Tablet'}
                frequency={language === 'ko' ? '매일' : 'Daily'}
                times={language === 'ko' ? '매일 오전 08:00' : 'Daily at 08:00 AM'}
                gradientColors="from-amber-200 to-orange-300"
                onEdit={onEditMedicine}
                editIconColor="text-amber-600"
                language={language}
              />

              <MedicineListCard
                id="3"
                name="Blood Pressure Med"
                dosage="10mg"
                formType={language === 'ko' ? '정제' : 'Tablet'}
                frequency={language === 'ko' ? '하루 2회' : '2x daily'}
                times={language === 'ko' ? '매일 오후 12:00, 오후 08:00' : 'Daily at 12:00 PM, 08:00 PM'}
                gradientColors="from-orange-200 to-red-300"
                onEdit={onEditMedicine}
                editIconColor="text-orange-600"
                language={language}
              />

              <MedicineListCard
                id="4"
                name="Calcium"
                dosage="500mg"
                formType={language === 'ko' ? '정제' : 'Tablet'}
                frequency={language === 'ko' ? '하루 2회' : '2x daily'}
                times={language === 'ko' ? '매일 오후 02:00, 오후 06:00' : 'Daily at 02:00 PM, 06:00 PM'}
                gradientColors="from-amber-200 to-orange-300"
                onEdit={onEditMedicine}
                editIconColor="text-amber-600"
                language={language}
              />

              <MedicineListCard
                id="5"
                name="Sleep Aid"
                dosage="5mg"
                formType={language === 'ko' ? '정제' : 'Tablet'}
                frequency={language === 'ko' ? '필요시' : 'As needed'}
                times={language === 'ko' ? '필요시 오후 09:30' : 'As needed at 09:30 PM'}
                gradientColors="from-stone-300 to-amber-400"
                onEdit={onEditMedicine}
                editIconColor="text-stone-600"
                language={language}
              />
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </div>
    </div>
  );
}
