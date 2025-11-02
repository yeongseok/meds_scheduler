import React, { useState } from 'react';
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
import { HistorySearchFilter } from './HistorySearchFilter';
import { HistoryFilterChips } from './HistoryFilterChips';
import { HistoryEmptyState } from './HistoryEmptyState';
import { HistoryMedicineCard } from './HistoryMedicineCard';

interface MedicineListPageProps {
  onViewMedicine: (medicineId: string) => void;
  onNavigateToSettings?: () => void;
  selectedView?: string;
  setSelectedView?: (view: string) => void;
}

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  type: string;
  frequency: string;
  nextDose: string;
  status: string;
  color: string;
  bgColor: string;
  adherence: number;
  streak: number;
  totalDoses: number;
  takenDoses: number;
}

export function MedicineListPage({ onViewMedicine, onNavigateToSettings, selectedView: propSelectedView, setSelectedView: propSetSelectedView }: MedicineListPageProps) {
  const { language } = useLanguage();
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

  // Mock data for medicines with enhanced details
  const myMedicines: Medicine[] = [
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

  const careRecipientMedicines: Record<string, Medicine[]> = {
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

  const medicines = selectedView === 'my-history' ? myMedicines : (careRecipientMedicines[selectedView] || myMedicines);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || medicine.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = () => {
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
  };

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
        <HistorySearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          language={language}
        />

        {/* Filter Chips */}
        <HistoryFilterChips
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          medicines={medicines}
          language={language}
        />

        {/* Medicine List */}
        {filteredMedicines.length === 0 ? (
          <HistoryEmptyState searchQuery={searchQuery} language={language} />
        ) : (
          <div className="space-y-4">
            {filteredMedicines.map((medicine) => (
              <HistoryMedicineCard
                key={medicine.id}
                medicine={medicine}
                language={language}
                showActions={true}
                onView={() => onViewMedicine(medicine.id)}
                onDelete={selectedView === 'my-history' ? () => {
                  setMedicineToDelete({ id: medicine.id, name: medicine.name });
                  setDeleteDialogOpen(true);
                } : undefined}
              />
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
              onClick={handleDelete}
            >
              {language === 'ko' ? '삭제' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
