import React, { useState } from 'react';
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

interface AddMedicinePageProps {
  onBack: () => void;
  onAddMedicine?: (medicine: NewMedicine) => void;
}

export function AddMedicinePage({ onBack, onAddMedicine }: AddMedicinePageProps) {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTimes, setReminderTimes] = useState(['08:00']);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(),
    to: undefined,
  });
  const [doseTimes, setDoseTimes] = useState<string[]>(['09:00', '21:00']);
  const [asNeeded, setAsNeeded] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['myself']);
  const [selectedDays, setSelectedDays] = useState<string[]>(['일', '월', '화', '수', '목', '금', '토']);
  
  // Medical Information states
  const [prescribedBy, setPrescribedBy] = useState('');
  const [pharmacy, setPharmacy] = useState('');
  const [instructions, setInstructions] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  
  const daysOfWeek = [
    { id: '일', label: '일', fullLabel: '일요일' },
    { id: '월', label: '월', fullLabel: '월요일' },
    { id: '화', label: '화', fullLabel: '화요일' },
    { id: '수', label: '수', fullLabel: '수요일' },
    { id: '목', label: '목', fullLabel: '목요일' },
    { id: '금', label: '금', fullLabel: '금요일' },
    { id: '토', label: '토', fullLabel: '토요일' }
  ];

  // Mock data for care recipients
  const careRecipients = [
    {
      id: 'person1',
      name: 'Mom (Linda)',
      initials: 'LM',
      color: 'bg-orange-300',
      relation: '어머니'
    },
    {
      id: 'person2',
      name: 'Dad (Robert)',
      initials: 'RM',
      color: 'bg-amber-400',
      relation: '아버지'
    }
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

  const medicineTypes = [
    { value: 'tablet', label: '정제', icon: Pill, color: 'from-amber-400 to-orange-600', bgColor: 'bg-amber-50' },
    { value: 'capsule', label: '캡슐', icon: Pill, color: 'from-orange-400 to-amber-600', bgColor: 'bg-orange-50' },
    { value: 'liquid', label: '액상', icon: Droplets, color: 'from-amber-300 to-orange-500', bgColor: 'bg-amber-50' },
    { value: 'injection', label: '주사', icon: Syringe, color: 'from-orange-400 to-red-600', bgColor: 'bg-orange-50' },
    { value: 'drops', label: '점안액', icon: Droplets, color: 'from-stone-400 to-amber-600', bgColor: 'bg-stone-50' },
    { value: 'inhaler', label: '흡입기', icon: Pill, color: 'from-orange-400 to-orange-600', bgColor: 'bg-orange-50' },
    { value: 'cream', label: '크림', icon: Sparkles, color: 'from-orange-300 to-amber-500', bgColor: 'bg-orange-50' }
  ];

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, '12:00']);
  };

  const removeReminderTime = (index: number) => {
    const newTimes = reminderTimes.filter((_, i) => i !== index);
    setReminderTimes(newTimes);
  };

  const updateReminderTime = (index: number, time: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = time;
    setReminderTimes(newTimes);
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

  const handleSave = () => {
    // Validation
    if (!medicineName.trim()) {
      toast.error('약 이름을 입력해주세요');
      return;
    }
    if (!dosage.trim()) {
      toast.error('용량을 입력해주세요');
      return;
    }

    // Show success message
    const names: string[] = [];
    if (selectedUsers.includes('myself')) {
      names.push('나');
    }
    careRecipients.forEach((person) => {
      if (selectedUsers.includes(person.id)) {
        names.push(person.name.split(' ')[0]);
      }
    });

    if (selectedUsers.length === 1) {
      toast.success(`${medicineName} 약이 저장되었습니다! 💊`);
    } else {
      toast.success(`${medicineName} 약이 ${names.join(', ')}에게 저장되었습니다! 💊`);
    }

    // Get medicine type color
    const selectedType = medicineTypes.find(t => t.value === medicineType);
    const color = selectedType?.color || 'from-amber-200 to-orange-300';
    const bgColor = selectedType?.bgColor || 'bg-amber-50';

    // Determine time display
    let timeDisplay = '필요시';
    if (!asNeeded && doseTimes.length > 0) {
      const firstTime = doseTimes[0];
      const [hours, minutes] = firstTime.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      timeDisplay = `${displayHour.toString().padStart(2, '0')}:${minutes} ${period}`;
    }

    // Create new medicine object
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

    // Pass the new medicine to parent component
    if (onAddMedicine) {
      onAddMedicine(newMedicine);
    } else {
      // Fallback if onAddMedicine is not provided
      setTimeout(() => {
        onBack();
      }, 1500);
    }
  };

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
            <h1 className="ml-2 text-xl font-bold text-[18px]">새 약 추가 💊</h1>
          </div>
          <Button onClick={handleSave} className="bg-white/20 hover:bg-white/30 text-white border-0 text-[16px]">
            {selectedUsers.length > 1 ? `${selectedUsers.length}명 저장` : '저장'}
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* User Selection */}
        <Card className="medicine-card p-4 border-0">
          <div className="mb-4">
            <h3 className="flex items-center space-x-2 text-gray-800 mb-2 text-[16px] font-bold">
              <Users className="text-amber-600" size={20} />
              <span className="text-[20px]">복용 대상</span>
            </h3>
            <p className="text-sm text-gray-600 text-[18px]">이 약을 복용할 사람을 선택하세요</p>
          </div>

          <div className="space-y-3">
            {/* Myself Option */}
            <div
              onClick={() => toggleUserSelection('myself')}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedUsers.includes('myself')
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-gray-200 bg-white hover:border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                      나
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800 text-[16px]">나</p>
                    <p className="text-sm text-gray-600 text-[14px]">내 약에 추가</p>
                  </div>
                </div>
                {selectedUsers.includes('myself') && (
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={18} />
                  </div>
                )}
              </div>
            </div>

            {/* Care Recipients */}
            {careRecipients.map((person) => (
              <div
                key={person.id}
                onClick={() => toggleUserSelection(person.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedUsers.includes(person.id)
                    ? 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`${person.color} text-white`}>
                        {person.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800 text-[16px]">{person.name}</p>
                      <p className="text-sm text-gray-600 text-[14px]">{person.relation}</p>
                    </div>
                  </div>
                  {selectedUsers.includes(person.id) && (
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
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
                  <span className="font-semibold">{selectedUsers.length}명</span>에게 추가
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.includes('myself') && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[16px]">
                      나
                    </Badge>
                  )}
                  {careRecipients.map((person) => 
                    selectedUsers.includes(person.id) && (
                      <Badge key={person.id} className="bg-amber-100 text-amber-700 border-amber-200 text-[16px]">
                        {person.name.split(' ')[0]}
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
          <Card className="p-3 bg-amber-50 border-amber-200 border-2">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="text-amber-700" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-1 text-[16px]">여러 사람에게 추가</h4>
                <p className="text-sm text-amber-800 text-[14px]">
                  동일한 약 세부정보, 일정 및 알림이 선택된 모든 {selectedUsers.length}명에게 생성됩니다. 
                  각 사람의 개별 프로필에서 나중에 일정을 맞춤 설정할 수 있습니다.
                </p>
              </div>
            </div>
          </Card>
        )}

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
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white text-[16px]"
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
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white text-[16px]"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="medicine-type" className="text-gray-700 text-[16px]">유형</Label>
              <Select value={medicineType} onValueChange={setMedicineType}>
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
                <Label htmlFor="as-needed" className="text-gray-800 font-medium cursor-pointer  text-[16px]">
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

        {/* Reminders */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center space-x-2 text-gray-800">
              <Clock className="text-amber-600" size={20} />
              <span className="text-[20px] font-bold">알림</span>
            </h3>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>

          <div className={`p-4 rounded-2xl transition-all ${reminderEnabled ? 'bg-gradient-to-r from-orange-50 to-yellow-50' : 'bg-gray-50'}`}>
            {reminderEnabled ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium text-[16px]">🔔 알림 활성화</p>
                <p className="text-xs text-gray-600 text-[16px]">예약된 각 복용 시간에 알림을 받습니다</p>
                {doseTimes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <p className="text-xs text-gray-500 mb-2 text-[16px]">알림 시간:</p>
                    <div className="flex flex-wrap gap-2">
                      {doseTimes.map((time, index) => (
                        <div key={index} className="px-3 py-1 bg-white rounded-lg text-xs text-gray-700 border border-orange-200 text-[16px]">
                          ⏰ {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">📵 알림이 꺼져 있습니다</p>
                <p className="text-xs text-gray-500 mt-1">복용 시간에 알림을 받으려면 활성화하세요</p>
              </div>
            )}
          </div>
        </Card>

        {/* Additional Notes */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Sparkles className="text-amber-600" size={20} />
            <span className="text-[20px] font-bold">추가 메모</span>
          </h3>
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-gray-700 text-[16px]">메모 (선택사항)</Label>
            <Textarea
              id="notes"
              placeholder="특별 지시사항, 주의할 부작용 또는 알림 사항..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white resize-none"
            />
          </div>
        </Card>

        {/* Instructions */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Clock className="text-amber-600" size={20} />
            <span className="text-[20px] font-bold">복용 방법</span>
          </h3>
          <div className="space-y-3">
            <Label htmlFor="instructions" className="text-gray-700 text-[16px]">복용 시기</Label>
            <Select>
              <SelectTrigger className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white">
                <SelectValue placeholder="복용 시기 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before-meals">🍽️ 식전</SelectItem>
                <SelectItem value="after-meals">🍽️ 식후</SelectItem>
                <SelectItem value="with-meals">🍽️ 식사와 함께</SelectItem>
                <SelectItem value="empty-stomach">⭕ 공복</SelectItem>
                <SelectItem value="bedtime">🛏️ 취침 시</SelectItem>
                <SelectItem value="anytime">⏰ 언제든지</SelectItem>
              </SelectContent>
            </Select>
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

        {/* Save Button */}
        <div className="pb-6">
          <Button onClick={handleSave} className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-medium text-lg flex items-center justify-center gap-2 text-[18px]">
            <Plus size={20} />
            약 저장
          </Button>
        </div>
      </div>
    </div>
  );
}
