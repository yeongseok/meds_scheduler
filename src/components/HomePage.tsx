import React, { useState, useEffect } from 'react';
import { Settings, Plus, CheckCircle, Clock, AlertCircle, Heart, Activity, Zap, XCircle, Users, ChevronDown, RotateCcw, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

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
}

export function HomePage({ onViewMedicine, onNavigateToSettings, onNavigateToAddMedicine, newMedicine, onClearNewMedicine }: HomePageProps) {
  const [selectedView, setSelectedView] = useState('my-meds');
  const [skippedMedicines, setSkippedMedicines] = useState<string[]>([]);
  const [takenMedicines, setTakenMedicines] = useState<string[]>([]);
  const [addedMedicines, setAddedMedicines] = useState<NewMedicine[]>([]);

  // Mock data for users I'm a guardian for
  const careRecipients = [
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
  ];
  // Mock data for today's medicines
  // My medicines data
  const myMedicines = [
    {
      id: '1',
      name: 'Vitamin D',
      dosage: '1000 IU',
      time: '08:00 AM',
      status: 'taken',
      type: 'tablet',
      color: 'from-amber-200 to-orange-300',
      bgColor: 'bg-amber-50'
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
      asNeeded: true
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
      asNeeded: false
    },
    {
      id: '4',
      name: 'Calcium',
      dosage: '500mg',
      time: '06:00 PM',
      status: 'upcoming',
      type: 'tablet',
      color: 'from-stone-300 to-amber-300',
      bgColor: 'bg-stone-50'
    },
    {
      id: '5',
      name: 'Sleep Aid',
      dosage: '5mg',
      time: '10:00 PM',
      status: 'upcoming',
      type: 'tablet',
      color: 'from-stone-300 to-amber-400',
      bgColor: 'bg-stone-50'
    }
  ];

  // Medicine data for care recipients
  const careRecipientMedicines = {
    person1: [
      {
        id: 'p1-1',
        name: 'Vitamin D',
        dosage: '1000 IU',
        time: '08:00 AM',
        status: 'taken',
        takenAt: '08:15 AM',
        color: 'from-amber-200 to-orange-300'
      },
      {
        id: 'p1-2',
        name: 'Aspirin',
        dosage: '75mg',
        time: '09:00 AM',
        status: 'overdue',
        overdueBy: '3 hours',
        color: 'from-orange-300 to-red-400'
      },
      {
        id: 'p1-3',
        name: 'Blood Pressure',
        dosage: '10mg',
        time: '12:00 PM',
        status: 'pending',
        color: 'from-amber-300 to-orange-400'
      },
      {
        id: 'p1-4',
        name: 'Calcium',
        dosage: '500mg',
        time: '06:00 PM',
        status: 'upcoming',
        color: 'from-stone-300 to-amber-300'
      },
      {
        id: 'p1-5',
        name: 'Sleep Aid',
        dosage: '5mg',
        time: '10:00 PM',
        status: 'upcoming',
        color: 'from-stone-300 to-amber-400'
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
        color: 'from-amber-200 to-orange-300'
      },
      {
        id: 'p2-2',
        name: 'Heart Medication',
        dosage: '25mg',
        time: '09:00 AM',
        status: 'taken',
        takenAt: '09:10 AM',
        color: 'from-orange-200 to-amber-300'
      },
      {
        id: 'p2-3',
        name: 'Vitamin B12',
        dosage: '100mcg',
        time: '12:00 PM',
        status: 'taken',
        takenAt: '12:05 PM',
        color: 'from-amber-300 to-orange-400'
      },
      {
        id: 'p2-4',
        name: 'Calcium',
        dosage: '600mg',
        time: '08:00 PM',
        status: 'upcoming',
        color: 'from-stone-300 to-amber-300'
      }
    ]
  };

  const currentPerson = careRecipients.find(p => p.id === selectedView);
  const baseMedicines = selectedView === 'my-meds' ? myMedicines : (careRecipientMedicines[selectedView as keyof typeof careRecipientMedicines] || myMedicines);
  const todayMedicines = selectedView === 'my-meds' ? [...addedMedicines, ...baseMedicines] : baseMedicines;

  // Handle new medicine from add page
  useEffect(() => {
    if (newMedicine) {
      setAddedMedicines(prev => [newMedicine, ...prev]);
      if (onClearNewMedicine) {
        onClearNewMedicine();
      }
    }
  }, [newMedicine, onClearNewMedicine]);

  const handleTakeMedicine = (medicineId: string) => {
    setTakenMedicines([...takenMedicines, medicineId]);
    console.log('Took medicine:', medicineId);
  };

  const handleSkipMedicine = (medicineId: string) => {
    setSkippedMedicines([...skippedMedicines, medicineId]);
    console.log('Skipped medicine:', medicineId);
  };

  const handleUndoTaken = (medicineId: string) => {
    setTakenMedicines(takenMedicines.filter(id => id !== medicineId));
    console.log('Undid taken for medicine:', medicineId);
  };

  const handleUndoSkip = (medicineId: string) => {
    setSkippedMedicines(skippedMedicines.filter(id => id !== medicineId));
    console.log('Undid skip for medicine:', medicineId);
  };

  const handleSendReminder = () => {
    toast.success('알림이 전송되었습니다!', {
      description: `${currentPerson?.name.split(' ')[0]}님에게 약 복용 알림을 보냈습니다.`,
      duration: 3000,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="text-amber-600" size={20} />;
      case 'overdue':
        return <XCircle className="text-orange-600 animate-pulse" size={20} />;
      case 'pending':
        return <AlertCircle className="text-amber-500 animate-pulse" size={20} />;
      case 'upcoming':
        return <Clock className="text-stone-500" size={20} />;
      default:
        return <Clock className="text-stone-400" size={20} />;
    }
  };

  const getStatusBadge = (status: string, overdueBy?: string) => {
    switch (status) {
      case 'taken':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-sm">✓ 복용완료</Badge>;
      case 'overdue':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300 animate-pulse text-sm">⚠️ 지연 {overdueBy && `(${overdueBy})`}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 animate-pulse text-sm">⏰ 복용시간</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">📅  예정</Badge>;
      default:
        return <Badge variant="outline" className="text-sm">알 수 없음</Badge>;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header with Gradient */}
      <div className="gradient-primary p-6 text-white relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>

              <p className="text-orange-100 text-[20px] font-bold">2025년 1월 24일 금요일</p>
            </div>
            <Button 
              variant="secondary" 
              size="icon" 
              className="bg-white/20 hover:bg-white/30 border-0"
              onClick={onNavigateToSettings}
            >
              <Settings size={20} className="text-white" />
            </Button>
          </div>

          {/* Health Score */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium text-[20px]">
                {selectedView === 'my-meds' ? "오늘의 건강 점수" : `${currentPerson?.name.split(' ')[0]}의 건강 점수`}
              </h3>
              <Heart className="text-orange-200" size={20} />
            </div>
            <div className="flex items-center space-x-3">
              <Progress value={selectedView === 'my-meds' ? 85 : (currentPerson?.healthScore || 85)} className="flex-1 h-3" />
              <span className="text-white font-bold text-xl text-[18px]">{selectedView === 'my-meds' ? 85 : (currentPerson?.healthScore || 85)}%</span>
            </div>
            <p className="text-orange-100 text-base mt-1 text-[18px]">
              {selectedView === 'my-meds' ? '잘하고 있어요! 계속 유지하세요! 💪' : 
                (currentPerson?.healthScore || 0) >= 80 ? '🎉 완벽한 복용률!' : 
                (currentPerson?.healthScore || 0) >= 60 ? '👍 좋은 진전' : '⚠️ 주의 필요'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-2">
        {/* View Switcher */}
        {careRecipients.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm p-3 border-0 shadow-md">
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
                      <Heart size={16} className="text-amber-500" />
                      <span className="font-medium text-base">내 약</span>
                    </div>
                  </SelectItem>
                  {careRecipients.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className={`${person.color} text-white text-sm`}>
                            {person.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-base">{person.name}</span>
                        <span className="text-sm text-gray-500">• {person.relation === 'Mother' ? '어머니' : person.relation === 'Father' ? '아버지' : person.relation}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedView !== 'my-meds' && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600 flex items-center text-[16px]">
                  <Users size={14} className="mr-1" />
                  보호자로 보기
                </p>
              </div>
            )}
          </Card>
        )}



        {/* Alert for Guardian View with Overdue */}
        {selectedView !== 'my-meds' && (currentPerson?.todayStatus.overdue || 0) > 0 && (
          <Card className="p-4 bg-orange-50 border-orange-200 border-2">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-orange-700" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1 text-lg text-[18px]">주의 필요</h3>
                <p className="text-base text-orange-800 text-[16px]">
                  {currentPerson?.name.split(' ')[0]}님은 {currentPerson?.todayStatus.overdue}개의 약을 복용하지 않았습니다. 
                  확인해 주세요.
                </p>
                <Button className="mt-3 bg-orange-600 hover:bg-orange-700 text-white h-10 text-base" onClick={handleSendReminder}>
                  알림 보내기
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
              <span className="text-xl font-bold text-[18px]">{selectedView === 'my-meds' ? "오늘의 일정" : `${currentPerson?.name.split(' ')[0]}의 일정`}</span>
            </h2>
            {selectedView === 'my-meds' && (
              <Button 
                variant="ghost" 
                className="text-amber-600 hover:text-amber-700 text-base font-bold font-normal h-10 text-[18px]"
                onClick={onNavigateToAddMedicine}
              >
                <Plus size={18} className="mr-1" />
                추가
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {todayMedicines.map((medicine, index) => (
                <motion.div
                  key={medicine.id}
                  initial={{ 
                    opacity: 0, 
                    x: -100,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: 1
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: 100,
                    scale: 0.8
                  }}
                  transition={{ 
                    duration: 0.6,
                    delay: index < addedMedicines.length ? 0 : 0,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <Card 
                    className={`medicine-card p-3 border-0 hover:shadow-lg transition-all duration-200 ${
                      medicine.status === 'overdue' ? 'border-2 border-orange-300 bg-orange-50/50' : ''
                    }`}
                  >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Medicine Icon */}
                    <div className={`w-14 h-14 bg-gradient-to-r ${medicine.color} rounded-2xl flex items-center justify-center relative ${
                      medicine.status === 'overdue' ? 'ring-2 ring-orange-400' : ''
                    }`}>
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        {getStatusIcon(medicine.status)}
                      </div>
                    </div>
                    
                    {/* Medicine Info */}
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${medicine.status === 'overdue' ? 'text-orange-800' : 'text-gray-800'}`}>
                        {medicine.name}
                      </h3>
                      <p className="text-base text-gray-600">
                        {medicine.dosage} • {medicine.time}
                        {'asNeeded' in medicine && medicine.asNeeded && (
                          <span className="ml-2 text-sm text-blue-600">• 필요시 복용</span>
                        )}
                      </p>
                      <div className="mt-1">
                        {selectedView === 'my-meds' ? (
                          <>
                            {getStatusBadge(medicine.status, medicine.overdueBy)}
                          </>
                        ) : (
                          <>
                            {medicine.status === 'taken' && 'takenAt' in medicine && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-sm">
                                ✓ {medicine.takenAt} 복용
                              </Badge>
                            )}
                            {medicine.status === 'overdue' && (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-sm animate-pulse">
                                ⚠️ 지연 ({medicine.overdueBy})
                              </Badge>
                            )}
                            {medicine.status === 'pending' && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-sm">
                                ⏰ 복용시간
                              </Badge>
                            )}
                            {medicine.status === 'upcoming' && (
                              <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">
                                예정
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedView === 'my-meds' && (
                    <div className="flex flex-col items-end space-y-2">
                      {medicine.status === 'taken' && !takenMedicines.includes(medicine.id) && !skippedMedicines.includes(medicine.id) && (
                        <Button
                          variant="outline"
                          className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                        >
                          <RotateCcw size={16} className="mr-1.5" />
                          취소
                        </Button>
                      )}
                      {medicine.status === 'overdue' && !takenMedicines.includes(medicine.id) && !skippedMedicines.includes(medicine.id) && (
                        <>
                          <Button 
                            className="h-10 px-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-base"
                            onClick={() => handleTakeMedicine(medicine.id)}
                          >
                            지금 복용
                          </Button>
                          {'asNeeded' in medicine && medicine.asNeeded && (
                            <Button 
                              variant="outline"
                              className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                              onClick={() => handleSkipMedicine(medicine.id)}
                            >
                              건너뛰기
                            </Button>
                          )}
                        </>
                      )}
                      {medicine.status === 'pending' && !takenMedicines.includes(medicine.id) && !skippedMedicines.includes(medicine.id) && (
                        <>
                          <Button 
                            className="h-10 px-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-base"
                            onClick={() => handleTakeMedicine(medicine.id)}
                          >
                            지금 복용
                          </Button>
                          {'asNeeded' in medicine && medicine.asNeeded && (
                            <Button 
                              variant="outline"
                              className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                              onClick={() => handleSkipMedicine(medicine.id)}
                            >
                              건너뛰기
                            </Button>
                          )}
                        </>
                      )}
                      {takenMedicines.includes(medicine.id) && (
                        <>
                          <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1 text-sm">
                            <CheckCircle size={14} /> 복용완료
                          </Badge>
                          <Button
                            variant="outline"
                            className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                            onClick={() => handleUndoTaken(medicine.id)}
                          >
                            <RotateCcw size={16} className="mr-1.5" />
                            취소
                          </Button>
                        </>
                      )}
                      {skippedMedicines.includes(medicine.id) && (
                        <>
                          <Badge className="bg-gray-100 text-gray-600 border-gray-300 flex items-center gap-1 text-sm">
                            <X size={14} /> 건너뜀
                          </Badge>
                          <Button
                            variant="outline"
                            className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                            onClick={() => handleUndoSkip(medicine.id)}
                          >
                            <RotateCcw size={16} className="mr-1.5" />
                            취소
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
            ))}
          </AnimatePresence>
          </div>
        </div>

        {/* Quick Actions - Only show for my own meds */}


        {/* Weekly Progress */}
        <Card className="medicine-card p-3 border-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 flex items-center space-x-2">
              <Activity className="text-amber-600" size={20} />
              <span className="text-[18px] font-bold">이번 주</span>
            </h3>
            <span className="text-sm text-gray-500">92% 복용률</span>
          </div>
          
          <div className="space-y-2">
            <Progress value={92} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span>토</span>
              <span>일</span>
            </div>
          </div>
          
          <div className="flex justify-between mt-4 text-sm">
            <div className="text-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mx-auto mb-1"></div>
              <span className="text-gray-600">28회 복용</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
              <span className="text-gray-600">2회 누락</span>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-stone-400 rounded-full mx-auto mb-1"></div>
              <span className="text-gray-600">5회 예정</span>
            </div>
          </div>
        </Card>

        {/* Bottom spacing for navigation */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}