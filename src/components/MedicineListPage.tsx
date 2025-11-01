import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Pill, Clock, Calendar, TrendingUp, Award, Target, Users, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
import { useLanguage } from './LanguageContext';
import { SharedHeader, CareRecipient } from './SharedHeader';

interface MedicineListPageProps {
  onViewMedicine: (medicineId: string) => void;
  onNavigateToSettings?: () => void;
  selectedView?: string;
  setSelectedView?: (view: string) => void;
}

export function MedicineListPage({ onViewMedicine, onNavigateToSettings, selectedView: propSelectedView, setSelectedView: propSetSelectedView }: MedicineListPageProps) {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [localSelectedView, setLocalSelectedView] = useState('my-meds');
  
  // Use props if provided, otherwise use local state
  const selectedView = propSelectedView ?? localSelectedView;
  const setSelectedView = propSetSelectedView ?? setLocalSelectedView;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<{ id: string; name: string } | null>(null);

  // Mock data for care recipients
  const [careRecipients, setCareRecipients] = useState<CareRecipient[]>([
    {
      id: 'person1',
      name: 'Mom (Linda)',
      initials: 'LM',
      color: 'bg-orange-300',
      relation: 'Mother',
      adherence: 88,
      todayStatus: {
        total: 5,
        taken: 3,
        overdue: 0,
        pending: 1,
        upcoming: 1
      }
    },
    {
      id: 'person2',
      name: 'Dad (Robert)',
      initials: 'RM',
      color: 'bg-amber-400',
      relation: 'Father',
      adherence: 94,
      todayStatus: {
        total: 4,
        taken: 3,
        overdue: 0,
        pending: 0,
        upcoming: 1
      }
    }
  ]);

  const currentPerson = careRecipients.find(p => p.id === selectedView);

  // Mock data for medicines with enhanced details
  const myMedicines = [
    {
      id: '1',
      name: language === 'ko' ? '비타민 D' : 'Vitamin D',
      dosage: '1000 IU',
      type: language === 'ko' ? '정' : 'tablet',
      frequency: language === 'ko' ? '1일 1회' : 'Once daily',
      nextDose: language === 'ko' ? '오전 08:00' : '08:00 AM',
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
      name: language === 'ko' ? '혈압약' : 'Blood Pressure Med',
      dosage: '10mg',
      type: language === 'ko' ? '정' : 'tablet',
      frequency: language === 'ko' ? '1일 2회' : 'Twice daily',
      nextDose: language === 'ko' ? '오후 12:00' : '12:00 PM',
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
      name: language === 'ko' ? '칼슘 보충제' : 'Calcium Supplement',
      dosage: '500mg',
      type: language === 'ko' ? '정' : 'tablet',
      frequency: language === 'ko' ? '1일 2회' : 'Twice daily',
      nextDose: language === 'ko' ? '오후 06:00' : '06:00 PM',
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
      name: language === 'ko' ? '수면제' : 'Sleep Aid',
      dosage: '5mg',
      type: language === 'ko' ? '정' : 'tablet',
      frequency: language === 'ko' ? '필요시' : 'As needed',
      nextDose: language === 'ko' ? '필요시' : 'As needed',
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
      name: language === 'ko' ? '항생제' : 'Antibiotic',
      dosage: '250mg',
      type: language === 'ko' ? '캡슐' : 'capsule',
      frequency: language === 'ko' ? '1일 3회' : '3 times daily',
      nextDose: language === 'ko' ? '완료됨' : 'Completed',
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
      name: language === 'ko' ? '진통제' : 'Pain Reliever',
      dosage: '400mg',
      type: language === 'ko' ? '정' : 'tablet',
      frequency: language === 'ko' ? '필요시' : 'As needed',
      nextDose: language === 'ko' ? '일시중지' : 'Paused',
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
        name: language === 'ko' ? '혈압약' : 'Blood Pressure Med',
        dosage: '10mg',
        type: language === 'ko' ? '정' : 'tablet',
        frequency: language === 'ko' ? '1일 2회' : 'Twice daily',
        nextDose: language === 'ko' ? '오전 09:00' : '09:00 AM',
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
        name: language === 'ko' ? '비타민 D' : 'Vitamin D',
        dosage: '2000 IU',
        type: language === 'ko' ? '정' : 'tablet',
        frequency: language === 'ko' ? '1일 1회' : 'Once daily',
        nextDose: language === 'ko' ? '오전 08:00' : '08:00 AM',
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
        name: language === 'ko' ? '관절염약' : 'Arthritis Med',
        dosage: '200mg',
        type: language === 'ko' ? '정' : 'tablet',
        frequency: language === 'ko' ? '1일 1회' : 'Once daily',
        nextDose: language === 'ko' ? '오후 12:00' : '12:00 PM',
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
        name: language === 'ko' ? '당뇨약' : 'Diabetes Med',
        dosage: '500mg',
        type: language === 'ko' ? '정' : 'tablet',
        frequency: language === 'ko' ? '1일 2회' : 'Twice daily',
        nextDose: language === 'ko' ? '오전 08:00' : '08:00 AM',
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
        name: language === 'ko' ? '심장약' : 'Heart Med',
        dosage: '25mg',
        type: language === 'ko' ? '정' : 'tablet',
        frequency: language === 'ko' ? '1일 1회' : 'Once daily',
        nextDose: language === 'ko' ? '오전 09:00' : '09:00 AM',
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
        name: language === 'ko' ? '콜레스테롤약' : 'Cholesterol Med',
        dosage: '40mg',
        type: language === 'ko' ? '정' : 'tablet',
        frequency: language === 'ko' ? '1일 1회' : 'Once daily',
        nextDose: language === 'ko' ? '오후 08:00' : '08:00 PM',
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
        name: language === 'ko' ? '비타민 코스' : 'Vitamin Course',
        dosage: '100mg',
        type: language === 'ko' ? '캡슐' : 'capsule',
        frequency: language === 'ko' ? '1일 1회' : 'Once daily',
        nextDose: language === 'ko' ? '완료됨' : 'Completed',
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
          return <Badge className="bg-amber-100 text-amber-700 border-amber-200">🟢 {language === 'ko' ? '훌륭함' : 'Excellent'}</Badge>;
        } else if (adherence >= 80) {
          return <Badge className="bg-orange-100 text-orange-700 border-orange-200">🟡 {language === 'ko' ? '좋음' : 'Good'}</Badge>;
        } else {
          return <Badge className="bg-red-100 text-red-700 border-red-200">🟠 {language === 'ko' ? '주의 필요' : 'Needs Attention'}</Badge>;
        }
      case 'completed':
        return <Badge className="bg-stone-100 text-stone-700 border-stone-200">✅ {language === 'ko' ? '완료됨' : 'Completed'}</Badge>;
      case 'paused':
        return <Badge className="bg-stone-100 text-stone-700 border-stone-200">⏸️ {language === 'ko' ? '일시중지' : 'Paused'}</Badge>;
      default:
        return <Badge variant="outline">{language === 'ko' ? '알 수 없음' : 'Unknown'}</Badge>;
    }
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 10) {
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">🔥 {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    } else if (streak >= 5) {
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">⭐ {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    } else if (streak > 0) {
      return <Badge className="bg-amber-50 text-amber-600 border-amber-200">✨ {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    }
    return null;
  };

  const overallAdherence = Math.round(
    filteredMedicines.reduce((sum, med) => sum + med.adherence, 0) / filteredMedicines.length
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      <SharedHeader
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        careRecipients={careRecipients}
        setCareRecipients={setCareRecipients}
        onNavigateToSettings={onNavigateToSettings}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Search and Filter */}
        <div className="flex space-x-3 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={language === 'ko' ? '약 검색...' : 'Search medications...'}
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
                {language === 'ko' ? '모든 약' : 'All Medications'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('active')} className="text-[16px]">
                {language === 'ko' ? '복용 중만' : 'Active Only'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('completed')} className="text-[16px]">
                {language === 'ko' ? '완료됨' : 'Completed'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedFilter('paused')} className="text-[16px]">
                {language === 'ko' ? '일시중지' : 'Paused'}
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
            {language === 'ko' ? '전체' : 'All'} ({medicines.length})
          </Button>
          <Button
            variant={selectedFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('active')}
            className={selectedFilter === 'active' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-[16px]' : 'bg-white border-gray-200 text-[16px]'}
          >
            {language === 'ko' ? '복용 중' : 'Active'} ({medicines.filter(m => m.status === 'active').length})
          </Button>
          <Button
            variant={selectedFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('completed')}
            className={selectedFilter === 'completed' ? 'bg-gradient-to-r from-stone-400 to-amber-400 text-[16px]' : 'bg-white border-gray-200 text-[16px]'}
          >
            {language === 'ko' ? '완료됨' : 'Completed'} ({medicines.filter(m => m.status === 'completed').length})
          </Button>
        </div>

        {/* Medicine List */}
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-stone-200 to-stone-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Pill size={32} className="text-gray-500" />
            </div>
            <h3 className="text-gray-700 mb-2 text-[20px]">{language === 'ko' ? '약을 찾을 수 없습니다' : 'No medications found'}</h3>
            <p className="text-gray-500 text-sm text-[16px]">
              {searchQuery 
                ? (language === 'ko' ? '검색어를 조정해 보세요' : 'Try adjusting your search')
                : (language === 'ko' ? '첫 번째 약을 추가하여 시작하세요' : 'Add your first medication to get started')}
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
                          <span className="text-xs text-gray-500 text-[14px]">{language === 'ko' ? '진행도' : 'Progress'}</span>
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
                          <span className="text-xs text-gray-600 text-[14px]">{language === 'ko' ? '다음' : 'Next'}: {medicine.nextDose}</span>
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
                      {language === 'ko' ? '보기' : 'View'}
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
                            {language === 'ko' ? '삭제' : 'Delete'}
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
                      <span className="text-sm font-medium text-gray-700 text-[16px]">{language === 'ko' ? '순응도' : 'Adherence'}</span>
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
            <AlertDialogTitle className="text-[20px]">
              {language === 'ko' ? '약 삭제' : 'Delete Medication'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[16px]">
              {language === 'ko' 
                ? `정말로 "${medicineToDelete?.name}"을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.`
                : `Are you sure you want to delete "${medicineToDelete?.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
            <AlertDialogCancel className="flex-1 text-[16px] m-0">
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="flex-1 bg-destructive hover:bg-destructive/90 text-[16px] m-0"
              onClick={() => {
                if (medicineToDelete) {
                  toast.success(
                    language === 'ko' ? '약이 삭제되었습니다' : 'Medication deleted',
                    {
                      description: language === 'ko' 
                        ? `${medicineToDelete.name}이(가) 목록에서 제거되었습니다.`
                        : `${medicineToDelete.name} has been removed from your list.`,
                      duration: 3000,
                    }
                  );
                  setMedicineToDelete(null);
                }
              }}
            >
              {language === 'ko' ? '삭제' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}