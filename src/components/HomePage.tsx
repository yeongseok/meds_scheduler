import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { SharedHeader, CareRecipient } from './SharedHeader';
import { MedicineCard } from './MedicineCard';
import { ScheduleEmptyState } from './ScheduleEmptyState';
import { HomePageAlertCard } from './HomePageAlertCard';
import { HomePageScheduleHeader } from './HomePageScheduleHeader';
import { AdBanner } from './AdBanner';
import { 
  useAuth, 
  useMedicines, 
  useCareRecipients,
  getTodayDoseRecords,
  getOrCreateTodayDoseRecord,
  markDoseAsTaken,
  markDoseAsSkipped,
  updateDoseRecord
} from '../lib';
import { 
  expandMedicineDoses, 
  groupDosesByTime, 
  calculateTodayStatus,
  parseTimeToMinutes,
  type ExpandedDose 
} from '../lib/utils';

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

export function HomePage({ 
  onViewMedicine, 
  onNavigateToSettings, 
  onNavigateToAddMedicine, 
  newMedicine, 
  onClearNewMedicine, 
  selectedView, 
  setSelectedView 
}: HomePageProps) {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  
  // State - Use Sets for O(1) lookup performance
  const [skippedDoseIds, setSkippedDoseIds] = useState<Set<string>>(new Set());
  const [takenDoseIds, setTakenDoseIds] = useState<Set<string>>(new Set());
  const [doseRecordMap, setDoseRecordMap] = useState<Record<string, string>>({}); // doseId -> recordId
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());

  // Fetch user's medicines with real-time updates
  const { medicines: userMedicines, loading: medicinesLoading } = useMedicines(user?.uid, true);
  
  // Fetch care recipients with real-time updates
  const { recipients: careRecipients, loading: recipientsLoading, getRecipientMedicines } = useCareRecipients(user?.uid, true);
  
  // State for care recipient medicines and dose records
  const [recipientMedicinesMap, setRecipientMedicinesMap] = useState<Record<string, any[]>>({});
  const [doseRecordsMap, setDoseRecordsMap] = useState<Record<string, any[]>>({});
  
  // Update current time every minute for real-time status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Fetch today's dose records for current user or recipient
  useEffect(() => {
    if (!user) return;
    
    const fetchDoseRecords = async () => {
      try {
        const userId = selectedView === 'my-meds' ? user.uid : selectedView;
        const records = await getTodayDoseRecords(userId);
        setDoseRecordsMap(prev => ({ ...prev, [userId]: records }));
      } catch (error) {
        console.error('Error fetching dose records:', error);
      }
    };
    
    fetchDoseRecords();
  }, [user, selectedView]);

  // Fetch care recipient medicines when view changes
  useEffect(() => {
    if (!user || selectedView === 'my-meds') return;
    
    const recipientId = selectedView;
    
    // Check if we already have this recipient's medicines
    if (recipientMedicinesMap[recipientId]) return;
    
    const fetchRecipientMedicines = async () => {
      try {
        const medicines = await getRecipientMedicines(recipientId);
        setRecipientMedicinesMap(prev => ({ ...prev, [recipientId]: medicines }));
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
      }
    };

    fetchRecipientMedicines();
  }, [selectedView, user, getRecipientMedicines, recipientMedicinesMap, language]);

  // Convert care recipients to SharedHeader format
  const careRecipientsForHeader: CareRecipient[] = useMemo(() => {
    return careRecipients.map(recipient => {
      const recipientId = recipient.userId;
      const medicines = recipientMedicinesMap[recipientId] || [];
      const doseRecords = doseRecordsMap[recipientId] || [];
      
      // Expand doses and calculate today's status
      const expandedDoses = expandMedicineDoses(medicines, currentTime, language);
      const todayStatus = calculateTodayStatus(expandedDoses, doseRecords);
      
      return {
        ...recipient,
        id: recipientId,
        name: recipient.guardianName || 'Unknown',
        initials: recipient.guardianName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
        color: 'bg-[#3674B5]',
        relation: recipient.relationship || 'Family',
        adherence: 0,
        todayStatus
      };
    });
  }, [careRecipients, recipientMedicinesMap, doseRecordsMap, currentTime, language]);

  // Get current person if viewing care recipient
  const currentPerson = useMemo(
    () => careRecipientsForHeader.find(p => p.id === selectedView),
    [careRecipientsForHeader, selectedView]
  );

  // Get base medicines for current view
  const baseMedicines = useMemo(
    () => {
      if (selectedView === 'my-meds') {
        return userMedicines;
      } else {
        return recipientMedicinesMap[selectedView] || [];
      }
    },
    [selectedView, userMedicines, recipientMedicinesMap]
  );

  // Expand medicines into individual doses with calculated status
  const expandedDoses = useMemo(() => {
    return expandMedicineDoses(baseMedicines, currentTime, language);
  }, [baseMedicines, currentTime, language]);

  // Get today's dose records for current view
  const todayDoseRecords = useMemo(() => {
    const userId = selectedView === 'my-meds' ? (user?.uid || '') : selectedView;
    return doseRecordsMap[userId] || [];
  }, [selectedView, user, doseRecordsMap]);

  // Update dose statuses based on dose records
  const dosesWithRecordStatus = useMemo(() => {
    return expandedDoses.map(dose => {
      // Find matching dose record for this specific dose
      const record = todayDoseRecords.find(r => 
        r.medicineId === dose.originalMedicineId && 
        r.scheduledTime === dose.doseTime
      );
      
      if (record) {
        // Store mapping
        setDoseRecordMap(prev => ({ ...prev, [dose.doseId]: record.id }));
        
        // Update status based on record
        if (record.status === 'taken' && !skippedDoseIds.has(dose.doseId)) {
          return { ...dose, doseStatus: 'taken' as const };
        } else if (record.status === 'skipped' || skippedDoseIds.has(dose.doseId)) {
          return { ...dose, doseStatus: 'skipped' as const };
        }
      }
      
      // Check local state overrides
      if (takenDoseIds.has(dose.doseId)) {
        return { ...dose, doseStatus: 'taken' as const };
      }
      if (skippedDoseIds.has(dose.doseId)) {
        return { ...dose, doseStatus: 'skipped' as const };
      }
      
      return dose;
    });
  }, [expandedDoses, todayDoseRecords, takenDoseIds, skippedDoseIds]);

  // Sort doses: taken and skipped go to bottom, active doses sorted by time
  const sortedDoses = useMemo(() => {
    return [...dosesWithRecordStatus].sort((a, b) => {
      const aIsCompleted = (a.doseStatus === 'taken' || a.doseStatus === 'skipped') && a.doseStatus !== 'as-needed';
      const bIsCompleted = (b.doseStatus === 'taken' || b.doseStatus === 'skipped') && b.doseStatus !== 'as-needed';
      
      // First, sort by completion status
      if (aIsCompleted !== bIsCompleted) return aIsCompleted ? 1 : -1;
      
      // Then sort by time within the same category
      const aTime = parseTimeToMinutes(a.doseTimeFormatted);
      const bTime = parseTimeToMinutes(b.doseTimeFormatted);
      return aTime - bTime;
    });
  }, [dosesWithRecordStatus]);

  // Group doses by time for display
  const groupedDoses = useMemo(() => {
    return groupDosesByTime(sortedDoses, language);
  }, [sortedDoses, language]);

  // Handlers with useCallback
  const handleTakeMedicine = useCallback(async (doseId: string) => {
    if (!user) return;
    
    setLoadingActions(prev => new Set(prev).add(doseId));
    
    try {
      const dose = dosesWithRecordStatus.find(d => d.doseId === doseId);
      if (!dose) return;
      
      const userId = selectedView === 'my-meds' ? user.uid : selectedView;
      
      // Get or create dose record
      const record = await getOrCreateTodayDoseRecord(
        dose.originalMedicineId,
        userId,
        dose.doseTime
      );
      
      // Mark as taken
      await markDoseAsTaken(record.id, undefined);
      
      // Update local state
      setTakenDoseIds(prev => new Set(prev).add(doseId));
      setSkippedDoseIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(doseId);
        return newSet;
      });
      
      // Refresh dose records
      const records = await getTodayDoseRecords(userId);
      setDoseRecordsMap(prev => ({ ...prev, [userId]: records }));
      
      toast.success(
        language === 'ko' ? '복용 완료!' : 'Dose taken!',
        {
          description: language === 'ko' 
            ? `${dose.name} ${dose.dosage}을(를) 복용하였습니다.`
            : `${dose.name} ${dose.dosage} has been taken.`,
          duration: 2000,
        }
      );
    } catch (error) {
      console.error('Error marking dose as taken:', error);
      toast.error(
        language === 'ko' ? '오류가 발생했습니다' : 'An error occurred',
        {
          description: language === 'ko'
            ? '복용 기록을 저장할 수 없습니다.'
            : 'Could not save dose record.'
        }
      );
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(doseId);
        return newSet;
      });
    }
  }, [user, dosesWithRecordStatus, selectedView, language]);

  const handleSkipMedicine = useCallback(async (doseId: string) => {
    if (!user) return;
    
    setLoadingActions(prev => new Set(prev).add(doseId));
    
    try {
      const dose = dosesWithRecordStatus.find(d => d.doseId === doseId);
      if (!dose) return;
      
      const userId = selectedView === 'my-meds' ? user.uid : selectedView;
      
      // Get or create dose record
      const record = await getOrCreateTodayDoseRecord(
        dose.originalMedicineId,
        userId,
        dose.doseTime
      );
      
      // Mark as skipped
      await markDoseAsSkipped(record.id, undefined);
      
      // Update local state
      setSkippedDoseIds(prev => new Set(prev).add(doseId));
      setTakenDoseIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(doseId);
        return newSet;
      });
      
      // Refresh dose records
      const records = await getTodayDoseRecords(userId);
      setDoseRecordsMap(prev => ({ ...prev, [userId]: records }));
      
      toast.success(
        language === 'ko' ? '건너뛰기 완료' : 'Dose skipped',
        {
          description: language === 'ko'
            ? `${dose.name}을(를) 건너뛰었습니다.`
            : `${dose.name} has been skipped.`,
          duration: 2000,
        }
      );
    } catch (error) {
      console.error('Error marking dose as skipped:', error);
      toast.error(
        language === 'ko' ? '오류가 발생했습니다' : 'An error occurred',
        {
          description: language === 'ko'
            ? '건너뛰기 기록을 저장할 수 없습니다.'
            : 'Could not save skip record.'
        }
      );
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(doseId);
        return newSet;
      });
    }
  }, [user, dosesWithRecordStatus, selectedView, language]);

  const handleUndoTaken = useCallback(async (doseId: string) => {
    if (!user) return;
    
    setLoadingActions(prev => new Set(prev).add(doseId));
    
    try {
      const recordId = doseRecordMap[doseId];
      if (!recordId) {
        // No record yet, just update local state
        setTakenDoseIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(doseId);
          return newSet;
        });
        return;
      }
      
      // Update record to pending
      await updateDoseRecord(recordId, { status: 'pending', takenAt: undefined });
      
      // Update local state
      setTakenDoseIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(doseId);
        return newSet;
      });
      
      // Refresh dose records
      const userId = selectedView === 'my-meds' ? user.uid : selectedView;
      const records = await getTodayDoseRecords(userId);
      setDoseRecordsMap(prev => ({ ...prev, [userId]: records }));
    } catch (error) {
      console.error('Error undoing taken:', error);
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(doseId);
        return newSet;
      });
    }
  }, [user, doseRecordMap, selectedView]);

  const handleUndoSkip = useCallback(async (doseId: string) => {
    if (!user) return;
    
    setLoadingActions(prev => new Set(prev).add(doseId));
    
    try {
      const recordId = doseRecordMap[doseId];
      if (!recordId) {
        // No record yet, just update local state
        setSkippedDoseIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(doseId);
          return newSet;
        });
        return;
      }
      
      // Update record to pending
      await updateDoseRecord(recordId, { status: 'pending' });
      
      // Update local state
      setSkippedDoseIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(doseId);
        return newSet;
      });
      
      // Refresh dose records
      const userId = selectedView === 'my-meds' ? user.uid : selectedView;
      const records = await getTodayDoseRecords(userId);
      setDoseRecordsMap(prev => ({ ...prev, [userId]: records }));
    } catch (error) {
      console.error('Error undoing skip:', error);
    } finally {
      setLoadingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(doseId);
        return newSet;
      });
    }
  }, [user, doseRecordMap, selectedView]);

  const handleUndoPreTaken = useCallback(async (doseId: string) => {
    // This handles pre-taken doses from the database
    await handleUndoTaken(doseId);
  }, [handleUndoTaken]);

  const handleSendReminder = useCallback(() => {
    toast.success(language === 'ko' ? '알림이 전송되었습니다!' : 'Reminder sent!', {
      description: language === 'ko' 
        ? `${currentPerson?.name.split(' ')[0]}님에게 약 복용 알림을 보냈습니다.`
        : `Medication reminder sent to ${currentPerson?.name.split(' ')[0]}.`,
      duration: 3000,
    });
  }, [language, currentPerson]);

  // Handle new medicine from add page
  useEffect(() => {
    if (newMedicine) {
      // New medicines are automatically fetched via real-time listener
      if (onClearNewMedicine) {
        onClearNewMedicine();
      }
    }
  }, [newMedicine, onClearNewMedicine]);

  // Show loading state
  const isLoading = authLoading || medicinesLoading || recipientsLoading;

  return (
    <div className="h-full overflow-y-auto">
      <SharedHeader
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        careRecipients={careRecipientsForHeader}
        setCareRecipients={() => {}} // Care recipients managed by Firebase
        onNavigateToSettings={onNavigateToSettings}
      />

      {/* Ad Banner */}
      <AdBanner />

      <div className="p-4 space-y-6 m-[0px]">
        {/* Alert for Guardian View with Overdue */}
        {selectedView !== 'my-meds' && currentPerson && (currentPerson.todayStatus.overdue || 0) > 0 && (
          <HomePageAlertCard 
            currentPerson={currentPerson} 
            onSendReminder={handleSendReminder} 
          />
        )}

        {/* Today's Schedule */}
        <div>
          <HomePageScheduleHeader 
            selectedView={selectedView} 
            currentPerson={currentPerson} 
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

          <div className="space-y-4">
            {!isLoading && sortedDoses.length === 0 ? (
              <ScheduleEmptyState 
                onAddMedicine={onNavigateToAddMedicine}
                isMyMeds={selectedView === 'my-meds'}
                personName={currentPerson?.name.split(' ')[0]}
              />
            ) : !isLoading && (
              <AnimatePresence mode="sync">
                {groupedDoses.map((group, groupIndex) => (
                  <motion.div
                    key={`${selectedView}-group-${group.time}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ 
                      duration: 0.2,
                      delay: groupIndex * 0.05,
                      ease: "easeOut"
                    }}
                    className="space-y-2"
                  >
                    {/* Time Header */}
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-gray-700 font-semibold text-[16px]">{group.timeFormatted}</span>
                      <div className="flex-1 h-[1px] bg-gray-200"></div>
                    </div>

                    {/* Medicine Cards */}
                    <div className="space-y-2">
                      {group.doses.map((dose) => (
                        <MedicineCard
                          key={`${selectedView}-${dose.doseId}`}
                          medicine={{
                            id: dose.doseId,
                            name: dose.name,
                            dosage: dose.dosage,
                            time: dose.doseTimeFormatted,
                            status: dose.doseStatus,
                            type: dose.type,
                            color: dose.color,
                            bgColor: 'bg-amber-50', // Use consistent color
                            asNeeded: dose.doseStatus === 'as-needed'
                          }}
                          isMyMeds={selectedView === 'my-meds'}
                          isTaken={dose.doseStatus === 'taken'}
                          isSkipped={dose.doseStatus === 'skipped'}
                          isUntaken={false}
                          doseCount={0}
                          onTake={handleTakeMedicine}
                          onSkip={handleSkipMedicine}
                          onUndoTaken={handleUndoTaken}
                          onUndoSkip={handleUndoSkip}
                          onUndoPreTaken={handleUndoPreTaken}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}
