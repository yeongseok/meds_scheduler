import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Pill, Clock, Calendar, TrendingUp, Award, Target, Users, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';

interface MedicineListPageProps {
  onViewMedicine: (medicineId: string) => void;
}

export function MedicineListPage({ onViewMedicine }: MedicineListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedView, setSelectedView] = useState('my-history');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<{ id: string; name: string } | null>(null);

  // Mock data for care recipients
  const careRecipients = [
    {
      id: 'person1',
      name: '엄마 (Linda)',
      initials: 'LM',
      color: 'bg-orange-300',
      relation: '어머니',
      adherence: 88
    },
    {
      id: 'person2',
      name: '아빠 (Robert)',
      initials: 'RM',
      color: 'bg-amber-400',
      relation: '아버지',
      adherence: 94
    }
  ];

  const currentPerson = careRecipients.find(p => p.id === selectedView);

  // Mock data for medicines with enhanced details
  const myMedicines = [
    {
      id: '1',
      name: '비타민 D',
      dosage: '1000 IU',
      type: '정',
      frequency: '1일 1회',
      nextDose: '오전 08:00',
      status: 'active',
      color: 'from-amber-200 to-orange-300',
      bgColor: 'bg-amber-50',
      adherence: 95,
      streak: 12,
      totalDoses: 30,
      takenDoses: 28
    },
    {
      id: '2',
      name: '혈압약',
      dosage: '10mg',
      type: '정',
      frequency: '1일 2회',
      nextDose: '오후 12:00',
      status: 'active',
      color: 'from-orange-300 to-red-400',
      bgColor: 'bg-orange-50',
      adherence: 89,
      streak: 8,
      totalDoses: 60,
      takenDoses: 53
    },
    {
      id: '3',
      name: '칼슘 보충제',
      dosage: '500mg',
      type: '정',
      frequency: '1일 2회',
      nextDose: '오후 06:00',
      status: 'active',
      color: 'from-stone-300 to-amber-300',
      bgColor: 'bg-stone-50',
      adherence: 92,
      streak: 15,
      totalDoses: 60,
      takenDoses: 55
    },
    {
      id: '4',
      name: '수면제',
      dosage: '5mg',
      type: '정',
      frequency: '필요시',
      nextDose: '필요시',
      status: 'active',
      color: 'from-amber-300 to-orange-400',
      bgColor: 'bg-amber-50',
      adherence: 100,
      streak: 5,
      totalDoses: 10,
      takenDoses: 10
    },
    {
      id: '5',
      name: '항생제',
      dosage: '250mg',
      type: '캡슐',
      frequency: '1일 3회',
      nextDose: '완료됨',
      status: 'completed',
      color: 'from-stone-200 to-stone-400',
      bgColor: 'bg-stone-50',
      adherence: 100,
      streak: 7,
      totalDoses: 21,
      takenDoses: 21
    },
    {
      id: '6',
      name: '진통제',
      dosage: '400mg',
      type: '정',
      frequency: '필요시',
      nextDose: '일시중지',
      status: 'paused',
      color: 'from-orange-200 to-amber-300',
      bgColor: 'bg-orange-50',
      adherence: 75,
      streak: 0,
      totalDoses: 20,
      takenDoses: 15
    }
  ];

  const careRecipientMedicines = {
    person1: [
      {
        id: 'p1-1',
        name: '혈압약',
        dosage: '10mg',
        type: '정',
        frequency: '1일 2회',
        nextDose: '오전 09:00',
        status: 'active',
        color: 'from-orange-300 to-red-400',
        bgColor: 'bg-orange-50',
        adherence: 85,
        streak: 20,
        totalDoses: 90,
        takenDoses: 77
      },
      {
        id: 'p1-2',
        name: '비타민 D',
        dosage: '2000 IU',
        type: '정',
        frequency: '1일 1회',
        nextDose: '오전 08:00',
        status: 'active',
        color: 'from-amber-200 to-orange-300',
        bgColor: 'bg-amber-50',
        adherence: 90,
        streak: 25,
        totalDoses: 30,
        takenDoses: 27
      },
      {
        id: 'p1-3',
        name: '관절염약',
        dosage: '200mg',
        type: '정',
        frequency: '1일 1회',
        nextDose: '오후 12:00',
        status: 'active',
        color: 'from-amber-300 to-orange-400',
        bgColor: 'bg-amber-50',
        adherence: 88,
        streak: 18,
        totalDoses: 30,
        takenDoses: 26
      }
    ],
    person2: [
      {
        id: 'p2-1',
        name: '당뇨약',
        dosage: '500mg',
        type: '정',
        frequency: '1일 2회',
        nextDose: '오전 08:00',
        status: 'active',
        color: 'from-orange-200 to-amber-300',
        bgColor: 'bg-orange-50',
        adherence: 96,
        streak: 30,
        totalDoses: 60,
        takenDoses: 58
      },
      {
        id: 'p2-2',
        name: '심장약',
        dosage: '25mg',
        type: '정',
        frequency: '1일 1회',
        nextDose: '오전 09:00',
        status: 'active',
        color: 'from-orange-300 to-red-400',
        bgColor: 'bg-orange-50',
        adherence: 98,
        streak: 45,
        totalDoses: 45,
        takenDoses: 44
      },
      {
        id: 'p2-3',
        name: '콜레스테롤약',
        dosage: '40mg',
        type: '정',
        frequency: '1일 1회',
        nextDose: '오후 08:00',
        status: 'active',
        color: 'from-stone-300 to-amber-300',
        bgColor: 'bg-stone-50',
        adherence: 91,
        streak: 28,
        totalDoses: 30,
        takenDoses: 27
      },
      {
        id: 'p2-4',
        name: '비타민 코스',
        dosage: '100mg',
        type: '캡슐',
        frequency: '1일 1회',
        nextDose: '완료됨',
        status: 'completed',
        color: 'from-stone-200 to-stone-400',
        bgColor: 'bg-stone-50',
        adherence: 100,
        streak: 30,
        totalDoses: 30,
        takenDoses: 30
      }
    ]
  };

  const medicines = selectedView === 'my-history' ? myMedicines : (careRecipientMedicines[selectedView as keyof typeof careRecipientMedicines] || myMedicines);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || medicine.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, adherence: number) => {
    switch (status) {
      case 'active':
        if (adherence >= 90) {
          return <Badge className="bg-amber-100 text-amber-700 border-amber-200">🟢 훌륭함</Badge>;
        } else if (adherence >= 80) {
          return <Badge className="bg-orange-100 text-orange-700 border-orange-200">🟡 좋음</Badge>;
        } else {
          return <Badge className="bg-red-100 text-red-700 border-red-200">🟠 주의 필요</Badge>;
        }
      case 'completed':
        return <Badge className="bg-stone-100 text-stone-700 border-stone-200">✅ 완료됨</Badge>;
      case 'paused':
        return <Badge className="bg-stone-100 text-stone-700 border-stone-200">⏸️ 일시중지</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 10) {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">🔥 {streak}일</Badge>;
    } else if (streak >= 5) {
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">⭐ {streak}일</Badge>;
    } else if (streak > 0) {
      return <Badge className="bg-amber-50 text-amber-600 border-amber-200">✨ {streak}일</Badge>;
    }
    return null;
  };

  const overallAdherence = Math.round(
    filteredMedicines.reduce((sum, med) => sum + med.adherence, 0) / filteredMedicines.length
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header with Gradient */}
      <div className="gradient-success p-6 text-white relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>

              <p className="text-green-100 text-[20px] not-italic font-normal font-bold">
                {selectedView === 'my-history' ? '복약 여정을 추적하세요' : `${currentPerson?.name.split(' ')[0]}님의 여정 추적`}
              </p>
            </div>
          </div>
          
          {/* Overall Stats */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium text-[20px]">
                {selectedView === 'my-history' ? '전체 순응도' : `${currentPerson?.name.split(' ')[0]}님의 순응도`}
              </h3>
              <TrendingUp className="text-green-200" size={20} />
            </div>
            <div className="flex items-center space-x-3">
              <Progress value={overallAdherence} className="flex-1 h-3" />
              <span className="text-white font-bold text-[18px]">{overallAdherence}%</span>
            </div>
            <p className="text-green-100 text-sm mt-1 text-[18px]">
              {selectedView === 'my-history' ? '잘하고 계세요! 💪' : 
                overallAdherence >= 90 ? '🎉 훌륭한 순응도입니다!' : 
                overallAdherence >= 80 ? '👍 좋은 진전입니다' : '⚠️ 주의가 필요합니다'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* View Switcher */}
        {careRecipients.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm p-3 border-0 shadow-md mb-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                {selectedView === 'my-history' ? (
                  <Heart className="text-white" size={18} />
                ) : (
                  <Users className="text-white" size={18} />
                )}
              </div>
              <Select value={selectedView} onValueChange={setSelectedView}>
                <SelectTrigger className="flex-1 border-0 bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="my-history">
                    <div className="flex items-center space-x-2">
                      <Heart size={16} className="text-amber-500" />
                      <span className="font-medium text-base text-[16px]">나의 기록</span>
                    </div>
                  </SelectItem>
                  {careRecipients.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className={`${person.color} text-white text-xs`}>
                            {person.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-base text-[16px]">{person.name}</span>
                        <span className="text-sm text-gray-500 text-[14px]">• {person.relation}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedView !== 'my-history' && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600 flex items-center text-[14px]">
                  <Users size={12} className="mr-1" />
                  보호자로 보기
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="medicine-card p-3 text-center border-0 aspect-square flex flex-col justify-center">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-300 to-amber-400 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Pill className="text-white" size={20} />
            </div>
            <p className="text-gray-800 text-[22px] mb-0.5 font-bold">{medicines.filter(m => m.status === 'active').length}</p>
            <p className="text-gray-700 text-[18px]">복용 중</p>
          </Card>
          <Card className="medicine-card p-3 text-center border-0 aspect-square flex flex-col justify-center">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-300 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Award className="text-white" size={20} />
            </div>
            <p className="text-gray-800 text-[22px] mb-0.5 font-bold">
              {Math.max(...medicines.map(m => m.streak))}
            </p>
            <p className="text-gray-700 text-[18px]">최고 연속</p>
          </Card>
          <Card className="medicine-card p-3 text-center border-0 aspect-square flex flex-col justify-center">
            <div className="w-11 h-11 bg-gradient-to-br from-stone-400 to-amber-400 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Target className="text-white" size={20} />
            </div>
            <p className="text-gray-800 text-[22px] mb-0.5 font-bold">{overallAdherence}%</p>
            <p className="text-gray-700 text-[18px]">순응도</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-3 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="약 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 bg-white"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white border-gray-200 hover:border-orange-400">
                <Filter size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedFilter('all')} className="text-[16px]">
                모든 약
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('active')} className="text-[16px]">
                복용 중만
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('completed')} className="text-[16px]">
                완료됨
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('paused')} className="text-[16px]">
                일시중지
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter Chips */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className={selectedFilter === 'all' ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-[16px]' : 'bg-white border-gray-200 text-[16px]'}
          >
            전체 ({medicines.length})
          </Button>
          <Button
            variant={selectedFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('active')}
            className={selectedFilter === 'active' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-[16px]' : 'bg-white border-gray-200 text-[16px]'}
          >
            복용 중 ({medicines.filter(m => m.status === 'active').length})
          </Button>
          <Button
            variant={selectedFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('completed')}
            className={selectedFilter === 'completed' ? 'bg-gradient-to-r from-stone-400 to-amber-400 text-[16px]' : 'bg-white border-gray-200 text-[16px]'}
          >
            완료됨 ({medicines.filter(m => m.status === 'completed').length})
          </Button>
        </div>

        {/* Medicine List */}
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-stone-200 to-stone-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Pill size={32} className="text-gray-500" />
            </div>
            <h3 className="text-gray-700 mb-2 text-[20px]">약을 찾을 수 없습니다</h3>
            <p className="text-gray-500 text-sm text-[16px]">
              {searchQuery ? '검색어를 조정해 보세요' : '첫 번째 약을 추가하여 시작하세요'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="medicine-card p-5 border-0 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Medicine Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${medicine.color} rounded-2xl flex items-center justify-center relative`}>
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Pill size={16} className="text-gray-600" />
                      </div>
                      {medicine.streak >= 10 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Award size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Medicine Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1 text-[20px]">{medicine.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 text-[16px]">{medicine.dosage} • {medicine.type}</p>
                      
                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 text-[14px]">진행도</span>
                          <span className="text-xs font-medium text-gray-700 text-[14px]">
                            {medicine.takenDoses}/{medicine.totalDoses}
                          </span>
                        </div>
                        <Progress value={(medicine.takenDoses / medicine.totalDoses) * 100} className="h-2" />
                      </div>
                      
                      {/* Schedule Info */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div className="flex items-center space-x-1 whitespace-nowrap">
                          <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-600 text-[14px]">{medicine.frequency}</span>
                        </div>
                        <div className="flex items-center space-x-1 whitespace-nowrap">
                          <Clock size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-600 text-[14px]">다음: {medicine.nextDose}</span>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex items-center space-x-2 flex-wrap">
                        {getStatusBadge(medicine.status, medicine.adherence)}
                        {getStreakBadge(medicine.streak)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewMedicine(medicine.id)}
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-[16px]"
                    >
                      보기
                    </Button>
                    {selectedView === 'my-history' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-destructive text-[16px]"
                            onClick={() => {
                              setMedicineToDelete({ id: medicine.id, name: medicine.name });
                              setDeleteDialogOpen(true);
                            }}
                          >
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                {/* Adherence Visualization */}
                <div className={`${medicine.bgColor} p-3 rounded-xl`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target size={14} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 text-[16px]">순응도</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 text-[16px]">{medicine.adherence}%</span>
                  </div>
                  <Progress value={medicine.adherence} className="h-1 mt-2" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom spacing for navigation */}
        <div className="h-6"></div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90%] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[20px]">약 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-[16px]">
              정말로 "{medicineToDelete?.name}"을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 text-[16px] m-0">취소</AlertDialogCancel>
            <AlertDialogAction 
              className="flex-1 bg-destructive hover:bg-destructive/90 text-[16px] m-0"
              onClick={() => {
                if (medicineToDelete) {
                  toast.success('약이 삭제되었습니다', {
                    description: `${medicineToDelete.name}이(가) 목록에서 제거되었습니다.`,
                    duration: 3000,
                  });
                  setMedicineToDelete(null);
                }
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}