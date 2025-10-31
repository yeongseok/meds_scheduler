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
  const [selectedDays, setSelectedDays] = useState<string[]>(['일', '월', '화', '수', '목', '금', '토']);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  
  // Medical Information states
  const [prescribedBy, setPrescribedBy] = useState('Dr. Sarah Johnson');
  const [pharmacy, setPharmacy] = useState('MediCare Pharmacy');
  const [instructions, setInstructions] = useState('Take with food. Avoid alcohol.');
  const [sideEffects, setSideEffects] = useState('May cause dizziness, dry cough');
  const [medicalNotes, setMedicalNotes] = useState('Monitor blood pressure weekly');

  const daysOfWeek = [
    { id: '일', label: '일', fullLabel: '일요일' },
    { id: '월', label: '월', fullLabel: '월요일' },
    { id: '화', label: '화', fullLabel: '화요일' },
    { id: '수', label: '수', fullLabel: '수요일' },
    { id: '목', label: '목', fullLabel: '목요일' },
    { id: '금', label: '금', fullLabel: '금요일' },
    { id: '토', label: '토', fullLabel: '토요일' }
  ];

  const medicineTypes = [
    { value: 'tablet', label: '정제', icon: Pill, color: 'from-amber-400 to-orange-600', bgColor: 'bg-amber-50' },
    { value: 'capsule', label: '캡슐', icon: Pill, color: 'from-orange-400 to-amber-600', bgColor: 'bg-orange-50' },
    { value: 'liquid', label: '액상', icon: Droplets, color: 'from-amber-300 to-orange-500', bgColor: 'bg-amber-50' },
    { value: 'injection', label: '주사', icon: Syringe, color: 'from-orange-400 to-red-600', bgColor: 'bg-orange-50' },
    { value: 'drops', label: '점안액', icon: Droplets, color: 'from-stone-400 to-amber-600', bgColor: 'bg-stone-50' },
    { value: 'inhaler', label: '흡입기', icon: Pill, color: 'from-orange-400 to-orange-600', bgColor: 'bg-orange-50' },
    { value: 'cream', label: '크림', icon: Sparkles, color: 'from-orange-300 to-amber-500', bgColor: 'bg-orange-50' }
  ];

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('약 이름을 입력해주세요');
      return;
    }
    if (!formData.dosage.trim()) {
      toast.error('용량을 입력해주세요');
      return;
    }

    // Show success message
    toast.success(`${formData.name} 약이 업데이트되었습니다! 💊`);

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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="gradient-primary p-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="ml-2 text-xl font-bold text-[18px]">약 편집 💊</h1>
          </div>
          <Button 
            onClick={handleSave}
            className="bg-white/20 hover:bg-white/30 text-white border-0 text-[16px]"
          >
            저장
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Medicine Photo */}
        <Card className="medicine-card p-4 border-0">
          <Label className="block mb-3 flex items-center space-x-2">
            <Camera className="text-amber-600" size={18} />
            <span className="text-[20px] font-bold">약 사진 (선택사항)</span>
          </Label>
          <div className="border-2 border-dashed border-amber-200 rounded-2xl p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Camera size={24} className="text-white" />
            </div>
            <p className="text-gray-600 font-medium">탭하여 사진 추가</p>
            <p className="text-sm text-gray-500 mt-1">약을 쉽게 식별할 수 있습니다</p>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Pill className="text-amber-600" size={20} />
            <span className="text-[20px] font-bold">기본 정보</span>
          </h3>
          
          <div className="space-y-3">
            <Label htmlFor="medicine-name" className="text-gray-700 text-[16px]">약 이름 *</Label>
            <Input
              id="medicine-name"
              placeholder="약 이름 입력"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white text-[16px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="dosage" className="text-gray-700 text-[16px]">용량 *</Label>
              <Input
                id="dosage"
                placeholder="예: 500mg"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white text-[16px]"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="medicine-type" className="text-gray-700 text-[16px]">유형</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white">
                  <SelectValue placeholder="유형 선택" />
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
            <Label htmlFor="taking-time" className="text-gray-700 text-[16px]">복용 시기</Label>
            <Select value={formData.timing} onValueChange={(value) => setFormData({ ...formData, timing: value })}>
              <SelectTrigger className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white">
                <SelectValue placeholder="복용 시기 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before-meals"><span className="text-[16px]">🍽️ 식전</span></SelectItem>
                <SelectItem value="after-meals"><span className="text-[16px]">🍽️ 식후</span></SelectItem>
                <SelectItem value="with-meals"><span className="text-[16px]">🍽️ 식사와 함께</span></SelectItem>
                <SelectItem value="empty-stomach"><span className="text-[16px]">⭕ 공복</span></SelectItem>
                <SelectItem value="bedtime"><span className="text-[16px]">🛏️ 취침 시</span></SelectItem>
                <SelectItem value="anytime"><span className="text-[16px]">⏰ 언제든지</span></SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Schedule */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Clock className="text-amber-600" size={20} />
            <span className="text-[20px] font-bold">일정</span>
          </h3>
          
          {/* Date Range Selection */}
          <div className="space-y-3">
            <Label className="text-gray-700 text-[16px]">복용 기간</Label>
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
                    <span className="text-gray-400">시작 및 종료 날짜 선택</span>
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
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  📅 기간: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))}일
                </p>
              </div>
            )}
          </div>

          {/* Days of Dose */}
          <div className="space-y-3">
            <Label className="text-gray-700 text-[16px]">복용 요일</Label>
            
            {/* Select All Days */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <Checkbox 
                id="select-all-days"
                checked={allDaysSelected}
                onCheckedChange={toggleAllDays}
                className="border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label 
                htmlFor="select-all-days" 
                className="text-gray-700 cursor-pointer flex-1 text-[16px]"
              >
                매일
              </Label>
              {allDaysSelected && (
                <Check size={16} className="text-amber-600" />
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
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-amber-300'
                  }`}
                >
                  <span className={selectedDays.includes(day.id) ? '' : 'text-gray-700'}>
                    {day.label}
                  </span>
                </button>
              ))}
            </div>

            {selectedDays.length > 0 && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <p className="text-sm text-gray-700 text-[16px]">
                  📆 {selectedDays.length === daysOfWeek.length 
                    ? '매일 복용' 
                    : `주 ${selectedDays.length}일: ${selectedDays.join(', ')}`}
                </p>
              </div>
            )}
          </div>

          {/* Dose Times */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 text-[16px]">복용 시간</Label>
              {!asNeeded && (
                <Button
                  type="button"
                  onClick={() => setDoseTimes([...doseTimes, '12:00'])}
                  className="h-8 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl text-[14px]"
                >
                  <Plus size={16} className="mr-1" />
                  시간 추가
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
                  필요시 복용 (PRN)
                </Label>
                <p className="text-xs text-gray-600 mt-0.5 text-[14px]">
                  정기 일정이 아닌, 필요할 때만 복용
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
                  <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                    <p className="text-sm text-gray-700 text-[16px]">
                      🔔 하루 {doseTimes.length}회 복용
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </Card>

        {/* Medical Information */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <FileText className="text-amber-600" size={20} />
            <span className="text-[20px] font-bold">의료 정보</span>
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prescribed-by" className="text-gray-700 text-[16px]">처방의</Label>
              <Input
                id="prescribed-by"
                placeholder="Dr. Sarah Johnson"
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pharmacy" className="text-gray-700 text-[16px]">약국</Label>
              <Input
                id="pharmacy"
                placeholder="MediCare Pharmacy"
                value={pharmacy}
                onChange={(e) => setPharmacy(e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-gray-700 text-[16px]">복용 지시</Label>
              <Textarea
                id="instructions"
                placeholder="음식과 함께 복용. 알코올 피하기."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="side-effects" className="text-gray-700 text-[16px]">부작용</Label>
              <Textarea
                id="side-effects"
                placeholder="현기증, 마른 기침 유발 가능"
                value={sideEffects}
                onChange={(e) => setSideEffects(e.target.value)}
                rows={2}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medical-notes" className="text-gray-700 text-[16px]">메모</Label>
              <Textarea
                id="medical-notes"
                placeholder="주간 혈압 모니터링"
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
              일시중지
            </Button>
          </Card>
          
          <Card className="medicine-card p-4 border-0 border-red-200 bg-red-50">
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-100 font-medium flex items-center justify-center gap-2 text-[18px]"
            >
              <Trash2 size={18} />
              삭제
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
              <h3 className="font-bold text-gray-800 text-center mb-2 text-[18px]">약을 삭제하시겠습니까?</h3>
              <p className="text-sm text-gray-600 text-center text-[16px]">
                "{formData.name}"을(를) 삭제하시겠습니까? 이 작업은 취소할 수 없으며 관련된 모든 알림이 제거됩니다.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-11 border-gray-300 text-[16px]"
              >
                취소
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white text-[16px]"
              >
                삭제
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
              <h3 className="font-bold text-gray-800 text-center mb-2 text-[18px]">약을 일시중지하시겠습니까?</h3>
              <p className="text-sm text-gray-600 text-center text-[16px]">
                "{formData.name}"을(를) 일시중지하면 모든 알림이 일시적으로 중단됩니다. 약 목록에서 언제든지 다시 시작할 수 있습니다.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPauseConfirm(false)}
                className="flex-1 h-11 border-gray-300 text-[16px]"
              >
                취소
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
                일시중지
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
