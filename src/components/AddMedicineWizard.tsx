import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Camera, Clock, Plus, Trash2, Pill, Droplets, Syringe, Sparkles, Calendar as CalendarIcon, Users, Check, FileText, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
import { useLanguage } from './LanguageContext';
import { MedicinePhotoCropDialog } from './MedicinePhotoCropDialog';
import { PhotoUploadSheet } from './PhotoUploadSheet';
import { uploadMedicinePhoto } from '../lib/firebase/db';
import { useAuth } from '../lib/hooks/useAuth';
import { useCreateMedicinePermissionRequest } from '../lib/hooks';

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
  photoURL?: string;
}

interface AddMedicineWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedicine?: (medicine: NewMedicine) => void;
}

export function AddMedicineWizard({ isOpen, onClose, onAddMedicine }: AddMedicineWizardProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { createRequest, loading: creatingRequest } = useCreateMedicinePermissionRequest();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  const STEPS = [
    { id: 1, title: language === 'ko' ? '복용대상' : 'Recipients', icon: Users },
    { id: 2, title: language === 'ko' ? '약 사진' : 'Photo', icon: Camera },
    { id: 3, title: language === 'ko' ? '기본 정보' : 'Basic Info', icon: Pill },
    { id: 4, title: language === 'ko' ? '일정' : 'Schedule', icon: CalendarIcon },
    { id: 5, title: language === 'ko' ? '의료 정보' : 'Medical Info', icon: FileText },
  ];
  
  // Form states
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['myself']);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medicineType, setMedicineType] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: new Date(), to: undefined });
  const [selectedDays, setSelectedDays] = useState<string[]>(['일', '월', '화', '수', '목', '금', '토']);
  const [doseTimes, setDoseTimes] = useState<string[]>(['09:00']);
  const [asNeeded, setAsNeeded] = useState(false);
  const [takingTime, setTakingTime] = useState('');
  const [prescribedBy, setPrescribedBy] = useState('');
  const [pharmacy, setPharmacy] = useState('');
  const [instructions, setInstructions] = useState('');
  const [sideEffects, setSideEffects] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  
  // Photo upload states
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [tempPhotoSrc, setTempPhotoSrc] = useState<string>('');
  const [uploadedPhotoURL, setUploadedPhotoURL] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset wizard state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setDirection(1);
      setSelectedUsers(['myself']);
      setMedicineName('');
      setDosage('');
      setMedicineType('');
      setDateRange({ from: new Date(), to: undefined });
      setSelectedDays(['일', '월', '화', '수', '목', '금', '토']);
      setDoseTimes(['09:00']);
      setAsNeeded(false);
      setTakingTime('');
      setPrescribedBy('');
      setPharmacy('');
      setInstructions('');
      setSideEffects('');
      setMedicalNotes('');
      setSelectedPhoto(null);
      setPhotoPreview(null);
      setUploadedPhotoURL(null);
      setTempPhotoSrc('');
    }
  }, [isOpen]);

  const daysOfWeek = language === 'ko' ? [
    { id: '일', label: '일' },
    { id: '월', label: '월' },
    { id: '화', label: '화' },
    { id: '수', label: '수' },
    { id: '목', label: '목' },
    { id: '금', label: '금' },
    { id: '토', label: '토' }
  ] : [
    { id: 'Sun', label: 'Sun' },
    { id: 'Mon', label: 'Mon' },
    { id: 'Tue', label: 'Tue' },
    { id: 'Wed', label: 'Wed' },
    { id: 'Thu', label: 'Thu' },
    { id: 'Fri', label: 'Fri' },
    { id: 'Sat', label: 'Sat' }
  ];

  const careRecipients = [
    { id: 'person1', name: 'Mom (Linda)', initials: 'LM', color: 'bg-orange-300', relation: language === 'ko' ? '어머니' : 'Mother' },
    { id: 'person2', name: 'Dad (Robert)', initials: 'RM', color: 'bg-amber-400', relation: language === 'ko' ? '아버지' : 'Father' }
  ];

  const medicineTypes = [
    { value: 'tablet', label: language === 'ko' ? '정제' : 'Tablet', icon: Pill, color: 'from-amber-400 to-orange-600', bgColor: 'bg-amber-50' },
    { value: 'capsule', label: language === 'ko' ? '캡슐' : 'Capsule', icon: Pill, color: 'from-orange-400 to-amber-600', bgColor: 'bg-orange-50' },
    { value: 'liquid', label: language === 'ko' ? '액상' : 'Liquid', icon: Droplets, color: 'from-amber-300 to-orange-500', bgColor: 'bg-amber-50' },
    { value: 'injection', label: language === 'ko' ? '주사' : 'Injection', icon: Syringe, color: 'from-orange-400 to-red-600', bgColor: 'bg-orange-50' },
    { value: 'drops', label: language === 'ko' ? '점안액' : 'Drops', icon: Droplets, color: 'from-stone-400 to-amber-600', bgColor: 'bg-stone-50' },
    { value: 'inhaler', label: language === 'ko' ? '흡입기' : 'Inhaler', icon: Pill, color: 'from-orange-400 to-orange-600', bgColor: 'bg-orange-50' },
    { value: 'cream', label: language === 'ko' ? '크림' : 'Cream', icon: Sparkles, color: 'from-orange-300 to-amber-500', bgColor: 'bg-orange-50' }
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

  // Photo handling functions
  const handlePhotoClick = () => {
    setShowUploadSheet(true);
  };

  const handlePhotoSelected = (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(language === 'ko' ? '이미지 파일만 업로드할 수 있습니다' : 'Only image files can be uploaded');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(language === 'ko' ? '이미지 크기는 5MB 이하여야 합니다' : 'Image size must be less than 5MB');
      return;
    }

    // Create preview URL for cropping
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempPhotoSrc(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setIsUploadingPhoto(true);
      
      if (!user?.uid) {
        toast.error(language === 'ko' ? '로그인이 필요합니다' : 'Login required', {
          className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
        });
        return;
      }

      // Convert blob to file
      const croppedFile = new File([croppedBlob], 'medicine-photo.jpg', { type: 'image/jpeg' });
      
      // Upload to Firebase Storage
      const photoURL = await uploadMedicinePhoto(user.uid, croppedFile);
      
      setUploadedPhotoURL(photoURL);
      setPhotoPreview(URL.createObjectURL(croppedBlob));
      setSelectedPhoto(croppedFile);
      
      toast.success(language === 'ko' ? '약 사진이 업로드되었습니다' : 'Medicine photo uploaded successfully', {
        className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
      });
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast.error(error.message || (language === 'ko' ? '사진 업로드 실패' : 'Failed to upload photo'), {
        className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    setUploadedPhotoURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    if (!medicineName.trim()) {
      toast.error(language === 'ko' ? '약 이름을 입력해주세요' : 'Please enter medication name', {
        className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
      });
      return;
    }
    if (!dosage.trim()) {
      toast.error(language === 'ko' ? '용량을 입력해주세요' : 'Please enter dosage', {
        className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
      });
      return;
    }

    const selectedType = medicineTypes.find(t => t.value === medicineType);
    const color = selectedType?.color || 'from-amber-200 to-orange-300';
    const bgColor = selectedType?.bgColor || 'bg-amber-50';

    let timeDisplay = language === 'ko' ? '필요시' : 'As needed';
    if (!asNeeded && doseTimes.length > 0) {
      const firstTime = doseTimes[0];
      const [hours, minutes] = firstTime.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      timeDisplay = `${displayHour.toString().padStart(2, '0')}:${minutes} ${period}`;
    }

    // Check if adding for care recipient (not myself)
    const isForCareRecipient = !selectedUsers.includes('myself') && selectedUsers.length > 0;
    
    if (isForCareRecipient) {
      // Get the selected care recipient
      const selectedRecipient = careRecipients.find(r => selectedUsers.includes(r.id));
      
      if (!selectedRecipient || !user) {
        toast.error(language === 'ko' ? '오류가 발생했습니다' : 'An error occurred', {
          className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
        });
        return;
      }

      try {
        // Create permission request instead of adding medicine directly
        await createRequest({
          guardianId: user.uid,
          guardianName: user.displayName || user.email || 'Guardian',
          guardianEmail: user.email || '',
          guardianPhotoURL: user.photoURL || undefined,
          careRecipientId: selectedRecipient.id, // In real app, this would be the actual user ID
          careRecipientName: selectedRecipient.name,
          careRecipientEmail: 'recipient@example.com', // In real app, this would be the actual email
          medicineName: medicineName,
          dosage: dosage,
          medicineType: (medicineType || 'tablet') as 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'inhaler' | 'other',
          color: '#FF9248', // Extract from color gradient
          frequency: asNeeded ? (language === 'ko' ? '필요시' : 'As needed') : (language === 'ko' ? '매일' : 'Daily'),
          times: asNeeded ? [] : doseTimes,
          duration: dateRange.to && dateRange.from 
            ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
            : 30,
          startDate: dateRange.from?.toISOString() || new Date().toISOString(),
          instructions: instructions || undefined,
          notes: medicalNotes || undefined,
          photoURL: uploadedPhotoURL || undefined,
          prescribedBy: prescribedBy || undefined,
          pharmacy: pharmacy || undefined
        });

        toast.success(language === 'ko' 
          ? `${selectedRecipient.name}에게 승인 요청을 전송했습니다 🔔`
          : `Permission request sent to ${selectedRecipient.name} 🔔`, {
          className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
        });
        
        onClose();
        
        // Reset form
        setCurrentStep(1);
        setSelectedUsers(['myself']);
        setMedicineName('');
        setDosage('');
        setMedicineType('');
        return;
      } catch (error) {
        console.error('Error creating permission request:', error);
        toast.error(language === 'ko' 
          ? '승인 요청 전송에 실패했습니다'
          : 'Failed to send permission request', {
          className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
        });
        return;
      }
    }

    // If adding for myself, use the original flow
    const newMedicine: NewMedicine = {
      id: Date.now().toString(),
      name: medicineName,
      dosage: dosage,
      time: timeDisplay,
      status: 'upcoming',
      type: medicineType || 'tablet',
      color: color,
      bgColor: bgColor,
      asNeeded: asNeeded,
      photoURL: uploadedPhotoURL || undefined
    };

    toast.success(language === 'ko' 
      ? `${medicineName} 약이 저장되었습니다! 💊`
      : `${medicineName} has been saved! 💊`, {
      className: 'bg-[#E8F1FC] border-[#3674B5] text-gray-800'
    });
    
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
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                {language === 'ko' ? '복용 대상' : 'Who is taking this medication?'}
              </h3>
              <p className="text-[18px] text-gray-600">
                {language === 'ko' ? '이 약을 복용할 사람을 선택하세요' : 'Select who will take this medication'}
              </p>
            </div>

            <div className="space-y-3">
              {/* Myself Option */}
              <div
                onClick={() => toggleUserSelection('myself')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedUsers.includes('myself')
                    ? 'border-brand-primary bg-brand-surface'
                    : 'border-gray-200 bg-white hover:border-brand-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-brand-primary text-gray-800 text-[14px]">
                        {language === 'ko' ? '나' : 'Me'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800 text-[16px]">{language === 'ko' ? '나' : 'Myself'}</p>
                      <p className="text-[14px] text-gray-600">{language === 'ko' ? '내 약에 추가' : 'Add to my medications'}</p>
                    </div>
                  </div>
                  {selectedUsers.includes('myself') && (
                    <div className="w-7 h-7 bg-brand-accent rounded-full flex items-center justify-center">
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
                      ? 'border-brand-primary bg-brand-surface'
                      : 'border-gray-200 bg-white hover:border-brand-secondary'
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
                      <div className="w-7 h-7 bg-brand-accent rounded-full flex items-center justify-center">
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
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                {language === 'ko' ? '약 사진 (선택사항)' : 'Medication Photo (Optional)'}
              </h3>
              <p className="text-[18px] text-gray-600">
                {language === 'ko' ? '약을 쉽게 식별할 수 있도록 사진을 추가하세요' : 'Add a photo to easily identify your medication'}
              </p>
            </div>

            {photoPreview ? (
              <div className="relative border-2 border-brand-primary rounded-2xl p-4 bg-white">
                <img 
                  src={photoPreview} 
                  alt="Medicine preview" 
                  className="w-full h-64 object-cover rounded-xl"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRemovePhoto}
                  className="absolute top-6 right-6 bg-white hover:bg-red-50 border-red-300 text-red-600"
                >
                  <X size={18} />
                </Button>
                <p className="text-[14px] text-gray-600 text-center mt-3">
                  {language === 'ko' ? '사진이 추가되었습니다' : 'Photo added successfully'}
                </p>
              </div>
            ) : (
              <div 
                onClick={handlePhotoClick}
                className="border-2 border-dashed border-brand-primary rounded-2xl p-8 text-center bg-brand-surface hover:bg-brand-light transition-colors cursor-pointer"
              >
                {isUploadingPhoto ? (
                  <>
                    <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-700 border-r-transparent"></div>
                    </div>
                    <p className="text-gray-600 font-medium text-[16px]">
                      {language === 'ko' ? '업로드 중...' : 'Uploading...'}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Camera size={28} className="text-gray-700" />
                    </div>
                    <p className="text-gray-600 font-medium text-[16px]">
                      {language === 'ko' ? '탭하여 사진 추가' : 'Tap to add photo'}
                    </p>
                    <p className="text-[14px] text-gray-500 mt-1">
                      {language === 'ko' ? '약을 쉽게 식별할 수 있습니다' : 'Helps you identify your medication'}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                {language === 'ko' ? '기본 정보' : 'Basic Information'}
              </h3>
              <p className="text-[18px] text-gray-600">
                {language === 'ko' ? '약의 기본 정보를 입력하세요' : 'Enter basic medication information'}
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="medicine-name" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '약 이름 *' : 'Medication Name *'}
              </Label>
              <Input
                id="medicine-name"
                placeholder={language === 'ko' ? '약 이름 입력' : 'Enter medication name'}
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white text-[16px] h-12"
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
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white text-[16px] h-12"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="medicine-type" className="text-gray-700 text-[16px]">
                  {language === 'ko' ? '유형' : 'Type'}
                </Label>
                <Select value={medicineType} onValueChange={setMedicineType}>
                  <SelectTrigger className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white h-12">
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
                {language === 'ko' ? '복용 시기' : 'When to Take'}
              </Label>
              <Select value={takingTime} onValueChange={setTakingTime}>
                <SelectTrigger className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white h-12">
                  <SelectValue placeholder={language === 'ko' ? '복용 시기 선택' : 'Select timing'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before-meals">
                    <span className="text-[16px]">🍽️ {language === 'ko' ? '식전' : 'Before meals'}</span>
                  </SelectItem>
                  <SelectItem value="after-meals">
                    <span className="text-[16px]">🍽️ {language === 'ko' ? '식후' : 'After meals'}</span>
                  </SelectItem>
                  <SelectItem value="with-meals">
                    <span className="text-[16px]">🍽️ {language === 'ko' ? '식사와 함께' : 'With meals'}</span>
                  </SelectItem>
                  <SelectItem value="empty-stomach">
                    <span className="text-[16px]">⭕ {language === 'ko' ? '공복' : 'Empty stomach'}</span>
                  </SelectItem>
                  <SelectItem value="bedtime">
                    <span className="text-[16px]">🛏️ {language === 'ko' ? '취침 시' : 'At bedtime'}</span>
                  </SelectItem>
                  <SelectItem value="anytime">
                    <span className="text-[16px]">⏰ {language === 'ko' ? '언제든지' : 'Anytime'}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                {language === 'ko' ? '일정' : 'Schedule'}
              </h3>
              <p className="text-[18px] text-gray-600">
                {language === 'ko' ? '복용 일정을 설정하세요' : 'Set your medication schedule'}
              </p>
            </div>

            {/* Date Range */}
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Days of Week */}
            <div className="space-y-3">
              <Label className="text-gray-700 text-[16px]">
                {language === 'ko' ? '복용 요일' : 'Days of Week'}
              </Label>
              
              <div className="flex items-center space-x-3 p-3 bg-brand-surface rounded-xl border border-brand-primary">
                <Checkbox 
                  id="select-all-days"
                  checked={selectedDays.length === daysOfWeek.length}
                  onCheckedChange={toggleAllDays}
                  className="border-brand-primary data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
                />
                <Label htmlFor="select-all-days" className="text-gray-700 cursor-pointer flex-1 text-[16px]">
                  {language === 'ko' ? '매일' : 'Every day'}
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
                        ? 'bg-brand-accent text-white shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-brand-primary'
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
                <Label className="text-gray-700 text-[16px]">
                  {language === 'ko' ? '복용 시간' : 'Dose Times'}
                </Label>
                {!asNeeded && (
                  <Button
                    type="button"
                    onClick={() => setDoseTimes([...doseTimes, '12:00'])}
                    className="h-8 px-3 bg-brand-accent hover:bg-brand-accent/80 text-white rounded-xl text-[14px]"
                  >
                    <Plus size={14} className="mr-1" />
                    {language === 'ko' ? '시간 추가' : 'Add time'}
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-brand-surface rounded-xl border border-brand-primary">
                <Checkbox 
                  id="as-needed"
                  checked={asNeeded}
                  onCheckedChange={(checked) => setAsNeeded(checked as boolean)}
                  className="border-brand-primary data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent"
                />
                <div className="flex-1">
                  <Label htmlFor="as-needed" className="text-gray-800 font-medium cursor-pointer text-[16px]">
                    {language === 'ko' ? '필요시 복용 (PRN)' : 'As needed (PRN)'}
                  </Label>
                  <p className="text-[16px] text-gray-600 mt-0.5">
                    {language === 'ko' ? '정기 일정이 아닌, 필요할 때만 복용' : 'Take only when needed, not on a schedule'}
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
              <h3 className="text-[18px] font-semibold text-gray-800 mb-2">
                {language === 'ko' ? '의료 정보' : 'Medical Information'}
              </h3>
              <p className="text-[18px] text-gray-600">
                {language === 'ko' ? '처방 및 의료 정보를 입력하세요' : 'Enter prescription and medical details'}
              </p>
            </div>

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
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white text-[16px] h-12"
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
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white text-[16px] h-12"
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
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white resize-none text-[16px]"
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
                  className="border-gray-200 focus:border-amber-400 focus:ring-amber-400/20 bg-white resize-none text-[16px]"
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

  // Animation variants that use the custom direction prop
  const pageVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 100 : -100
    }),
    center: {
      opacity: 1,
      x: 0
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -100 : 100
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg h-[85vh] p-0 gap-0 flex flex-col [&>button]:hidden rounded-3xl overflow-hidden">
        <DialogTitle className="sr-only">
          {language === 'ko' ? '새 약 추가' : 'Add New Medication'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {STEPS[currentStep - 1].title} - {language === 'ko' ? '단계' : 'Step'} {currentStep} / {STEPS.length}
        </DialogDescription>
        
        {/* Header with Progress */}
        <div className="flex-shrink-0 bg-brand-primary p-4 text-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold text-[rgb(255,255,255)]">
                {language === 'ko' ? '새 약 추가' : 'Add New Medication'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-brand-secondary/50 hover:bg-brand-secondary flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between px-2">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div
                  className={`rounded-full flex items-center justify-center transition-all ${
                    currentStep === step.id
                      ? 'w-11 h-11 bg-brand-accent text-white scale-110'
                      : currentStep > step.id
                      ? 'w-9 h-9 bg-brand-accent/70 text-white'
                      : 'w-9 h-9 bg-white/40 text-gray-600'
                  }`}
                >
                  <span
                    className={`transition-all ${
                      currentStep === step.id ? 'text-[18px] font-bold' : 'text-[15px]'
                    }`}
                  >
                    {step.id}
                  </span>
                </div>
                
                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-[2px] mx-1">
                    <div
                      className={`h-full transition-all ${
                        currentStep > step.id ? 'bg-brand-accent/70' : 'bg-white/40'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3,
                ease: [0.32, 0.72, 0, 1]
              }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
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
              {language === 'ko' ? '이전' : 'Previous'}
            </Button>
          ) : (
            <div className="flex-1"></div>
          )}
          
          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              className="flex-1 h-12 bg-brand-accent hover:bg-brand-accent/80 text-white text-[16px]"
            >
              {language === 'ko' ? '다음' : 'Next'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={creatingRequest}
              className="flex-1 h-12 bg-brand-accent hover:bg-brand-accent/80 text-white text-[16px] disabled:opacity-50"
            >
              {creatingRequest ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                  {language === 'ko' ? '전송 중...' : 'Sending...'}
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  {language === 'ko' ? '저장하기' : 'Save'}
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>

      {/* Photo Upload Sheet */}
      <PhotoUploadSheet
        open={showUploadSheet}
        onOpenChange={setShowUploadSheet}
        onPhotoSelected={handlePhotoSelected}
        title={language === 'ko' ? '약 사진' : 'Medicine Photo'}
      />

      {/* Medicine Photo Crop Dialog */}
      <MedicinePhotoCropDialog
        open={cropDialogOpen}
        onOpenChange={setCropDialogOpen}
        imageSrc={tempPhotoSrc}
        onCropComplete={handleCropComplete}
      />
    </Dialog>
  );
}
