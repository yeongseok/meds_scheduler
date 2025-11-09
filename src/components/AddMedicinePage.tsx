import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Clock, Plus, Trash2, Pill, Droplets, Syringe, Sparkles, Calendar as CalendarIcon, Users, Check, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { TimePicker } from './TimePicker';
import { useLanguage } from './LanguageContext';
import { useAuth, useCareRecipients, addMedicine } from '../lib';
import type { Medicine } from '../lib/types';

interface AddMedicinePageProps {
  onBack: () => void;
  onAddMedicine?: () => void;
}

export function AddMedicinePage({ onBack, onAddMedicine }: AddMedicinePageProps) {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  
  // Fetch care recipients with real-time updates
  const { recipients: careRecipients, loading: recipientsLoading } = useCareRecipients(user?.uid, true);
  
  // Form States
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medicineType, setMedicineType] = useState<Medicine['type']>('tablet');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(),
    to: undefined,
  });
  const [doseTimes, setDoseTimes] = useState<string[]>(['09:00', '21:00']);
  const [asNeeded, setAsNeeded] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['myself']);
  const [selectedDays, setSelectedDays] = useState<string[]>(['일', '월', '화', '수', '목', '금', '토']);
  const [takingTime, setTakingTime] = useState('');
  
  // Medical Information states
  const [prescribedBy, setPrescribedBy] = useState('');
  const [pharmacy, setPharmacy] = useState('');
  const [instructions, setInstructions] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  
  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  
  const daysOfWeek = [
    { id: '일', label: language === 'ko' ? '일' : 'Sun', fullLabel: language === 'ko' ? '일요일' : 'Sunday' },
    { id: '월', label: language === 'ko' ? '월' : 'Mon', fullLabel: language === 'ko' ? '월요일' : 'Monday' },
    { id: '화', label: language === 'ko' ? '화' : 'Tue', fullLabel: language === 'ko' ? '화요일' : 'Tuesday' },
    { id: '수', label: language === 'ko' ? '수' : 'Wed', fullLabel: language === 'ko' ? '수요일' : 'Wednesday' },
    { id: '목', label: language === 'ko' ? '목' : 'Thu', fullLabel: language === 'ko' ? '목요일' : 'Thursday' },
    { id: '금', label: language === 'ko' ? '금' : 'Fri', fullLabel: language === 'ko' ? '금요일' : 'Friday' },
    { id: '토', label: language === 'ko' ? '토' : 'Sat', fullLabel: language === 'ko' ? '토요일' : 'Saturday' }
  ];

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      // Don't allow deselecting if it's the only one selected
      if (selectedUsers.length > 1) {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
      }
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const medicineTypes: Array<{
    value: Medicine['type'];
    label: string;
    icon: any;
    color: string;
    bgColor: string;
  }> = [
    { value: 'tablet', label: language === 'ko' ? '정제' : 'Tablet', icon: Pill, color: 'bg-brand-primary', bgColor: 'bg-brand-surface' },
    { value: 'capsule', label: language === 'ko' ? '캡슐' : 'Capsule', icon: Pill, color: 'bg-brand-secondary', bgColor: 'bg-brand-surface' },
    { value: 'liquid', label: language === 'ko' ? '액상' : 'Liquid', icon: Droplets, color: 'bg-brand-accent', bgColor: 'bg-brand-surface' },
    { value: 'injection', label: language === 'ko' ? '주사' : 'Injection', icon: Syringe, color: 'bg-brand-primary', bgColor: 'bg-brand-light' },
    { value: 'cream', label: language === 'ko' ? '크림' : 'Cream', icon: Sparkles, color: 'bg-brand-primary', bgColor: 'bg-brand-surface' },
    { value: 'inhaler', label: language === 'ko' ? '흡입기' : 'Inhaler', icon: Pill, color: 'bg-brand-accent', bgColor: 'bg-brand-surface' },
    { value: 'other', label: language === 'ko' ? '기타' : 'Other', icon: Pill, color: 'bg-brand-secondary', bgColor: 'bg-brand-surface' }
  ];

  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const toggleAllDays = () => {
    if (selectedDays.length === daysOfWeek.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(daysOfWeek.map(d => d.id));
    }
  };

  const allDaysSelected = selectedDays.length === daysOfWeek.length;

  const handleSave = async () => {
    // Validation
    if (!medicineName.trim()) {
      toast.error(language === 'ko' ? '약 이름을 입력해주세요' : 'Please enter medicine name');
      return;
    }
    if (!dosage.trim()) {
      toast.error(language === 'ko' ? '용량을 입력해주세요' : 'Please enter dosage');
      return;
    }
    if (!user) {
      toast.error(language === 'ko' ? '로그인이 필요합니다' : 'Login required');
      return;
    }
    if (!asNeeded && doseTimes.length === 0) {
      toast.error(language === 'ko' ? '복용 시간을 추가해주세요' : 'Please add dose times');
      return;
    }

    setIsSaving(true);

    try {
      // Calculate duration from date range
      const startDate = dateRange.from || new Date();
      const endDate = dateRange.to || new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // Default 30 days
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Calculate frequency
      let frequencyText = '';
      if (asNeeded) {
        frequencyText = language === 'ko' ? '필요시' : 'As needed';
      } else {
        const timesPerDay = doseTimes.length;
        if (language === 'ko') {
          frequencyText = timesPerDay === 1 ? '매일' : `하루 ${timesPerDay}회`;
        } else {
          frequencyText = timesPerDay === 1 ? 'Daily' : `${timesPerDay}x daily`;
        }
      }

      // Prepare medicine data
      const medicineData: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: user.uid,
        name: medicineName,
        dosage: dosage,
        type: medicineType,
        color: '#3674B5', // Use standard blue color
        frequency: frequencyText,
        times: asNeeded ? [] : doseTimes,
        duration: durationDays,
        startDate: startDate,
        endDate: endDate,
        status: 'active',
        prescribedBy: prescribedBy || undefined,
        pharmacy: pharmacy || undefined,
        instructions: instructions || takingTime || undefined,
        notes: notes || medicalNotes || undefined,
        sideEffects: sideEffects || undefined,
        reminderEnabled: reminderEnabled,
        soundEnabled: true,
        vibrationEnabled: true,
      };

      // Save medicine for each selected user
      const savePromises: Promise<string>[] = [];
      
      if (selectedUsers.includes('myself')) {
        // Save for current user
        savePromises.push(addMedicine(medicineData));
      }
      
      // Save for care recipients
      for (const recipient of careRecipients) {
        if (selectedUsers.includes(recipient.userId)) {
          // Save medicine with recipient's userId
          savePromises.push(addMedicine({
            ...medicineData,
            userId: recipient.userId
          }));
        }
      }

      // Wait for all saves to complete
      await Promise.all(savePromises);

      // Show success message
      const names: string[] = [];
      if (selectedUsers.includes('myself')) {
        names.push(language === 'ko' ? '나' : 'Me');
      }
      careRecipients.forEach((person) => {
        if (selectedUsers.includes(person.userId)) {
          names.push(person.guardianName.split(' ')[0]);
        }
      });

      if (selectedUsers.length === 1) {
        toast.success(
          language === 'ko' 
            ? `${medicineName} 약이 저장되었습니다! 💊`
            : `${medicineName} has been saved! 💊`
        );
      } else {
        toast.success(
          language === 'ko'
            ? `${medicineName} 약이 ${names.join(', ')}에게 저장되었습니다! 💊`
            : `${medicineName} has been saved for ${names.join(', ')}! 💊`
        );
      }

      // Call onAddMedicine callback and navigate back
      if (onAddMedicine) {
        onAddMedicine();
      }
      
      setTimeout(() => {
        onBack();
      }, 1000);

    } catch (error: any) {
      console.error('Error saving medicine:', error);
      toast.error(
        language === 'ko'
          ? `저장 실패: ${error.message}`
          : `Failed to save: ${error.message}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="gradient-primary p-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="ml-2 text-xl font-bold text-[18px]">
              {language === 'ko' ? '새 약 추가 💊' : 'Add New Medicine 💊'}
            </h1>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-white/20 hover:bg-white/30 text-white border-0 text-[16px] disabled:opacity-50"
          >
            {isSaving ? (
              language === 'ko' ? '저장 중...' : 'Saving...'
            ) : (
              selectedUsers.length > 1 
                ? (language === 'ko' ? `${selectedUsers.length}명 저장` : `Save for ${selectedUsers.length}`) 
                : (language === 'ko' ? '저장' : 'Save')
            )}
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* User Selection */}
        <Card className="medicine-card p-4 border-0">
          <div className="mb-4">
            <h3 className="flex items-center space-x-2 text-gray-800 mb-2 text-[16px] font-bold">
              <Users className="text-brand-accent" size={20} />
              <span className="text-[20px]">
                {language === 'ko' ? '복용 대상' : 'Who takes this?'}
              </span>
            </h3>
            <p className="text-sm text-gray-600 text-[18px]">
              {language === 'ko' 
                ? '이 약을 복용할 사람을 선택하세요'
                : 'Select who will take this medication'}
            </p>
          </div>

          <div className="space-y-3">
            {/* Myself Option */}
            <div
              onClick={() => toggleUserSelection('myself')}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedUsers.includes('myself')
                  ? 'border-brand-primary bg-brand-surface'
                  : 'border-gray-200 bg-white hover:border-brand-secondary'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-brand-primary text-gray-800">
                      {language === 'ko' ? '나' : 'Me'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800 text-[16px]">
                      {language === 'ko' ? '나' : 'Myself'}
                    </p>
                    <p className="text-sm text-gray-600 text-[14px]">
                      {language === 'ko' ? '내 약에 추가' : 'Add to my medicines'}
                    </p>
                  </div>
                </div>
                {selectedUsers.includes('myself') && (
                  <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                    <Check className="text-white" size={18} />
                  </div>
                )}
              </div>
            </div>

            {/* Care Recipients */}
            {recipientsLoading && (
              <div className="text-center py-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#3674B5] border-r-transparent"></div>
              </div>
            )}
            
            {!recipientsLoading && careRecipients.map((person) => (
              <div
                key={person.userId}
                onClick={() => toggleUserSelection(person.userId)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedUsers.includes(person.userId)
                    ? 'border-brand-primary bg-brand-surface'
                    : 'border-gray-200 bg-white hover:border-brand-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-[#3674B5] text-white">
                        {person.guardianName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800 text-[16px]">{person.guardianName}</p>
                      <p className="text-sm text-gray-600 text-[14px]">{person.relationship}</p>
                    </div>
                  </div>
                  {selectedUsers.includes(person.userId) && (
                    <div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                      <Check className="text-white" size={18} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selection Summary */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 text-[18px]">
                  <span className="font-semibold">{selectedUsers.length}</span>
                  {language === 'ko' ? '명에게 추가' : ' selected'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.includes('myself') && (
                    <Badge className="bg-brand-surface text-brand-accent border-brand-primary text-[16px]">
                      {language === 'ko' ? '나' : 'Me'}
                    </Badge>
                  )}
                  {careRecipients.map((person) => 
                    selectedUsers.includes(person.userId) && (
                      <Badge key={person.userId} className="bg-brand-surface text-brand-accent border-brand-primary text-[16px]">
                        {person.guardianName.split(' ')[0]}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Multi-user Info */}
        {selectedUsers.length > 1 && (
          <Card className="p-3 bg-brand-surface border-brand-primary border-2">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="text-brand-accent" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1 text-[16px]">
                  {language === 'ko' ? '여러 사람에게 추가' : 'Adding for multiple people'}
                </h4>
                <p className="text-sm text-gray-700 text-[14px]">
                  {language === 'ko'
                    ? `동일한 약 세부정보, 일정 및 알림이 선택된 모든 ${selectedUsers.length}명에게 생성됩니다. 각 사람의 개별 프로필에서 나중에 일정을 맞춤 설정할 수 있습니다.`
                    : `The same medication details, schedule, and reminders will be created for all ${selectedUsers.length} selected people. You can customize schedules later in each person's individual profile.`}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Medicine Photo */}
        <Card className="medicine-card p-4 border-0">
          <Label className="block mb-3 flex items-center space-x-2">
            <Camera className="text-brand-accent" size={18} />
            <span className="text-[20px] font-bold">
              {language === 'ko' ? '약 사진 (선택사항)' : 'Medicine Photo (Optional)'}
            </span>
          </Label>
          <div className="border-2 border-dashed border-brand-primary rounded-2xl p-6 text-center bg-brand-surface hover:bg-brand-light transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Camera size={24} className="text-gray-700" />
            </div>
            <p className="text-gray-600 font-medium">
              {language === 'ko' ? '탭하여 사진 추가' : 'Tap to add photo'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'ko' ? '약을 쉽게 식별할 수 있습니다' : 'Helps identify medication easily'}
            </p>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Pill className="text-brand-accent" size={20} />
            <span className="text-[20px] font-bold">
              {language === 'ko' ? '기본 정보' : 'Basic Information'}
            </span>
          </h3>
          
          <div className="space-y-3">
            <Label htmlFor="medicine-name" className="text-gray-700 text-[16px]">
              {language === 'ko' ? '약 이름 *' : 'Medicine Name *'}
            </Label>
            <Input
              id="medicine-name"
              placeholder={language === 'ko' ? '약 이름 입력' : 'Enter medicine name'}
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white text-[16px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="dosage" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '용량 *' : 'Dosage *'}
              </Label>
              <Input
                id="dosage"
                placeholder={language === 'ko' ? '예: 500mg' : 'e.g., 500mg'}
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white text-[16px]"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="medicine-type" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '유형' : 'Type'}
              </Label>
              <Select value={medicineType} onValueChange={(value) => setMedicineType(value as Medicine['type'])}>
                <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white">
                  <SelectValue placeholder={language === 'ko' ? '유형 선택' : 'Select type'} />
                </SelectTrigger>
                <SelectContent>
                  {medicineTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 ${type.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent size={12} className="text-white" />
                          </div>
                          <span className="text-[16px]">{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Schedule */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Clock className="text-brand-accent" size={20} />
            <span className="text-[20px] font-bold">
              {language === 'ko' ? '일정' : 'Schedule'}
            </span>
          </h3>
          
          {/* Date Range Selection */}
          <div className="space-y-3">
            <Label className="text-gray-700 text-[16px]">
              {language === 'ko' ? '복용 기간' : 'Duration'}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-12 border-gray-200 hover:border-brand-primary bg-white rounded-xl text-[16px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-brand-accent" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                      </>
                    ) : (
                      dateRange.from.toLocaleDateString()
                    )
                  ) : (
                    <span className="text-gray-400">
                      {language === 'ko' ? '시작 및 종료 날짜 선택' : 'Select start and end date'}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                  initialFocus
                  numberOfMonths={1}
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            {dateRange?.from && dateRange?.to && (
              <div className="p-3 bg-brand-surface rounded-xl">
                <p className="text-sm text-gray-700">
                  📅 {language === 'ko' ? '기간: ' : 'Duration: '}
                  {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))}
                  {language === 'ko' ? '일' : ' days'}
                </p>
              </div>
            )}
          </div>

          {/* Days of Dose */}
          <div className="space-y-3">
            <Label className="text-gray-700 text-[16px]">
              {language === 'ko' ? '복용 요일' : 'Days of Week'}
            </Label>
            
            {/* Select All Days */}
            <div className="flex items-center space-x-3 p-3 bg-brand-surface rounded-xl border border-brand-primary">
              <Checkbox 
                id="select-all-days"
                checked={allDaysSelected}
                onCheckedChange={toggleAllDays}
                className="border-brand-primary data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
              />
              <Label 
                htmlFor="select-all-days" 
                className="text-gray-700 cursor-pointer flex-1 text-[16px]"
              >
                {language === 'ko' ? '매일' : 'Every day'}
              </Label>
              {allDaysSelected && (
                <Check size={16} className="text-brand-accent" />
              )}
            </div>

            {/* Individual Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                    selectedDays.includes(day.id)
                      ? 'bg-brand-accent text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-brand-primary'
                  }`}
                >
                  <span className={selectedDays.includes(day.id) ? '' : 'text-gray-700'}>
                    {day.label}
                  </span>
                </button>
              ))}
            </div>

            {selectedDays.length > 0 && (
              <div className="p-3 bg-brand-surface rounded-xl">
                <p className="text-sm text-gray-700 text-[16px]">
                  📆 {selectedDays.length === daysOfWeek.length 
                    ? (language === 'ko' ? '매일 복용' : 'Every day')
                    : `${language === 'ko' ? '주' : ''} ${selectedDays.length}${language === 'ko' ? '일: ' : ' days: '}${selectedDays.join(', ')}`}
                </p>
              </div>
            )}
          </div>

          {/* Dose Times */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 text-[16px]">
                {language === 'ko' ? '복용 시간' : 'Dose Times'}
              </Label>
              {!asNeeded && (
                <Button
                  type="button"
                  onClick={() => setDoseTimes([...doseTimes, '12:00'])}
                  className="h-8 px-3 bg-brand-accent hover:bg-brand-accent/80 text-white rounded-xl text-[14px]"
                >
                  <Plus size={16} className="mr-1" />
                  {language === 'ko' ? '시간 추가' : 'Add time'}
                </Button>
              )}
            </div>
            
            {/* As Needed Checkbox */}
            <div className="flex items-center space-x-3 p-3 bg-brand-surface rounded-xl border border-brand-primary">
              <Checkbox 
                id="as-needed"
                checked={asNeeded}
                onCheckedChange={(checked) => setAsNeeded(checked as boolean)}
                className="border-brand-primary data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
              />
              <div className="flex-1">
                <Label htmlFor="as-needed" className="text-gray-800 font-medium cursor-pointer  text-[16px]">
                  {language === 'ko' ? '필요시 복용 (PRN)' : 'Take as needed (PRN)'}
                </Label>
                <p className="text-xs text-gray-600 mt-0.5 text-[14px]">
                  {language === 'ko' 
                    ? '정기 일정이 아닌, 필요할 때만 복용'
                    : 'Only when needed, not on a regular schedule'}
                </p>
              </div>
            </div>
            
            {!asNeeded ? (
              <>
                <div className="space-y-2">
                  {doseTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <TimePicker
                          value={time}
                          onChange={(newTime) => {
                            const newTimes = [...doseTimes];
                            newTimes[index] = newTime;
                            setDoseTimes(newTimes);
                          }}
                        />
                      </div>
                      {doseTimes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setDoseTimes(doseTimes.filter((_, i) => i !== index))}
                          className="h-12 w-12 border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                {doseTimes.length > 0 && (
                  <div className="p-3 bg-brand-surface rounded-xl">
                    <p className="text-sm text-gray-700 text-[16px]">
                      🔔 {language === 'ko' ? '하루 ' : ''}
                      {doseTimes.length}
                      {language === 'ko' ? '회 복용' : 'x per day'}
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </Card>

        {/* Reminders */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center space-x-2 text-gray-800">
              <Clock className="text-brand-accent" size={20} />
              <span className="text-[20px] font-bold">
                {language === 'ko' ? '알림' : 'Reminders'}
              </span>
            </h3>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>

          <div className={`p-4 rounded-2xl transition-all ${reminderEnabled ? 'bg-brand-surface' : 'bg-gray-50'}`}>
            {reminderEnabled ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium text-[16px]">
                  🔔 {language === 'ko' ? '알림 활성화' : 'Reminders enabled'}
                </p>
                <p className="text-xs text-gray-600 text-[16px]">
                  {language === 'ko'
                    ? '예약된 각 복용 시간에 알림을 받습니다'
                    : 'You will receive notifications at each scheduled dose time'}
                </p>
                {doseTimes.length > 0 && !asNeeded && (
                  <div className="mt-3 pt-3 border-t border-brand-primary">
                    <p className="text-xs text-gray-500 mb-2 text-[16px]">
                      {language === 'ko' ? '알림 시간:' : 'Reminder times:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {doseTimes.map((time, index) => (
                        <div key={index} className="px-3 py-1 bg-white rounded-lg text-xs text-gray-700 border border-brand-primary text-[16px]">
                          ⏰ {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  📵 {language === 'ko' ? '알림이 꺼져 있습니다' : 'Reminders are off'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'ko'
                    ? '복용 시간에 알림을 받으려면 활성화하세요'
                    : 'Enable to receive notifications at dose times'}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Additional Notes */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Sparkles className="text-brand-accent" size={20} />
            <span className="text-[20px] font-bold">
              {language === 'ko' ? '추가 메모' : 'Additional Notes'}
            </span>
          </h3>
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-gray-700 text-[16px]">
              {language === 'ko' ? '메모 (선택사항)' : 'Notes (Optional)'}
            </Label>
            <Textarea
              id="notes"
              placeholder={language === 'ko' 
                ? '특별 지시사항, 주의할 부작용 또는 알림 사항...'
                : 'Special instructions, side effects to watch for, or reminders...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 bg-white resize-none"
            />
          </div>
        </Card>

        {/* Instructions */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Clock className="text-brand-accent" size={20} />
            <span className="text-[20px] font-bold">
              {language === 'ko' ? '복용 방법' : 'How to Take'}
            </span>
          </h3>
          <div className="space-y-3">
            <Label htmlFor="taking-time" className="text-gray-700 text-[16px]">
              {language === 'ko' ? '복용 시기' : 'When to take'}
            </Label>
            <Select value={takingTime} onValueChange={setTakingTime}>
              <SelectTrigger className="border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 bg-white">
                <SelectValue placeholder={language === 'ko' ? '복용 시기 선택' : 'Select when to take'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before-meals">
                  🍽️ {language === 'ko' ? '식전' : 'Before meals'}
                </SelectItem>
                <SelectItem value="after-meals">
                  🍽️ {language === 'ko' ? '식후' : 'After meals'}
                </SelectItem>
                <SelectItem value="with-meals">
                  🍽️ {language === 'ko' ? '식사와 함께' : 'With meals'}
                </SelectItem>
                <SelectItem value="empty-stomach">
                  ⭕ {language === 'ko' ? '공복' : 'Empty stomach'}
                </SelectItem>
                <SelectItem value="bedtime">
                  🛏️ {language === 'ko' ? '취침 시' : 'Bedtime'}
                </SelectItem>
                <SelectItem value="anytime">
                  ⏰ {language === 'ko' ? '언제든지' : 'Anytime'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Medical Information */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <FileText className="text-brand-accent" size={20} />
            <span className="text-[20px] font-bold">
              {language === 'ko' ? '의료 정보' : 'Medical Information'}
            </span>
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prescribed-by" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '처방의' : 'Prescribed by'}
              </Label>
              <Input
                id="prescribed-by"
                placeholder={language === 'ko' ? '예: 김의사' : 'e.g., Dr. Smith'}
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pharmacy" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '약국' : 'Pharmacy'}
              </Label>
              <Input
                id="pharmacy"
                placeholder={language === 'ko' ? '예: 서울약국' : 'e.g., ABC Pharmacy'}
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '복용 지시' : 'Instructions'}
              </Label>
              <Textarea
                id="instructions"
                placeholder={language === 'ko' 
                  ? '음식과 함께 복용. 알코올 피하기.'
                  : 'Take with food. Avoid alcohol.'}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="side-effects" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '부작용' : 'Side Effects'}
              </Label>
              <Textarea
                id="side-effects"
                placeholder={language === 'ko' 
                  ? '현기증, 마른 기침 유발 가능'
                  : 'May cause dizziness, dry cough'}
                value={sideEffects}
                onChange={(e) => setSideEffects(e.target.value)}
                rows={2}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-notes" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '메모' : 'Notes'}
              </Label>
              <Textarea
                id="medical-notes"
                placeholder={language === 'ko' 
                  ? '주간 혈압 모니터링'
                  : 'Monitor blood pressure weekly'}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                rows={2}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="pb-6">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full h-12 bg-brand-accent hover:bg-brand-accent/80 text-white font-medium text-lg flex items-center justify-center gap-2 text-[18px] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-solid border-white border-r-transparent"></div>
                {language === 'ko' ? '저장 중...' : 'Saving...'}
              </>
            ) : (
              <>
                <Plus size={20} />
                {language === 'ko' ? '약 저장' : 'Save Medicine'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
