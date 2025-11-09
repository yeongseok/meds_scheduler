import React, { useState } from 'react';
import { ArrowLeft, Camera, Clock, Plus, Trash2, Pill, Droplets, Syringe, Sparkles, Calendar as CalendarIcon, AlertCircle, Check, FileText, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { TimePicker } from './TimePicker';
import { useLanguage } from './LanguageContext';

interface EditMedicinePageProps {
  medicineId?: string;
  medicineName?: string;
  onBack: () => void;
  onSave?: (data: any) => void;
}

export function EditMedicinePage({ 
  medicineId = '1',
  medicineName = 'Vitamin D',
  onBack,
  onSave 
}: EditMedicinePageProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: medicineName,
    dosage: '1000 IU',
    type: 'tablet',
    timing: 'with-meals'
  });
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(2025, 9, 1), // Oct 1, 2025
    to: undefined,
  });
  const [doseTimes, setDoseTimes] = useState<string[]>(['08:00']);
  const [asNeeded, setAsNeeded] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    language === 'ko' 
      ? ['일', '월', '화', '수', '목', '금', '토']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  
  // Medical Information states
  const [prescribedBy, setPrescribedBy] = useState('Dr. Sarah Johnson');
  const [pharmacy, setPharmacy] = useState('MediCare Pharmacy');
  const [instructions, setInstructions] = useState('Take with food. Avoid alcohol.');
  const [sideEffects, setSideEffects] = useState('May cause dizziness, dry cough');
  const [medicalNotes, setMedicalNotes] = useState('Monitor blood pressure weekly');

  const daysOfWeek = language === 'ko' ? [
    { id: '일', label: '일', fullLabel: '일요일' },
    { id: '월', label: '월', fullLabel: '월요일' },
    { id: '화', label: '화', fullLabel: '화요일' },
    { id: '수', label: '수', fullLabel: '수요일' },
    { id: '목', label: '목', fullLabel: '목요일' },
    { id: '금', label: '금', fullLabel: '금요일' },
    { id: '토', label: '토', fullLabel: '토요일' }
  ] : [
    { id: 'Sun', label: 'Sun', fullLabel: 'Sunday' },
    { id: 'Mon', label: 'Mon', fullLabel: 'Monday' },
    { id: 'Tue', label: 'Tue', fullLabel: 'Tuesday' },
    { id: 'Wed', label: 'Wed', fullLabel: 'Wednesday' },
    { id: 'Thu', label: 'Thu', fullLabel: 'Thursday' },
    { id: 'Fri', label: 'Fri', fullLabel: 'Friday' },
    { id: 'Sat', label: 'Sat', fullLabel: 'Saturday' }
  ];

  const medicineTypes = [
    { value: 'tablet', label: language === 'ko' ? '정제' : 'Tablet', icon: Pill, color: 'bg-brand-primary', bgColor: 'bg-brand-surface' },
    { value: 'capsule', label: language === 'ko' ? '캡슐' : 'Capsule', icon: Pill, color: 'bg-brand-secondary', bgColor: 'bg-brand-surface' },
    { value: 'liquid', label: language === 'ko' ? '액상' : 'Liquid', icon: Droplets, color: 'bg-brand-accent', bgColor: 'bg-brand-surface' },
    { value: 'injection', label: language === 'ko' ? '주사' : 'Injection', icon: Syringe, color: 'bg-brand-primary', bgColor: 'bg-brand-light' },
    { value: 'drops', label: language === 'ko' ? '점안액' : 'Drops', icon: Droplets, color: 'bg-brand-secondary', bgColor: 'bg-brand-light' },
    { value: 'inhaler', label: language === 'ko' ? '흡입기' : 'Inhaler', icon: Pill, color: 'bg-brand-accent', bgColor: 'bg-brand-surface' },
    { value: 'cream', label: language === 'ko' ? '크림' : 'Cream', icon: Sparkles, color: 'bg-brand-primary', bgColor: 'bg-brand-surface' }
  ];

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error(language === 'ko' ? '약 이름을 입력해주세요' : 'Please enter medicine name');
      return;
    }
    if (!formData.dosage.trim()) {
      toast.error(language === 'ko' ? '용량을 입력해주세요' : 'Please enter dosage');
      return;
    }

    // Show success message
    toast.success(language === 'ko' 
      ? `${formData.name} 약이 업데이트되었습니다! 💊`
      : `${formData.name} has been updated! 💊`);

    if (onSave) {
      onSave({
        ...formData,
        reminderEnabled,
        dateRange,
        doseTimes
      });
    }
    
    // Go back after a short delay
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Delete medicine:', medicineId);
    onBack();
  };

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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-brand-primary p-4 text-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/30 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-800 hover:bg-brand-secondary/20">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="ml-2 text-xl font-bold text-[18px] text-[rgb(255,255,255)]">
              {language === 'ko' ? '약 편집 💊' : 'Edit Medicine 💊'}
            </h1>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-brand-accent hover:bg-brand-accent/80 text-white border-0 text-[16px]"
          >
            {language === 'ko' ? '저장' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
              {language === 'ko' ? '약을 쉽게 식별할 수 있습니다' : 'Helps identify your medicine easily'}
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white text-[16px]"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="medicine-type" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '유형' : 'Type'}
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white">
                  <SelectValue placeholder={language === 'ko' ? '유형 선택' : 'Select type'} />
                </SelectTrigger>
                <SelectContent>
                  {medicineTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center`}>
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

          <div className="space-y-3">
            <Label htmlFor="taking-time" className="text-gray-700 text-[16px]">
              {language === 'ko' ? '복용 시기' : 'Taking Time'}
            </Label>
            <Select value={formData.timing} onValueChange={(value) => setFormData({ ...formData, timing: value })}>
              <SelectTrigger className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white">
                <SelectValue placeholder={language === 'ko' ? '복용 시기 선택' : 'Select timing'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before-meals">
                  <span className="text-[16px]">{language === 'ko' ? '🍽️ 식전' : '🍽️ Before meals'}</span>
                </SelectItem>
                <SelectItem value="after-meals">
                  <span className="text-[16px]">{language === 'ko' ? '🍽️ 식후' : '🍽️ After meals'}</span>
                </SelectItem>
                <SelectItem value="with-meals">
                  <span className="text-[16px]">{language === 'ko' ? '🍽️ 식사와 함께' : '🍽️ With meals'}</span>
                </SelectItem>
                <SelectItem value="empty-stomach">
                  <span className="text-[16px]">{language === 'ko' ? '⭕ 공복' : '⭕ Empty stomach'}</span>
                </SelectItem>
                <SelectItem value="bedtime">
                  <span className="text-[16px]">{language === 'ko' ? '🛏️ 취침 시' : '🛏️ Bedtime'}</span>
                </SelectItem>
                <SelectItem value="anytime">
                  <span className="text-[16px]">{language === 'ko' ? '⏰ 언제든지' : '⏰ Anytime'}</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Schedule */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Clock className="text-amber-600" size={20} />
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
                  className="w-full justify-start text-left h-12 border-gray-200 hover:border-amber-400 bg-white rounded-xl text-[16px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-amber-500" />
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
              <div className="p-3 bg-brand-light rounded-xl">
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
            <div className="flex items-center space-x-3 p-3 bg-brand-light rounded-xl border border-brand-primary/30">
              <Checkbox 
                id="select-all-days"
                checked={allDaysSelected}
                onCheckedChange={toggleAllDays}
                className="border-brand-accent data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
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
              <div className="p-3 bg-brand-light rounded-xl">
                <p className="text-sm text-gray-700 text-[16px]">
                  📆 {selectedDays.length === daysOfWeek.length 
                    ? (language === 'ko' ? '매일 복용' : 'Every day')
                    : (language === 'ko' 
                        ? `주 ${selectedDays.length}일: ${selectedDays.join(', ')}`
                        : `${selectedDays.length} days/week: ${selectedDays.join(', ')}`)}
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
                  className="h-8 px-3 bg-brand-accent hover:bg-brand-primary text-white rounded-xl text-[14px]"
                >
                  <Plus size={16} className="mr-1" />
                  {language === 'ko' ? '시간 추가' : 'Add time'}
                </Button>
              )}
            </div>
            
            {/* As Needed Checkbox */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <Checkbox 
                id="as-needed"
                checked={asNeeded}
                onCheckedChange={(checked) => setAsNeeded(checked as boolean)}
                className="border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <div className="flex-1">
                <Label htmlFor="as-needed" className="text-gray-800 font-medium cursor-pointer text-[16px]">
                  {language === 'ko' ? '필요시 복용 (PRN)' : 'As needed (PRN)'}
                </Label>
                <p className="text-xs text-gray-600 mt-0.5 text-[14px]">
                  {language === 'ko' 
                    ? '정기 일정이 아닌, 필요할 때만 복용'
                    : 'Take only when needed, not on a schedule'}
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
              </>
            ) : null}
          </div>
        </Card>

        {/* Medical Information */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <FileText className="text-amber-600" size={20} />
            <span className="text-[20px] font-bold">
              {language === 'ko' ? '의료 정보' : 'Medical Information'}
            </span>
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prescribed-by" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '처방의' : 'Prescribed By'}
              </Label>
              <Input
                id="prescribed-by"
                placeholder="Dr. Sarah Johnson"
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
                placeholder="MediCare Pharmacy"
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
                placeholder={language === 'ko' ? '음식과 함께 복용. 알코올 피하기.' : 'Take with food. Avoid alcohol.'}
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
                placeholder={language === 'ko' ? '현기증, 마른 기침 유발 가능' : 'May cause dizziness, dry cough'}
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
                placeholder={language === 'ko' ? '주간 혈압 모니터링' : 'Monitor blood pressure weekly'}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                rows={2}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Pause and Delete Medicine Section */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="medicine-card p-4 border-0 border-amber-200 bg-amber-50">
            <Button
              variant="ghost"
              onClick={() => setShowPauseConfirm(true)}
              className="w-full h-12 text-amber-700 hover:text-amber-800 hover:bg-amber-100 font-medium flex items-center justify-center gap-2 text-[18px]"
            >
              <Pause size={18} />
              {language === 'ko' ? '일시중지' : 'Pause'}
            </Button>
          </Card>
          
          <Card className="medicine-card p-4 border-0 border-red-200 bg-red-50">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-100 font-medium flex items-center justify-center gap-2 text-[18px]"
            >
              <Trash2 size={18} />
              {language === 'ko' ? '삭제' : 'Delete'}
            </Button>
          </Card>
        </div>

        {/* Spacing for bottom padding */}
        <div className="pb-6"></div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 bg-white">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-center mb-2 text-[18px]">
                {language === 'ko' ? '약을 삭제하시겠습니까?' : 'Delete Medicine?'}
              </h3>
              <p className="text-sm text-gray-600 text-center text-[16px]">
                {language === 'ko' 
                  ? `"${formData.name}"을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없으며 관련된 모든 알림이 제거됩니다.`
                  : `Are you sure you want to delete "${formData.name}"? This action cannot be undone and all associated reminders will be removed.`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 border-gray-300 text-[16px]"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white text-[16px]"
              >
                {language === 'ko' ? '삭제' : 'Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Pause Confirmation Dialog */}
      {showPauseConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 bg-white">
            <div className="mb-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pause className="text-amber-600" size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-center mb-2 text-[18px]">
                {language === 'ko' ? '약을 일시중지하시겠습니까?' : 'Pause Medicine?'}
              </h3>
              <p className="text-sm text-gray-600 text-center text-[16px]">
                {language === 'ko' 
                  ? `"${formData.name}"을(를) 일시중지하면 모든 알림이 일시적으로 중단됩니다. 약 목록에서 언제든지 다시 시작할 수 있습니다.`
                  : `Pausing "${formData.name}" will temporarily stop all reminders. You can resume it anytime from your medicine list.`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPauseConfirm(false)}
                className="flex-1 h-11 border-gray-300 text-[16px]"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button
                onClick={() => {
                  console.log('Pausing medication:', formData.name);
                  // Handle pause logic here
                  setShowPauseConfirm(false);
                  onBack();
                }}
                className="flex-1 h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[16px]"
              >
                {language === 'ko' ? '일시중지' : 'Pause'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
