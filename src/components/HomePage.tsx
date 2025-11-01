import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertCircle, Heart, Activity, Zap, XCircle, Users, ChevronDown, RotateCcw, X, UserPlus, Bell, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { SharedHeader, CareRecipient } from './SharedHeader';

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

export function HomePage({ onViewMedicine, onNavigateToSettings, onNavigateToAddMedicine, newMedicine, onClearNewMedicine, selectedView, setSelectedView }: HomePageProps) {
  const { t, language } = useLanguage();
  const [skippedMedicines, setSkippedMedicines] = useState<string[]>([]);
  const [takenMedicines, setTakenMedicines] = useState<string[]>([]);
  const [addedMedicines, setAddedMedicines] = useState<NewMedicine[]>([]);

  // Mock data for users I'm a guardian for
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
    toast.success(language === 'ko' ? '알림이 전송되었습니다!' : 'Reminder sent!', {
      description: language === 'ko' 
        ? `${currentPerson?.name.split(' ')[0]}님에게 약 복용 알림을 보냈습니다.`
        : `Medication reminder sent to ${currentPerson?.name.split(' ')[0]}.`,
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
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-sm">✓ {t('home.status.taken')}</Badge>;
      case 'overdue':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300 animate-pulse text-sm">⚠️ {t('home.status.overdue')} {overdueBy && `(${overdueBy})`}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 animate-pulse text-sm">⏰ {t('home.status.pending')}</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">📅 {t('home.status.upcoming')}</Badge>;
      default:
        return <Badge variant="outline" className="text-sm">{language === 'ko' ? '알 수 없음' : 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <SharedHeader
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        careRecipients={careRecipients}
        setCareRecipients={setCareRecipients}
        onNavigateToSettings={onNavigateToSettings}
      />

      <div className="p-4 space-y-6 -mt-2">
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
                  initial={{ 
                    opacity: 0, 
                    y: 10
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -10
                  }}
                  transition={{ 
                    duration: 0.2,
                    delay: index * 0.03,
                    ease: "easeOut"
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
                          <span className="ml-2 text-sm text-blue-600">• {t('home.status.asNeeded')}</span>
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
                                ✓ {medicine.takenAt} {language === 'ko' ? '복용' : 'taken'}
                              </Badge>
                            )}
                            {medicine.status === 'overdue' && (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-sm animate-pulse">
                                ⚠️ {t('home.status.overdue')} ({medicine.overdueBy})
                              </Badge>
                            )}
                            {medicine.status === 'pending' && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-sm">
                                ⏰ {t('home.status.pending')}
                              </Badge>
                            )}
                            {medicine.status === 'upcoming' && (
                              <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">
                                {t('home.status.upcoming')}
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
                          {language === 'ko' ? '취소' : 'Cancel'}
                        </Button>
                      )}
                      {medicine.status === 'overdue' && !takenMedicines.includes(medicine.id) && !skippedMedicines.includes(medicine.id) && (
                        <>
                          <Button 
                            className="h-10 px-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-base"
                            onClick={() => handleTakeMedicine(medicine.id)}
                          >
                            {t('home.actions.take')}
                          </Button>
                          {'asNeeded' in medicine && medicine.asNeeded && (
                            <Button 
                              variant="outline"
                              className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                              onClick={() => handleSkipMedicine(medicine.id)}
                            >
                              {t('home.actions.skip')}
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
                            {t('home.actions.take')}
                          </Button>
                          {'asNeeded' in medicine && medicine.asNeeded && (
                            <Button 
                              variant="outline"
                              className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                              onClick={() => handleSkipMedicine(medicine.id)}
                            >
                              {t('home.actions.skip')}
                            </Button>
                          )}
                        </>
                      )}
                      {takenMedicines.includes(medicine.id) && (
                        <>
                          <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1 text-sm">
                            <CheckCircle size={14} /> {t('home.status.taken')}
                          </Badge>
                          <Button
                            variant="outline"
                            className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                            onClick={() => handleUndoTaken(medicine.id)}
                          >
                            <RotateCcw size={16} className="mr-1.5" />
                            {t('home.actions.undo')}
                          </Button>
                        </>
                      )}
                      {skippedMedicines.includes(medicine.id) && (
                        <>
                          <Badge className="bg-gray-100 text-gray-600 border-gray-300 flex items-center gap-1 text-sm">
                            <X size={14} /> {language === 'ko' ? '건너뜀' : 'Skipped'}
                          </Badge>
                          <Button
                            variant="outline"
                            className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                            onClick={() => handleUndoSkip(medicine.id)}
                          >
                            <RotateCcw size={16} className="mr-1.5" />
                            {t('home.actions.undo')}
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


        {/* Bottom spacing for navigation */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}