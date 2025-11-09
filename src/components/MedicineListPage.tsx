import React, { useState, useEffect, useMemo } from 'react';
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
import { AdBanner } from './AdBanner';
import { useAuth, useMedicines, useCareRecipients, getUserDoseRecords, deleteMedicine as deleteMedicineDB } from '../lib';
import { enrichMedicineWithStats } from '../lib/utils';
import { MedicineWithStats } from '../lib/types';

interface MedicineListPageProps {
  onViewMedicine: (medicineId: string) => void;
  onNavigateToSettings?: () => void;
  selectedView?: string;
  setSelectedView?: (view: string) => void;
}

export function MedicineListPage({ onViewMedicine, onNavigateToSettings, selectedView: propSelectedView, setSelectedView: propSetSelectedView }: MedicineListPageProps) {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [localSelectedView, setLocalSelectedView] = useState('my-meds');
  
  // Use props if provided, otherwise use local state
  const selectedView = propSelectedView ?? localSelectedView;
  const setSelectedView = propSetSelectedView ?? setLocalSelectedView;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState<{ id: string; name: string } | null>(null);

  // Fetch user's medicines with real-time updates
  const { medicines: userMedicines, loading: medicinesLoading, deleteMedicine } = useMedicines(user?.uid, true);
  
  // Fetch care recipients with real-time updates
  const { recipients: careRecipients, loading: recipientsLoading, getRecipientMedicines } = useCareRecipients(user?.uid, true);
  
  // State for care recipient medicines
  const [recipientMedicinesMap, setRecipientMedicinesMap] = useState<Record<string, MedicineWithStats[]>>({});
  const [loadingRecipientMeds, setLoadingRecipientMeds] = useState<Record<string, boolean>>({});

  // Fetch dose records and enrich medicines with stats
  const [enrichedMedicines, setEnrichedMedicines] = useState<MedicineWithStats[]>([]);
  
  useEffect(() => {
    if (!user || !userMedicines.length) {
      setEnrichedMedicines([]);
      return;
    }

    const enrichMedicines = async () => {
      const enriched = await Promise.all(
        userMedicines.map(async (medicine) => {
          try {
            // Get dose records for this medicine (last 90 days)
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 90);
            const doseRecords = await getUserDoseRecords(user.uid, startDate);
            const medicineDoseRecords = doseRecords.filter(r => r.medicineId === medicine.id);
            
            return enrichMedicineWithStats(medicine, medicineDoseRecords, language);
          } catch (error) {
            console.error('Error enriching medicine:', error);
            // Return medicine with default stats if error
            return {
              ...medicine,
              adherence: 100,
              streak: 0,
              totalDoses: 0,
              takenDoses: 0,
              nextDose: language === 'ko' ? '필요시' : 'As needed',
              bgColor: 'bg-gray-50'
            } as MedicineWithStats;
          }
        })
      );
      setEnrichedMedicines(enriched);
    };

    enrichMedicines();
  }, [userMedicines, user, language]);

  // Fetch care recipient medicines when view changes
  useEffect(() => {
    if (!user || selectedView === 'my-meds' || selectedView === 'my-history') return;
    
    const recipientId = selectedView;
    
    // Check if we already have this recipient's medicines
    if (recipientMedicinesMap[recipientId]) return;
    
    const fetchRecipientMedicines = async () => {
      setLoadingRecipientMeds(prev => ({ ...prev, [recipientId]: true }));
      
      try {
        const medicines = await getRecipientMedicines(recipientId);
        
        // Enrich recipient medicines with stats
        const enriched = await Promise.all(
          medicines.map(async (medicine) => {
            try {
              const startDate = new Date();
              startDate.setDate(startDate.getDate() - 90);
              const doseRecords = await getUserDoseRecords(recipientId, startDate);
              const medicineDoseRecords = doseRecords.filter(r => r.medicineId === medicine.id);
              
              return enrichMedicineWithStats(medicine, medicineDoseRecords, language);
            } catch (error) {
              console.error('Error enriching recipient medicine:', error);
              return {
                ...medicine,
                adherence: 100,
                streak: 0,
                totalDoses: 0,
                takenDoses: 0,
                nextDose: language === 'ko' ? '필요시' : 'As needed',
                bgColor: 'bg-gray-50'
              } as MedicineWithStats;
            }
          })
        );
        
        setRecipientMedicinesMap(prev => ({ ...prev, [recipientId]: enriched }));
      } catch (error) {
        console.error('Error fetching recipient medicines:', error);
        toast.error(
          language === 'ko' ? '약 정보를 불러올 수 없습니다' : 'Could not load medications',
          {
            description: language === 'ko' 
              ? '권한이 없거나 오류가 발생했습니다.'
              : 'No permission or an error occurred.'
          }
        );
      } finally {
        setLoadingRecipientMeds(prev => ({ ...prev, [recipientId]: false }));
      }
    };

    fetchRecipientMedicines();
  }, [selectedView, user, getRecipientMedicines, recipientMedicinesMap, language]);

  // Convert care recipients to SharedHeader format
  const careRecipientsForHeader: CareRecipient[] = useMemo(() => {
    return careRecipients.map(recipient => ({
      ...recipient,
      name: recipient.guardianName || 'Unknown',
      initials: recipient.guardianName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
      color: 'bg-[#3674B5]',
      relation: recipient.relationship || 'Family',
      adherence: 0, // Will be calculated if needed
      todayStatus: {
        total: 0,
        taken: 0,
        overdue: 0,
        pending: 0,
        upcoming: 0
      }
    }));
  }, [careRecipients]);

  // Get medicines based on selected view
  const medicines = useMemo(() => {
    if (selectedView === 'my-meds' || selectedView === 'my-history') {
      return enrichedMedicines;
    } else {
      // Care recipient view
      return recipientMedicinesMap[selectedView] || [];
    }
  }, [selectedView, enrichedMedicines, recipientMedicinesMap]);

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || medicine.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async () => {
    if (medicineToDelete && user) {
      try {
        await deleteMedicine(medicineToDelete.id);
        toast.success(
          language === 'ko' ? '약이 삭제되었습니다' : 'Medication deleted',
          {
            description: language === 'ko' 
              ? `${medicineToDelete.name}이(가) 목록에서 제거되었습니다.`
              : `${medicineToDelete.name} has been removed from your list.`,
            duration: 3000,
          }
        );
        setDeleteDialogOpen(false);
        setMedicineToDelete(null);
      } catch (error) {
        console.error('Error deleting medicine:', error);
        toast.error(
          language === 'ko' ? '삭제 실패' : 'Delete failed',
          {
            description: language === 'ko' 
              ? '약을 삭제하는 중 오류가 발생했습니다.'
              : 'An error occurred while deleting the medication.'
          }
        );
      }
    }
  };

  // Show loading state
  const isLoading = authLoading || medicinesLoading || recipientsLoading || loadingRecipientMeds[selectedView];

  return (
    <div className="h-full flex flex-col bg-white">
      <SharedHeader
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        careRecipients={careRecipientsForHeader}
        setCareRecipients={() => {}} // Care recipients are managed by Firebase
        onNavigateToSettings={onNavigateToSettings}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Ad Banner */}
        <AdBanner />
        
        <div className="px-4 pb-4">
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3674B5] border-r-transparent mb-2"></div>
                <p className="text-gray-500">
                  {language === 'ko' ? '불러오는 중...' : 'Loading...'}
                </p>
              </div>
            </div>
          )}

          {/* Medicine List */}
          {!isLoading && filteredMedicines.length === 0 ? (
            <HistoryEmptyState searchQuery={searchQuery} language={language} />
          ) : !isLoading && (
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
