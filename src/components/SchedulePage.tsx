import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Bell, Zap, Sun, Moon, Sunrise, Sunset, Pill, Repeat, AlertCircle, Edit2, Heart, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';

interface SchedulePageProps {
  onEditMedicine?: (medicineId: string, medicineName: string) => void;
}

export function SchedulePage({ onEditMedicine }: SchedulePageProps = {}) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedView, setSelectedView] = useState('my-meds');
  const [reminderSettings, setReminderSettings] = useState({
    morningReminder: true,
    afternoonReminder: true,
    eveningReminder: true,
    smartNotifications: true
  });

  // Mock data for care recipients
  const careRecipients = [
    {
      id: 'person1',
      name: 'Mom (Linda)',
      initials: 'LM',
      color: 'bg-orange-300',
      relation: '어머니'
    },
    {
      id: 'person2',
      name: 'Dad (Robert)',
      initials: 'RM',
      color: 'bg-amber-400',
      relation: '아버지'
    }
  ];

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

  const days = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
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
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs text-[14px]">✓ 완료</Badge>;
      case 'missed':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs text-[14px]">⚠️ 놓침</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs animate-pulse text-[14px]">🔔 복용 시간</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-stone-600 border-stone-300 text-xs text-[14px]">⏰ 예정</Badge>;
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
    const diff = dayIndex - currentDayIndex;
    date.setDate(date.getDate() + diff);
    return date.getDate();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header with Gradient */}
      <div className="gradient-info p-6 text-white relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-100 text-lg text-[18px] font-bold">약 복용을 놓치지 마세요</p>
            </div>
          </div>
          
          {/* Week Summary */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-medium text-[20px]">이번 주 요약</h3>
              </div>
              <Zap className="text-amber-200" size={20} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span className="text-orange-100 text-[18px]">28회 복용</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-orange-100 text-[18px]">2회 놓침</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-amber-300 rounded-full animate-pulse"></div>
                <span className="text-orange-100 text-[18px]">18회 예정</span>
              </div>
            </div>
            <p className="text-orange-100 text-sm mt-1 text-[16px]">
              이번 주 순응도가 훌륭합니다! 🌟
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
        {/* View Switcher */}
        {careRecipients.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm p-3 border-0 shadow-md mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                {selectedView === 'my-meds' ? (
                  <Heart className="text-white" size={18} />
                ) : (
                  <Users className="text-white" size={18} />
                )}
              </div>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="flex-1 border-0 bg-amber-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="my-meds">
                    <div className="flex items-center space-x-2">
                      <Heart size={14} className="text-amber-500" />
                      <span className="font-medium text-base">내 일정</span>
                    </div>
                  </SelectItem>
                  {careRecipients.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className={`${person.color} text-white text-xs`}>
                            {person.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{person.name}</span>
                        <span className="text-xs text-gray-500">• {person.relation}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        {/* Medication Plans */}
        <Card className="medicine-card p-3 border-0 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <Calendar className="text-amber-600 flex-shrink-0" size={18} />
            <span className="text-[18px] font-bold">복약 계획</span>
          </h3>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all" className="text-[16px]">전체</TabsTrigger>
              <TabsTrigger value="daily" className="text-[16px]">관리</TabsTrigger>
              <TabsTrigger value="weekly" className="text-[16px]">주간</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-3">
              {/* Morning Plan */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sunrise className="text-white" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-[16px]">아침 계획</p>
                      <p className="text-xs text-gray-600 text-[14px]">오전 6:00 - 오후 12:00</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 flex-shrink-0 text-[14px]">2알</Badge>
                </div>
                <div className="space-y-2 pl-12">
                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg hover:bg-amber-50 transition-colors group">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Pill className="text-amber-500 flex-shrink-0" size={14} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Vitamin D</p>
                        <p className="text-xs text-gray-500 text-[14px]">1000 IU • 오전 08:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs text-amber-700 border-amber-300 text-[14px]">
                        <Repeat size={10} className="mr-1" />
                        매일
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => onEditMedicine?.('1', 'Vitamin D')}
                      >
                        <Edit2 size={14} className="text-amber-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg hover:bg-amber-50 transition-colors group">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Pill className="text-amber-500 flex-shrink-0" size={14} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">Omega-3</p>
                        <p className="text-xs text-gray-500">1200mg • 오전 09:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
                        <Repeat size={10} className="mr-1" />
                        매일
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => onEditMedicine?.('2', 'Omega-3')}
                      >
                        <Edit2 size={14} className="text-amber-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Afternoon Plan */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sun className="text-white" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-[16px]">오후 계획</p>
                      <p className="text-xs text-gray-600 text-[14px]">오후 12:00 - 오후 6:00</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex-shrink-0 text-[14px]">3알</Badge>
                </div>
                <div className="space-y-2 pl-12">
                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg hover:bg-orange-50 transition-colors group">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Pill className="text-orange-500 flex-shrink-0" size={14} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Blood Pressure Med</p>
                        <p className="text-xs text-gray-500 text-[14px]">10mg • 오후 12:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs text-amber-700 border-amber-300 whitespace-nowrap text-[14px]">
                        <Repeat size={10} className="mr-1" />
                        하루 2회
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => onEditMedicine?.('3', 'Blood Pressure Med')}
                      >
                        <Edit2 size={14} className="text-orange-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg hover:bg-orange-50 transition-colors group">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Pill className="text-orange-500 flex-shrink-0" size={14} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Multivitamin</p>
                        <p className="text-xs text-gray-500 text-[14px]">1정 • 오후 02:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs text-amber-700 border-amber-300 text-[14px]">
                        <Repeat size={10} className="mr-1" />
                        매일
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => console.log('Edit Multivitamin schedule')}
                      >
                        <Edit2 size={14} className="text-orange-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg hover:bg-orange-50 transition-colors group">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Pill className="text-orange-500 flex-shrink-0" size={14} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Calcium</p>
                        <p className="text-xs text-gray-500 text-[14px]">500mg • 오후 06:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs text-amber-700 border-amber-300 whitespace-nowrap text-[14px]">
                        <Repeat size={10} className="mr-1" />
                        하루 2회
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => console.log('Edit Calcium schedule')}
                      >
                        <Edit2 size={14} className="text-orange-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evening Plan */}
              <div className="bg-gradient-to-r from-orange-50 to-stone-50 rounded-xl p-3 border border-orange-100">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-stone-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Moon className="text-white" size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-[16px]">저녁 계획</p>
                      <p className="text-xs text-gray-600 text-[14px]">오후 6:00 - 오후 10:00</p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 flex-shrink-0 text-[14px]">2알</Badge>
                </div>
                <div className="space-y-2 pl-12">
                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg hover:bg-orange-50 transition-colors group">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Pill className="text-orange-500 flex-shrink-0" size={14} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Blood Pressure Med</p>
                        <p className="text-xs text-gray-500 text-[14px]">10mg • 오후 08:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs text-amber-700 border-amber-300 whitespace-nowrap text-[14px]">
                        <Repeat size={10} className="mr-1" />
                        하루 2회
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => console.log('Edit Blood Pressure Med schedule')}
                      >
                        <Edit2 size={14} className="text-orange-600" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-lg hover:bg-stone-50 transition-colors group">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Pill className="text-stone-500 flex-shrink-0" size={14} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Sleep Aid</p>
                        <p className="text-xs text-gray-500 text-[14px]">5mg • 오후 09:30</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs text-stone-600 border-stone-300 whitespace-nowrap text-[14px]">
                        <AlertCircle size={10} className="mr-1" />
                        필요시
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => console.log('Edit Sleep Aid schedule')}
                      >
                        <Edit2 size={14} className="text-stone-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-3">
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 text-[18px]">주간 개요</p>
                    <p className="text-xs text-gray-600 text-[16px]">총: 이번 주 49알</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 flex-shrink-0 text-[14px]">7일</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Pill className="text-amber-500 flex-shrink-0" size={16} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Vitamin D</p>
                        <p className="text-xs text-gray-500 text-[14px]">매일 • 아침</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-800 text-[16px]">7알</p>
                      <p className="text-xs text-gray-500 whitespace-nowrap text-[14px]">각 1000 IU</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Pill className="text-orange-500 flex-shrink-0" size={16} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Blood Pressure Med</p>
                        <p className="text-xs text-gray-500 text-[14px]">하루 2회</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-800 text-[16px]">14알</p>
                      <p className="text-xs text-gray-500 whitespace-nowrap text-[14px]">각 10mg</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-2 bg-gradient-to-r from-stone-50 to-amber-50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Pill className="text-stone-600 flex-shrink-0" size={16} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">Calcium</p>
                        <p className="text-xs text-gray-500 text-[14px]">하루 2회 • 식사</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-800 text-[16px]">14알</p>
                      <p className="text-xs text-gray-500 whitespace-nowrap text-[14px]">각 500mg</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Pill className="text-amber-600 flex-shrink-0" size={16} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 text-[16px]">기타 약물</p>
                        <p className="text-xs text-gray-500 text-[14px]">다양한 일정</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-800 text-[16px]">14알</p>
                      <p className="text-xs text-gray-500 whitespace-nowrap text-[14px]">일정대로</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-2">
              <div className="bg-white rounded-xl p-3 border border-gray-200">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <p className="font-semibold text-gray-800 min-w-0 text-[18px]">모든 활성 계획</p>
                  <Badge className="bg-gray-100 text-gray-700 flex-shrink-0 whitespace-nowrap text-[14px]">7가지 약물</Badge>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Pill className="text-white" size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 text-[16px]">Vitamin D</p>
                          <p className="text-xs text-gray-500 text-[14px]">1000 IU • 정제</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs text-[14px]">매일</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => onEditMedicine?.('1', 'Vitamin D')}
                        >
                          <Edit2 size={12} className="text-amber-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="pl-10 text-xs text-gray-600 text-[14px]">
                      <Clock size={10} className="inline mr-1" />
                      매일 오전 08:00
                    </div>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Pill className="text-white" size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 text-[16px]">Blood Pressure Med</p>
                          <p className="text-xs text-gray-500 text-[14px]">10mg • 정제</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs whitespace-nowrap text-[14px]">하루 2회</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => onEditMedicine?.('3', 'Blood Pressure Med')}
                        >
                          <Edit2 size={12} className="text-orange-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="pl-10 text-xs text-gray-600 text-[14px]">
                      <Clock size={10} className="inline mr-1" />
                      매일 오후 12:00, 오후 08:00
                    </div>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-lg hover:bg-amber-50 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Pill className="text-white" size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 text-[16px]">Calcium</p>
                          <p className="text-xs text-gray-500 text-[14px]">500mg • 정제</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs whitespace-nowrap text-[14px]">하루 2회</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => onEditMedicine?.('4', 'Calcium')}
                        >
                          <Edit2 size={12} className="text-amber-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="pl-10 text-xs text-gray-600 text-[14px]">
                      <Clock size={10} className="inline mr-1" />
                      매일 오후 02:00, 오후 06:00
                    </div>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-lg hover:bg-stone-50 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-gradient-to-br from-stone-400 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Pill className="text-white" size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 text-[16px]">Sleep Aid</p>
                          <p className="text-xs text-gray-500 text-[14px]">5mg • 정제</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className="text-xs whitespace-nowrap text-[14px]">필요시</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => onEditMedicine?.('5', 'Sleep Aid')}
                        >
                          <Edit2 size={12} className="text-stone-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="pl-10 text-xs text-gray-600 text-[14px]">
                      <Clock size={10} className="inline mr-1" />
                      필요시 오후 09:30
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        </div>

        {/* Schedule Grid */}
        <div className="px-4">
          <div className="space-y-4 pb-6">
          {days.map((day, dayIndex) => (
            <Card key={day} className={`medicine-card p-4 border-0 ${dayIndex === currentDayIndex ? 'ring-2 ring-blue-400 bg-gradient-to-r from-blue-50 to-purple-50' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className={`font-semibold text-[20px] ${dayIndex === currentDayIndex ? 'text-blue-700' : 'text-gray-800'}`}>
                    {day}
                  </h3>
                  <span className="text-sm text-gray-500 text-[16px]">
                    1월 {formatDate(dayIndex)}일
                  </span>
                  {dayIndex === currentDayIndex && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs text-[14px]">오늘</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600 text-[16px]">
                  {scheduleData[day as keyof typeof scheduleData]?.length || 0}회 복용
                </div>
              </div>

              <div className="space-y-3">
                {scheduleData[day as keyof typeof scheduleData]?.map((dose, index) => (
                  <div key={`${dose.id}-${index}`} className={`flex items-center justify-between p-3 bg-gradient-to-r ${getPeriodGradient(dose.period)} rounded-xl border border-white/50`}>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getPeriodIcon(dose.period)}
                        <span className="text-sm font-semibold text-gray-700 text-[16px]">{dose.time}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 text-[16px]">{dose.name}</p>
                        <p className="text-xs text-gray-600 text-[14px]">{dose.dosage}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(dose.status)}
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(dose.status)}`}></div>
                    </div>
                  </div>
                ))}
                
                {(!scheduleData[day as keyof typeof scheduleData] || scheduleData[day as keyof typeof scheduleData].length === 0) && (
                  <div className="text-center py-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <p className="text-sm text-gray-500 text-[16px]">예정된 약이 없습니다</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
