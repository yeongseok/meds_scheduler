import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Bell, Zap, Sun, Moon, Sunrise, Sunset, Pill, Repeat, AlertCircle, Edit2, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from './LanguageContext';
import { SharedHeader, CareRecipient } from './SharedHeader';

interface SchedulePageProps {
  onEditMedicine?: (medicineId: string, medicineName: string) => void;
  onNavigateToSettings?: () => void;
  selectedView?: string;
  setSelectedView?: (view: string) => void;
}

export function SchedulePage({ onEditMedicine, onNavigateToSettings, selectedView: propSelectedView, setSelectedView: propSetSelectedView }: SchedulePageProps = {}) {
  const { t, language } = useLanguage();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [localSelectedView, setLocalSelectedView] = useState('my-meds');
  
  // Use props if provided, otherwise use local state
  const selectedView = propSelectedView ?? localSelectedView;
  const setSelectedView = propSetSelectedView ?? setLocalSelectedView;
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); // Monday=0
  const [reminderSettings, setReminderSettings] = useState({
    morningReminder: true,
    afternoonReminder: true,
    eveningReminder: true,
    smartNotifications: true
  });

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
  const myScheduleData = {
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
  const careRecipientSchedules: Record<string, typeof myScheduleData> = {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return 'bg-amber-500';
      case 'missed':
        return 'bg-orange-500';
      case 'pending':
        return 'bg-amber-500 animate-pulse';
      case 'upcoming':
        return 'bg-stone-400';
      default:
        return 'bg-stone-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'taken':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs text-[14px]">✓ {language === 'ko' ? '완료' : 'Done'}</Badge>;
      case 'missed':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs text-[14px]">⚠️ {language === 'ko' ? '놓침' : 'Missed'}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs animate-pulse text-[14px]">🔔 {language === 'ko' ? '복용 시간' : 'Time to take'}</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-stone-600 border-stone-300 text-xs text-[14px]">⏰ {language === 'ko' ? '예정' : 'Upcoming'}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs text-[14px]">?</Badge>;
    }
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return <Sunrise size={14} className="text-amber-500" />;
      case 'afternoon':
        return <Sun size={14} className="text-orange-500" />;
      case 'evening':
        return <Sunset size={14} className="text-orange-600" />;
      case 'night':
        return <Moon size={14} className="text-stone-600" />;
      default:
        return <Clock size={14} className="text-stone-500" />;
    }
  };

  const getPeriodGradient = (period: string) => {
    switch (period) {
      case 'morning':
        return 'from-amber-50 to-orange-50';
      case 'afternoon':
        return 'from-orange-50 to-amber-50';
      case 'evening':
        return 'from-orange-50 to-stone-50';
      case 'night':
        return 'from-stone-50 to-amber-50';
      default:
        return 'from-stone-50 to-amber-50';
    }
  };

  const formatDate = (dayIndex: number) => {
    const date = new Date();
    const diff = dayIndex - currentDayIndex + (currentWeek * 7);
    date.setDate(date.getDate() + diff);
    return date.getDate();
  };

  const getWeekDayName = (dayIndex: number) => {
    const date = new Date();
    const diff = dayIndex - currentDayIndex + (currentWeek * 7);
    date.setDate(date.getDate() + diff);
    return language === 'ko' 
      ? ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][date.getDay()]
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
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
                <div className="flex items-center justify-between mb-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={navigateToPreviousWeek}
                    className="h-8 px-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                  >
                    <ChevronLeft size={18} className="text-amber-600" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateToToday}
                    className="h-8 text-[14px] font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                  >
                    {getCurrentWeekMonthYear()}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={navigateToNextWeek}
                    className="h-8 px-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                  >
                    <ChevronRight size={18} className="text-amber-600" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    const dateNum = formatDate(index);
                    const isToday = index === currentDayIndex && currentWeek === 0;
                    const isSelected = index === selectedDateIndex;
                    const hasMissed = hasMissedDose(index);
                    
                    return (
                      <motion.button
                        key={`${day}-${index}-week${currentWeek}`}
                        onClick={() => setSelectedDateIndex(index)}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md'
                            : isToday
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className={`text-[10px] mb-1 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                          {language === 'ko' ? day.substring(0, 1) : day.substring(0, 3)}
                        </span>
                        <span className={`text-[16px] font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                          {dateNum}
                        </span>
                        {isToday && !isSelected && (
                          <div className="w-1 h-1 bg-amber-500 rounded-full mt-1"></div>
                        )}
                        {hasMissed && (
                          <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 rounded-full border border-white shadow-md animate-pulse"></div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Scheduled Pills for Selected Date */}
              <div className="space-y-2">
                {scheduleData[daysKorean[selectedDateIndex]]?.length > 0 ? (
                  scheduleData[daysKorean[selectedDateIndex]].map((medicine, index) => (
                    <div 
                      key={`${medicine.id}-${medicine.time}-${index}`} 
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r ${getPeriodGradient(medicine.period)} border ${
                        medicine.status === 'pending' 
                          ? 'border-amber-300 ring-2 ring-amber-100' 
                          : medicine.status === 'missed'
                          ? 'border-orange-300'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 ${getStatusColor(medicine.status)} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}>
                          <Pill className="text-white" size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 text-[16px]">{medicine.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-600 text-[14px] mt-1">
                            {getPeriodIcon(medicine.period)}
                            <span>{medicine.time}</span>
                            <span>•</span>
                            <span>{medicine.dosage}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(medicine.status)}
                      </div>
                    </div>
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
              <Card className="medicine-card p-3 border-0 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-amber-200 to-orange-300 rounded-2xl flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Vitamin D
                      </h3>
                      <p className="text-base text-gray-600">
                        1000 IU • {language === 'ko' ? '정제' : 'Tablet'}
                      </p>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">
                          {language === 'ko' ? '매일' : 'Daily'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEditMedicine?.('1', 'Vitamin D')}
                  >
                    <Edit2 size={16} className="text-amber-600" />
                  </Button>
                </div>
                <div className="m-[0px] pl-[72px] text-sm text-gray-600">
                  <Clock size={14} className="inline mr-1" />
                  {language === 'ko' ? '매일 오전 08:00' : 'Daily at 08:00 AM'}
                </div>
              </Card>

              <Card className="medicine-card p-3 border-0 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-200 to-red-300 rounded-2xl flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Blood Pressure Med
                      </h3>
                      <p className="text-base text-gray-600">
                        10mg • {language === 'ko' ? '정제' : 'Tablet'}
                      </p>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">
                          {language === 'ko' ? '하루 2회' : '2x daily'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEditMedicine?.('3', 'Blood Pressure Med')}
                  >
                    <Edit2 size={16} className="text-orange-600" />
                  </Button>
                </div>
                <div className="mt-2 pl-[72px] text-sm text-gray-600">
                  <Clock size={14} className="inline mr-1" />
                  {language === 'ko' ? '매일 오후 12:00, 오후 08:00' : 'Daily at 12:00 PM, 08:00 PM'}
                </div>
              </Card>

              <Card className="medicine-card p-3 border-0 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-amber-200 to-orange-300 rounded-2xl flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Calcium
                      </h3>
                      <p className="text-base text-gray-600">
                        500mg • {language === 'ko' ? '정제' : 'Tablet'}
                      </p>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">
                          {language === 'ko' ? '하루 2회' : '2x daily'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEditMedicine?.('4', 'Calcium')}
                  >
                    <Edit2 size={16} className="text-amber-600" />
                  </Button>
                </div>
                <div className="mt-2 pl-[72px] text-sm text-gray-600">
                  <Clock size={14} className="inline mr-1" />
                  {language === 'ko' ? '매일 오후 02:00, 오후 06:00' : 'Daily at 02:00 PM, 06:00 PM'}
                </div>
              </Card>

              <Card className="medicine-card p-3 border-0 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-stone-300 to-amber-400 rounded-2xl flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        Sleep Aid
                      </h3>
                      <p className="text-base text-gray-600">
                        5mg • {language === 'ko' ? '정제' : 'Tablet'}
                      </p>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">
                          {language === 'ko' ? '필요시' : 'As needed'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEditMedicine?.('5', 'Sleep Aid')}
                  >
                    <Edit2 size={16} className="text-stone-600" />
                  </Button>
                </div>
                <div className="mt-2 pl-[72px] text-sm text-gray-600">
                  <Clock size={14} className="inline mr-1" />
                  {language === 'ko' ? '필요시 오후 09:30' : 'As needed at 09:30 PM'}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </div>
    </div>
  );
}
