import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Clock, Plus, Trash2, Pill, Droplets, Syringe, Sparkles, Calendar as CalendarIcon, Users, Check, FileText, X } from 'lucide-react';
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
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { TimePicker } from './TimePicker';

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

interface AddMedicineWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine?: (medicine: NewMedicine) => void;
}

const STEPS = [
  { id: 1, title: '복용대상', icon: Users },
  { id: 2, title: '약 사진', icon: Camera },
  { id: 3, title: '기본 정보', icon: Pill },
  { id: 4, title: '일정', icon: CalendarIcon },
  { id: 5, title: '의료 정보', icon: FileText },
];

export function AddMedicineWizard({ isOpen, onClose, onAddMedicine }: AddMedicineWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form states
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['myself']);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: new Date(), to: undefined });
  const [selectedDays, setSelectedDays] = useState<string[]>(['일', '월', '화', '수', '목', '금', '토']);
  const [doseTimes, setDoseTimes] = useState<string[]>(['09:00', '21:00']);
  const [asNeeded, setAsNeeded] = useState(false);
  const [takingTime, setTakingTime] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [pharmacy, setPharmacy] = useState('');
  const [instructions, setInstructions] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  const daysOfWeek = [
    { id: '일', label: '일' },
    { id: '월', label: '월' },
    { id: '화', label: '화' },
    { id: '수', label: '수' },
    { id: '목', label: '목' },
    { id: '금', label: '금' },
    { id: '토', label: '토' }
  ];

  const careRecipients = [
    { id: 'person1', name: 'Mom (Linda)', initials: 'LM', color: 'bg-orange-300', relation: '어머니' },
    { id: 'person2', name: 'Dad (Robert)', initials: 'RM', color: 'bg-amber-400', relation: '아버지' }
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

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      if (selectedUsers.length > 1) {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));
      }
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
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

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    if (!medicineName.trim()) {
      toast.error('약 이름을 입력해주세요');
      return;
    }
    if (!dosage.trim()) {
      toast.error('용량을 입력해주세요');
      return;
    }

    const selectedType = medicineTypes.find(t => t.value === medicineType);
    const color = selectedType?.color || 'from-amber-200 to-orange-300';
    const bgColor = selectedType?.bgColor || 'bg-amber-50';

    let timeDisplay = '필요시';
    if (!asNeeded && doseTimes.length > 0) {
      const firstTime = doseTimes[0];
      const [hours, minutes] = firstTime.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      timeDisplay = `${displayHour.toString().padStart(2, '0')}:${minutes} ${period}`;
    }

    const newMedicine: NewMedicine = {
      id: Date.now().toString(),
      name: medicineName,
      dosage: dosage,
      time: timeDisplay,
      status: 'upcoming',
      type: medicineType || 'tablet',
      color: color,
      bgColor: bgColor,
      asNeeded: asNeeded
    };

    toast.success(`${medicineName} 약이 저장되었습니다! 💊`);
    
    if (onAddMedicine) {
      onAddMedicine(newMedicine);
    }
    
    onClose();
    
    // Reset form
    setCurrentStep(1);
    setSelectedUsers(['myself']);
    setMedicineName('');
    setDosage('');
    setMedicineType('');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">복용 대상</h3>
              <p className="text-[18px] text-gray-600">이 약을 복용할 사람을 선택하세요</p>
            </div>

            <div className="space-y-3">
              {/* Myself Option */}
              <div
                onClick={() => toggleUserSelection('myself')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedUsers.includes('myself')
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[14px]">
                        나
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800 text-[16px]">나</p>
                      <p className="text-[14px] text-gray-600">내 약에 추가</p>
                    </div>
                  </div>
                  {selectedUsers.includes('myself') && (
                    <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check className="text-white" size={16} />
                    </div>
                  )}
                </div>
              </div>

              {/* Care Recipients */}
              {careRecipients.map((person) => (
                <div
                  key={person.id}
                  onClick={() => toggleUserSelection(person.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedUsers.includes(person.id)
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-200 bg-white hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`${person.color} text-white text-[14px]`}>
                          {person.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 text-[16px]">{person.name}</p>
                        <p className="text-[14px] text-gray-600">{person.relation}</p>
                      </div>
                    </div>
                    {selectedUsers.includes(person.id) && (
                      <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
                        <Check className="text-white" size={16} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">약 사진 (선택사항)</h3>
              <p className="text-[18px] text-gray-600">약을 쉽게 식별할 수 있도록 사진을 추가하세요</p>
            </div>

            <div className="border-2 border-dashed border-amber-200 rounded-2xl p-8 text-center bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Camera size={28} className="text-white" />
              </div>
              <p className="text-gray-600 font-medium text-[16px]">탭하여 사진 추가</p>
              <p className="text-[14px] text-gray-500 mt-1">약을 쉽게 식별할 수 있습니다</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">기본 정보</h3>
              <p className="text-[18px] text-gray-600">약의 기본 정보를 입력하세요</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="medicine-name" className="text-gray-700 text-[16px]">약 이름 *</Label>
              <Input
                id="medicine-name"
                placeholder="약 이름 입력"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white text-[16px] h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="dosage" className="text-gray-700 text-[16px]">용량 *</Label>
                <Input
                  id="dosage"
                  placeholder="예: 500mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white text-[16px] h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="medicine-type" className="text-gray-700 text-[16px]">유형</Label>
                <Select value={medicineType} onValueChange={setMedicineType}>
                  <SelectTrigger className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white h-12">
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
              <Select value={takingTime} onValueChange={setTakingTime}>
                <SelectTrigger className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white h-12">
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">일정</h3>
              <p className="text-[18px] text-gray-600">복용 일정을 설정하세요</p>
            </div>

            {/* Date Range */}
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Days of Week */}
            <div className="space-y-3">
              <Label className="text-gray-700 text-[16px]">복용 요일</Label>
              
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <Checkbox 
                  id="select-all-days"
                  checked={selectedDays.length === daysOfWeek.length}
                  onCheckedChange={toggleAllDays}
                  className="border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label htmlFor="select-all-days" className="text-gray-700 cursor-pointer flex-1 text-[16px]">
                  매일
                </Label>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all text-[14px] ${
                      selectedDays.includes(day.id)
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-amber-300'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
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
                    <Plus size={14} className="mr-1" />
                    시간 추가
                  </Button>
                )}
              </div>
              
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
                  <p className="text-[16px] text-gray-600 mt-0.5">
                    정기 일정이 아닌, 필요할 때만 복용
                  </p>
                </div>
              </div>
              
              {!asNeeded && (
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
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">의료 정보</h3>
              <p className="text-[18px] text-gray-600">처방 및 의료 정보를 입력하세요</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prescribed-by" className="text-gray-700 text-[16px]">처방의</Label>
                <Input
                  id="prescribed-by"
                  placeholder="Dr. Sarah Johnson"
                  value={prescribedBy}
                  onChange={(e) => setPrescribedBy(e.target.value)}
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white text-[16px] h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pharmacy" className="text-gray-700 text-[16px]">약국</Label>
                <Input
                  id="pharmacy"
                  placeholder="MediCare Pharmacy"
                  value={pharmacy}
                  onChange={(e) => setPharmacy(e.target.value)}
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white text-[16px] h-12"
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
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white resize-none text-[16px]"
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
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white resize-none text-[16px]"
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
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white resize-none text-[16px]"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[85vh] p-0 gap-0 flex flex-col [&>button]:hidden">
        <DialogTitle className="sr-only">새 약 추가</DialogTitle>
        <DialogDescription className="sr-only">
          {STEPS[currentStep - 1].title} - 단계 {currentStep} / {STEPS.length}
        </DialogDescription>
        
        {/* Header with Progress */}
        <div className="flex-shrink-0 bg-gradient-to-r from-amber-400 to-orange-500 p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold">새 약 추가</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2 bg-white/30" />
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[16px]">단계 {currentStep} / {STEPS.length}</span>
              <span className="text-[16px]">{STEPS[currentStep - 1].title}</span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {renderStepContent()}
        </div>

        {/* Footer Navigation - Fixed at bottom */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          {currentStep > 1 ? (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="flex-1 h-12 text-[16px] border-gray-300"
            >
              <ArrowLeft size={16} className="mr-2" />
              이전
            </Button>
          ) : (
            <div className="flex-1"></div>
          )}
          
          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-[16px]"
            >
              다음
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-[16px]"
            >
              <Check size={16} className="mr-2" />
              저장하기
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
