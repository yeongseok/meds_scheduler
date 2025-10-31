import React from 'react';
import { 
  ArrowLeft, 
  Edit, 
  MoreVertical, 
  Clock, 
  Calendar, 
  Pill, 
  AlertCircle,
  CheckCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface MedicineDetailPageProps {
  medicineId: string | null;
  onBack: () => void;
}

export function MedicineDetailPage({ medicineId, onBack }: MedicineDetailPageProps) {
  // Mock medicine data
  const medicine = {
    id: medicineId,
    name: '혈압약',
    genericName: 'Lisinopril',
    dosage: '10mg',
    type: '정',
    frequency: '1일 2회',
    duration: '90일',
    startDate: '2024. 12. 1.',
    endDate: '2025. 3. 1.',
    status: 'active',
    color: 'bg-red-100',
    prescribedBy: '사라 존슨 박사',
    pharmacy: '메디케어 약국',
    instructions: '음식과 함께 복용하세요. 음주를 피하세요.',
    notes: '매주 혈압을 측정하세요',
    sideEffects: '어지럼증, 마른 기침이 발생할 수 있습니다',
    progress: 65,
    totalDoses: 180,
    takenDoses: 117,
    missedDoses: 3,
    nextDose: '오후 12:00 오늘'
  };

  const recentHistory = [
    { date: '2025-01-24', time: '오전 08:00', status: 'taken', note: '' },
    { date: '2025-01-23', time: '오후 08:00', status: 'taken', note: '' },
    { date: '2025-01-23', time: '오전 08:00', status: 'taken', note: '' },
    { date: '2025-01-22', time: '오후 08:00', status: 'missed', note: '복용을 잊었습니다' },
    { date: '2025-01-22', time: '오전 08:00', status: 'taken', note: '' },
    { date: '2025-01-21', time: '오후 08:00', status: 'taken', note: '' },
    { date: '2025-01-21', time: '오전 08:00', status: 'taken', note: '' }
  ];

  const upcomingDoses = [
    { date: '오늘', time: '오후 12:00', status: 'pending' },
    { date: '오늘', time: '오후 08:00', status: 'upcoming' },
    { date: '내일', time: '오전 08:00', status: 'upcoming' },
    { date: '내일', time: '오후 08:00', status: 'upcoming' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'missed':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-orange-500" />;
      case 'upcoming':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  if (!medicineId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-[16px]">약을 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="ml-2 text-[20px]">약 상세 정보</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Edit size={18} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-[16px]">
                <PlayCircle size={16} className="mr-2" />
                지금 복용
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[16px]">
                <PauseCircle size={16} className="mr-2" />
                복용 일시중지
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive text-[16px]">
                약 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Medicine Overview */}
        <Card className="p-4">
          <div className="flex items-start space-x-4">
            <div className={`w-16 h-16 rounded-xl ${medicine.color} flex items-center justify-center`}>
              <Pill size={24} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-[20px]">{medicine.name}</h2>
              <p className="text-muted-foreground text-[16px]">{medicine.genericName}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-[14px]">
                  {medicine.status === 'active' ? '복용 중' : '비활성'}
                </Badge>
                <span className="text-sm text-muted-foreground text-[14px]">•</span>
                <span className="text-sm text-muted-foreground text-[14px]">{medicine.dosage} {medicine.type}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <Card className="p-4">
          <h3 className="mb-3 text-[20px] font-bold">치료 진행도</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[16px]">코스 완료</span>
              <span className="text-[16px]">{medicine.progress}%</span>
            </div>
            <Progress value={medicine.progress} className="h-2" />
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-green-600 font-medium text-[18px]">{medicine.takenDoses}</div>
                <p className="text-xs text-muted-foreground text-[14px]">복용 중</p>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-medium text-[18px]">{medicine.missedDoses}</div>
                <p className="text-xs text-muted-foreground text-[14px]">남음</p>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-medium text-[18px]">{medicine.totalDoses - medicine.takenDoses - medicine.missedDoses}</div>
                <p className="text-xs text-muted-foreground text-[14px]">남은 일</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Dose */}
        <Card className="p-4">
          <h3 className="mb-3 text-[20px] font-bold">다음 복용</h3>
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock size={20} className="text-orange-500" />
              <div>
                <p className="font-medium text-[16px]">{medicine.nextDose}</p>
                <p className="text-sm text-muted-foreground text-[14px]">{medicine.dosage}</p>
              </div>
            </div>
            <Button size="sm" className="text-[16px]">지금 복용</Button>
          </div>
        </Card>

        {/* Schedule */}
        <Card className="p-4">
          <h3 className="mb-3 text-[20px] font-bold">일정 상세</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[16px]">빈도</span>
              <span className="text-[16px]">{medicine.frequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[16px]">기간</span>
              <span className="text-[16px]">{medicine.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[16px]">시작일</span>
              <span className="text-[16px]">{medicine.startDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[16px]">종료일</span>
              <span className="text-[16px]">{medicine.endDate}</span>
            </div>
          </div>
        </Card>

        {/* Upcoming Doses */}
        <Card className="p-4">
          <h3 className="mb-3 text-[20px] font-bold">예정된 복용</h3>
          <div className="space-y-2">
            {upcomingDoses.map((dose, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-background border">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(dose.status)}
                  <div>
                    <p className="text-sm font-medium text-[16px]">{dose.date} {dose.time}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground capitalize text-[14px]">{dose.status === 'pending' ? '대기 중' : '예정'}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent History */}
        <Card className="p-4">
          <h3 className="mb-3 font-bold text-[20px]">최근 기록</h3>
          <div className="space-y-2">
            {recentHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-background border">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(entry.status)}
                  <div>
                    <p className="text-sm font-medium text-[16px]">{entry.date} {entry.time}</p>
                    {entry.note && (
                      <p className="text-xs text-muted-foreground text-[14px]">{entry.note}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground capitalize text-[14px]">{entry.status === 'taken' ? '복용' : '누락'}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Medical Information */}
        <Card className="p-4">
          <h3 className="mb-3 text-[20px] font-bold">의료 정보</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground text-[14px]">처방 의사</p>
              <p className="text-[16px]">{medicine.prescribedBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground text-[14px]">약국</p>
              <p className="text-[16px]">{medicine.pharmacy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground text-[14px]">복용 방법</p>
              <p className="text-[16px]">{medicine.instructions}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground text-[14px]">부작용</p>
              <p className="text-[16px]">{medicine.sideEffects}</p>
            </div>
            {medicine.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground text-[14px]">메모</p>
                <p className="text-[16px]">{medicine.notes}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}