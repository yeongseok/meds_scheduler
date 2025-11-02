import React, { useEffect, useRef, useState } from 'react';
import { Users, ChevronDown, Activity, CheckCircle, AlertCircle, XCircle, Heart, TrendingUp, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { SharedHeader, CareRecipient } from './SharedHeader';
import { useAuth, useCareRecipients } from '../lib/hooks';

interface GuardianViewPageProps {
  onNavigateToSettings?: () => void;
}

export function GuardianViewPage({ onNavigateToSettings }: GuardianViewPageProps) {
  const [selectedView, setSelectedView] = useState('person1');

  // Mock data for people being cared for
  const [careRecipients, setCareRecipients] = useState<CareRecipient[]>([
    {
      id: 'person1',
      name: '엄마 (Linda)',
      initials: 'LM',
      color: 'bg-orange-300',
      relation: '어머니',
      todayStatus: {
        total: 5,
        taken: 1,
        overdue: 1,
        pending: 1,
        upcoming: 2
      },
      healthScore: 75,
      adherence: 88
    },
    {
      id: 'person2',
      name: '아빠 (Robert)',
      initials: 'RM',
      color: 'bg-amber-300',
      relation: '아버지',
      todayStatus: {
        total: 4,
        taken: 3,
        overdue: 0,
        pending: 0,
        upcoming: 1
      },
      healthScore: 92,
      adherence: 96
    }
  ]);

  const legacyCareRecipients = useRef<CareRecipient[]>(careRecipients);
  const emptyCareRecipient = useRef<CareRecipient>({
    id: 'empty',
    name: '보호 대상 없음 (No Care Recipients)',
    initials: '??',
    color: 'bg-gray-300',
    relation: '보호 대상 없음',
    todayStatus: {
      total: 0,
      taken: 0,
      overdue: 0,
      pending: 0,
      upcoming: 0
    },
    healthScore: 0,
    adherence: 0
  });

  const { user } = useAuth();
  const {
    recipients: guardianRecipients,
    loading: recipientsLoading,
    error: recipientsError
  } = useCareRecipients(user?.uid, false);

  useEffect(() => {
    if (!user || recipientsError) {
      setCareRecipients(legacyCareRecipients.current.map(recipient => ({ ...recipient })));
      setSelectedView(current =>
        legacyCareRecipients.current.some(recipient => recipient.id === current)
          ? current
          : legacyCareRecipients.current[0]?.id ?? 'person1'
      );
      return;
    }

    if (guardianRecipients.length > 0) {
      const mappedRecipients = guardianRecipients.map(recipient => ({
        id: recipient.id,
        name: recipient.name,
        initials: recipient.initials,
        color: recipient.color || 'bg-sky-400',
        relation: recipient.relation,
        todayStatus: {
          total: 0,
          taken: 0,
          overdue: 0,
          pending: 0,
          upcoming: 0
        },
        healthScore: 0,
        adherence: 0
      }));
      setCareRecipients(mappedRecipients);
      setSelectedView(current =>
        mappedRecipients.some(item => item.id === current)
          ? current
          : mappedRecipients[0]?.id ?? emptyCareRecipient.current.id
      );
      return;
    }

    if (!recipientsLoading) {
      setCareRecipients([{ ...emptyCareRecipient.current }]);
      setSelectedView(emptyCareRecipient.current.id);
    }
  }, [
    user,
    guardianRecipients,
    recipientsLoading,
    recipientsError,
    legacyCareRecipients,
    emptyCareRecipient
  ]);

  const currentPerson =
    careRecipients.find(p => p.id === selectedView) ||
    careRecipients[0] ||
    emptyCareRecipient.current;
  const weeklyAdherence = currentPerson.adherence || 0;
  const isPlaceholderView = selectedView === emptyCareRecipient.current.id;

  if (isPlaceholderView) {
    return (
      <div className="h-full overflow-y-auto">
        {/* Shared Header */}
        <SharedHeader
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          careRecipients={careRecipients}
          setCareRecipients={setCareRecipients}
          showMe={false}
          onNavigateToSettings={onNavigateToSettings}
        />

        <div className="p-4 space-y-4 -mt-2">
          {user && recipientsError && (
            <Card className="bg-rose-50 border border-rose-200 text-rose-600 shadow-none">
              <p className="text-sm font-semibold">
                돌봄 대상을 불러오지 못했습니다. (Failed to load care recipients.)
              </p>
              <p className="text-xs mt-1 text-rose-500">
                잠시 후 다시 시도해 주세요. (Please try again in a moment.)
              </p>
            </Card>
          )}

          {user && recipientsLoading && !recipientsError && (
            <Card className="bg-sky-50 border border-sky-100 text-sky-700 shadow-none">
              <p className="text-sm font-semibold">
                돌봄 대상 정보를 불러오는 중입니다. (Loading care recipients...)
              </p>
            </Card>
          )}

          <Card className="bg-sky-50 border border-sky-100 text-sky-700 shadow-none">
            <p className="text-sm font-semibold">
              연결된 돌봄 대상이 없습니다. (No care recipients yet.)
            </p>
            <p className="text-xs mt-1 text-sky-600">
              상단의 초대 버튼으로 가족을 추가해 주세요. (Use the invite button above to add a family member.)
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Mock medicine schedule data
  const medicineSchedule = [
    {
      id: '1',
      name: '비타민 D',
      dosage: '1000 IU',
      time: '오전 08:00',
      status: 'taken',
      takenAt: '오전 08:15',
      color: 'from-amber-300 to-orange-400'
    },
    {
      id: '2',
      name: '아스피린',
      dosage: '75mg',
      time: '오전 09:00',
      status: 'overdue',
      overdueBy: '3시간',
      color: 'from-red-300 to-red-400'
    },
    {
      id: '3',
      name: '혈압약',
      dosage: '10mg',
      time: '오후 12:00',
      status: 'pending',
      color: 'from-rose-300 to-rose-400'
    },
    {
      id: '4',
      name: '칼슘',
      dosage: '500mg',
      time: '오후 06:00',
      status: 'upcoming',
      color: 'from-emerald-300 to-teal-400'
    },
    {
      id: '5',
      name: '수면제',
      dosage: '5mg',
      time: '오후 10:00',
      status: 'upcoming',
      color: 'from-stone-300 to-amber-400'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="text-emerald-500" size={18} />;
      case 'overdue':
        return <XCircle className="text-red-600" size={18} />;
      case 'pending':
        return <AlertCircle className="text-amber-500 animate-pulse" size={18} />;
      default:
        return <Activity className="text-blue-500" size={18} />;
    }
  };

  const getStatusBadge = (medicine: any) => {
    switch (medicine.status) {
      case 'taken':
        return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">✓ {medicine.takenAt} 복용</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-700 border-red-300 text-xs animate-pulse">⚠️ 기한 초과 ({medicine.overdueBy})</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">⏰ 지금 복용</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">예정</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Shared Header */}
      <SharedHeader
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        careRecipients={careRecipients}
        setCareRecipients={setCareRecipients}
        showMe={false}
        onNavigateToSettings={onNavigateToSettings}
      />

      <div className="p-4 space-y-4 -mt-2">
        {user && recipientsError && (
          <Card className="bg-rose-50 border border-rose-200 text-rose-600 shadow-none">
            <p className="text-sm font-semibold">
              돌봄 대상을 불러오지 못했습니다. (Failed to load care recipients.)
            </p>
            <p className="text-xs mt-1 text-rose-500">
              잠시 후 다시 시도해 주세요. (Please try again in a moment.)
            </p>
          </Card>
        )}

        {user && recipientsLoading && !recipientsError && (
          <Card className="bg-sky-50 border border-sky-100 text-sky-700 shadow-none">
            <p className="text-sm font-semibold">
              돌봄 대상 정보를 불러오는 중입니다. (Loading care recipients...)
            </p>
          </Card>
        )}

        {/* Quick Status Overview */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="p-3 text-center border-0 shadow-sm bg-white">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-300 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="text-white" size={18} />
            </div>
            <p className="font-bold text-gray-800">{currentPerson.todayStatus.taken}</p>
            <p className="text-xs text-gray-600">복용</p>
          </Card>
          
          <Card className="p-3 text-center border-0 shadow-sm bg-white">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-2 animate-pulse">
              <XCircle className="text-white" size={18} />
            </div>
            <p className="font-bold text-gray-800">{currentPerson.todayStatus.overdue}</p>
            <p className="text-xs text-gray-600">기한 초과</p>
          </Card>
          
          <Card className="p-3 text-center border-0 shadow-sm bg-white">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-300 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="text-white" size={18} />
            </div>
            <p className="font-bold text-gray-800">{currentPerson.todayStatus.pending}</p>
            <p className="text-xs text-gray-600">지금</p>
          </Card>
          
          <Card className="p-3 text-center border-0 shadow-sm bg-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Activity className="text-white" size={18} />
            </div>
            <p className="font-bold text-gray-800">{currentPerson.todayStatus.upcoming}</p>
            <p className="text-xs text-gray-600">나중에</p>
          </Card>
        </div>

        {/* Health Score Card */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Heart className="text-rose-500" size={20} />
              <span>오늘의 건강 점수</span>
            </h3>
            <span className="text-2xl font-bold text-gray-800">{currentPerson.healthScore}%</span>
          </div>
          <Progress value={currentPerson.healthScore} className="h-3 mb-2" />
          <p className="text-xs text-gray-600">
            {currentPerson.healthScore >= 80 ? '🎉 훌륭한 순응도입니다!' : currentPerson.healthScore >= 60 ? '👍 좋은 진전입니다' : '⚠️ 주의가 필요합니다'}
          </p>
        </Card>

        {/* Today's Schedule */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Calendar className="text-teal-600" size={20} />
              <span>오늘의 일정</span>
            </h2>
            <span className="text-sm text-gray-500">
              {currentPerson.todayStatus.total}개 중 {currentPerson.todayStatus.taken}개 복용
            </span>
          </div>

          <div className="space-y-3">
            {medicineSchedule.map((medicine) => (
              <Card 
                key={medicine.id} 
                className={`p-4 border-0 shadow-sm ${
                  medicine.status === 'overdue' ? 'bg-red-50 border-2 border-red-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-12 h-12 bg-gradient-to-r ${medicine.color} rounded-xl flex items-center justify-center relative`}>
                      <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        {getStatusIcon(medicine.status)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${medicine.status === 'overdue' ? 'text-red-800' : 'text-gray-800'}`}>
                        {medicine.name}
                      </h3>
                      <p className="text-sm text-gray-600">{medicine.dosage} • {medicine.time}</p>
                      <div className="mt-1">
                        {getStatusBadge(medicine)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Weekly Adherence */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <TrendingUp className="text-indigo-500" size={20} />
              <span>이번 주</span>
            </h3>
            <span className="text-sm font-medium text-gray-600">{weeklyAdherence}% 순응도</span>
          </div>
          
          <Progress value={weeklyAdherence} className="h-3 mb-3" />
          
          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
            <span>일</span>
          </div>

          <div className="flex justify-around pt-3 border-t">
            <div className="text-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-gray-600">24개 복용</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-gray-600">3개 누락</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
              <p className="text-xs text-gray-600">4개 예정</p>
            </div>
          </div>
        </Card>

        {/* Alert for Overdue */}
        {currentPerson.todayStatus.overdue > 0 && (
          <Card className="p-4 bg-red-50 border-red-200 border-2">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-red-700" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">주의 필요</h3>
                <p className="text-sm text-red-800">
                  {currentPerson.name.split(' ')[0]}님이 {currentPerson.todayStatus.overdue}개의 약을 기한 내에 복용하지 않았습니다. 
                  확인해 주세요.
                </p>
                <Button size="sm" className="mt-3 bg-red-600 hover:bg-red-700 text-white h-8">
                  리마인더 보내기
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="h-6"></div>
      </div>
    </div>
  );
}
