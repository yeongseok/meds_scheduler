import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar as CalendarIcon, Camera, Edit2, Save, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useLanguage } from './LanguageContext';
import { useAuth, useUserProfile, useMedicines, getUserDoseRecords, calculateUserStats } from '../lib';
import { UserAuthDialog } from './UserAuthDialog';
import { ProfilePhotoCropDialog } from './ProfilePhotoCropDialog';
import { PhotoUploadSheet } from './PhotoUploadSheet';
import { toast } from 'sonner@2.0.3';

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile, uploadProfilePhoto } = useUserProfile(user?.uid);
  const { medicines, loading: medicinesLoading } = useMedicines(user?.uid);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [showUploadSheet, setShowUploadSheet] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: undefined as Date | undefined
  });

  // Account statistics
  const [accountStats, setAccountStats] = useState({
    totalMedicines: 0,
    overallAdherence: 0,
    currentStreak: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      const data = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || ''
      };
      setProfileData(data);
      setOriginalData({
        ...data,
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined
      });
      setDateOfBirth(profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined);
    }
  }, [profile]);

  // Calculate account statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !medicines) {
        setStatsLoading(false);
        return;
      }

      try {
        // Fetch all dose records for the user
        const doseRecords = await getUserDoseRecords(user.uid);
        
        // Calculate statistics
        const stats = calculateUserStats(medicines, doseRecords);
        
        setAccountStats({
          totalMedicines: stats.totalMedicines,
          overallAdherence: stats.overallAdherence,
          currentStreak: stats.currentStreak
        });
      } catch (error: any) {
        console.error('Error fetching stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!medicinesLoading) {
      fetchStats();
    }
  }, [user, medicines, medicinesLoading]);

  // Debug: Log when showAuthDialog changes
  useEffect(() => {
    if (showAuthDialog) {
      console.log('Auth dialog should now be visible');
    }
  }, [showAuthDialog]);

  const handleSaveClick = () => {
    if (!user) {
      toast.error(language === 'ko' ? '사용자 인증이 필요합니다' : 'User authentication required');
      return;
    }

    // Show authentication dialog before saving
    setShowAuthDialog(true);
  };

  const handleAuthenticatedSave = async () => {
    if (!user) {
      toast.error(language === 'ko' ? '사용자 인증이 필요합니다' : 'User authentication required');
      return;
    }

    setIsSaving(true);

    try {
      const updates: any = {
        firstName: profileData.firstName || null,
        lastName: profileData.lastName || null,
        phoneNumber: profileData.phoneNumber || null,
        dateOfBirth: dateOfBirth || null
      };

      await updateProfile(updates);
      
      // Update original data
      setOriginalData({
        ...profileData,
        dateOfBirth
      });
      
      setIsEditing(false);
      toast.success(
        language === 'ko'
          ? '프로필이 성공적으로 업데이트되었습니다'
          : 'Profile updated successfully'
      );
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(
        language === 'ko'
          ? `프로필 업데이트 실패: ${error.message}`
          : `Failed to update profile: ${error.message}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Restore original data
    setProfileData({
      firstName: originalData.firstName,
      lastName: originalData.lastName,
      email: originalData.email,
      phoneNumber: originalData.phoneNumber
    });
    setDateOfBirth(originalData.dateOfBirth);
    setIsEditing(false);
  };

  const getInitials = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
    }
    if (profile?.displayName) {
      const parts = profile.displayName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return profile.displayName.substring(0, 2).toUpperCase();
    }
    if (profileData.email) {
      return profileData.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profileData.firstName && profileData.lastName) {
      return language === 'ko'
        ? `${profileData.lastName}${profileData.firstName}`
        : `${profileData.firstName} ${profileData.lastName}`;
    }
    if (profile?.displayName) {
      return profile.displayName;
    }
    return language === 'ko' ? '사용자' : 'User';
  };

  const handlePhotoSelected = (file: File) => {
    console.log('=== handlePhotoSelected CALLED ===');
    console.log('File selected:', file);
    console.log('User:', user);
    
    if (!file || !user) {
      console.log('Early return: no file or no user');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(
        language === 'ko'
          ? '이미지 파일만 업로드할 수 있습니다'
          : 'Only image files can be uploaded'
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        language === 'ko'
          ? '이미지 크기는 5MB 이하여야 합니다'
          : 'Image size must be less than 5MB'
      );
      return;
    }

    // Read file and show crop dialog
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        console.log('Image loaded, setting state...');
        setSelectedImageSrc(e.target.result as string);
        setShowCropDialog(true);
        console.log('State updated: showCropDialog = true');
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast.error(
        language === 'ko'
          ? '이미지를 읽을 수 없습니다'
          : 'Failed to read image file'
      );
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user) return;

    setIsUploadingPhoto(true);
    setShowCropDialog(false);
    
    try {
      // Convert blob to file
      const croppedFile = new File([croppedImageBlob], 'profile-photo.jpg', {
        type: 'image/jpeg'
      });
      
      await uploadProfilePhoto(croppedFile);
      toast.success(
        language === 'ko'
          ? '프로필 사진이 업데이트되었습니다'
          : 'Profile photo updated successfully'
      );
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast.error(
        language === 'ko'
          ? `사진 업로드 실패: ${error.message}`
          : `Failed to upload photo: ${error.message}`
      );
    } finally {
      setIsUploadingPhoto(false);
      setSelectedImageSrc(null);
    }
  };

  const handleCropDialogClose = (open: boolean) => {
    setShowCropDialog(open);
    if (!open) {
      // Clean up when dialog is closed
      setSelectedImageSrc(null);
    }
  };

  const isLoading = authLoading || profileLoading;

  return (
    <>
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="bg-brand-primary p-4 text-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/30 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-800 hover:bg-brand-secondary/20">
              <ArrowLeft size={22} />
            </Button>
            <h1 className="ml-2 text-xl font-bold text-[rgb(255,255,255)]">
              {language === 'ko' ? '내 프로필' : 'My Profile'}
            </h1>
          </div>
          {!isLoading && !isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-brand-accent hover:bg-brand-accent/80 text-white border-0 text-base"
            >
              <Edit2 size={18} className="mr-2" />
              {language === 'ko' ? '편집' : 'Edit'}
            </Button>
          ) : !isLoading && isEditing ? (
            <div className="flex gap-2">
              <Button 
                onClick={handleCancel}
                variant="ghost"
                className="text-gray-800 hover:bg-brand-secondary/20 text-base"
                disabled={isSaving}
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleSaveClick}
                className="bg-brand-accent hover:bg-brand-accent/80 text-white border-0 text-base"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 size={18} className="mr-2 animate-spin" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                {isSaving 
                  ? (language === 'ko' ? '저장 중...' : 'Saving...')
                  : (language === 'ko' ? '저장' : 'Save')
                }
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#3674B5] border-r-transparent"></div>
          </div>
        ) : (
          <>
            {/* Profile Picture */}
            <Card className="medicine-card p-4 border-0">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    {profile?.photoURL && <AvatarImage src={profile.photoURL} alt="Profile" />}
                    <AvatarFallback className="bg-[#3674B5] text-white text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button 
                      type="button"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#3674B5] rounded-full flex items-center justify-center shadow-lg border-2 border-white disabled:opacity-50"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Camera button clicked');
                        setShowUploadSheet(true);
                      }}
                      disabled={isUploadingPhoto}
                    >
                      {isUploadingPhoto ? (
                        <Loader2 size={16} className="text-white animate-spin" />
                      ) : (
                        <Camera size={16} className="text-white" />
                      )}
                    </button>
                  )}
                </div>
                <h2 className="mt-4 text-gray-800 text-xl">{getDisplayName()}</h2>
                <p className="text-base text-gray-600">{profileData.email}</p>
              </div>
            </Card>

            {/* Personal Information */}
            <Card className="medicine-card p-4 space-y-4 border-0">
              <h3 className="flex items-center space-x-2 text-gray-800">
                <User className="text-[#3674B5]" size={20} />
                <span className="text-[16px] font-bold">
                  {language === 'ko' ? '개인 정보' : 'Personal Information'}
                </span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="first-name" className="text-gray-700 text-[17px]">
                    {language === 'ko' ? '이름' : 'First Name'}
                  </Label>
                  <Input
                    id="first-name"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 bg-white disabled:opacity-70"
                    placeholder={language === 'ko' ? '이름' : 'First name'}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="last-name" className="text-gray-700 text-[17px]">
                    {language === 'ko' ? '성' : 'Last Name'}
                  </Label>
                  <Input
                    id="last-name"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 bg-white disabled:opacity-70"
                    placeholder={language === 'ko' ? '성' : 'Last name'}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700 text-[17px]">
                  {language === 'ko' ? '생년월일' : 'Date of Birth'}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!isEditing}
                      className="w-full justify-start text-left h-12 border-gray-200 hover:border-brand-primary bg-white rounded-xl disabled:opacity-70"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-brand-accent" />
                      {dateOfBirth 
                        ? dateOfBirth.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US')
                        : <span className="text-gray-400">
                            {language === 'ko' ? '날짜 선택' : 'Select date'}
                          </span>
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      initialFocus
                      className="rounded-2xl"
                      defaultMonth={dateOfBirth || new Date(1990, 0)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="medicine-card p-4 space-y-4 border-0">
              <h3 className="flex items-center space-x-2 text-gray-800">
                <Mail className="text-brand-accent" size={20} />
                <span className="text-[16px] font-bold">
                  {language === 'ko' ? '연락처 정보' : 'Contact Information'}
                </span>
              </h3>
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-700 text-[17px]">
                  {language === 'ko' ? '이메일 주소' : 'Email Address'}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled={true}
                    className="pl-10 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 bg-gray-50 disabled:opacity-70"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {language === 'ko'
                    ? '이메일 주소는 변경할 수 없습니다'
                    : 'Email address cannot be changed'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-gray-700 text-[17px]">
                  {language === 'ko' ? '전화번호' : 'Phone Number'}
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-accent" size={18} />
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20 bg-white disabled:opacity-70"
                    placeholder={language === 'ko' ? '전화번호 입력' : 'Enter phone number'}
                  />
                </div>
              </div>
            </Card>

            {/* Account Stats */}
            <Card className="medicine-card p-4 border-0 bg-gradient-to-br from-[#E8F3F1] to-[#F8E8E1]">
              <h3 className="flex items-center space-x-2 text-gray-800 mb-4">
                <span className="text-[16px] font-bold">
                  {language === 'ko' ? '계정 통계' : 'Account Statistics'}
                </span>
              </h3>
              
              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 size={24} className="animate-spin text-[#3674B5]" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white rounded-xl">
                    <p className="text-2xl font-bold text-[#3674B5]">
                      {accountStats.totalMedicines}
                    </p>
                    <p className="text-[15px] text-gray-600 mt-1">
                      {language === 'ko' ? '약' : 'Medicines'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <p className="text-2xl font-bold text-[#D67C6C]">
                      {accountStats.overallAdherence}%
                    </p>
                    <p className="text-[15px] text-gray-600 mt-1">
                      {language === 'ko' ? '순응도' : 'Adherence'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl">
                    <p className="text-2xl font-bold text-[#4EBAAA]">
                      {accountStats.currentStreak}
                    </p>
                    <p className="text-[15px] text-gray-600 mt-1">
                      {language === 'ko' ? '연속 일수' : 'Day Streak'}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Spacing for bottom padding */}
        <div className="pb-6"></div>
        </div>
      </div>

      {/* User Authentication Dialog */}
      <UserAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthenticated={handleAuthenticatedSave}
        title={language === 'ko' ? '프로필 변경 인증' : 'Verify Profile Changes'}
        description={
          language === 'ko'
            ? '프로필 정보를 변경하려면 비밀번호를 입력해주세요'
            : 'Please enter your password to save profile changes'
        }
      />

      {/* Photo Upload Sheet */}
      <PhotoUploadSheet
        open={showUploadSheet}
        onOpenChange={setShowUploadSheet}
        onPhotoSelected={handlePhotoSelected}
        title={language === 'ko' ? '프로필 사진' : 'Profile Photo'}
      />

      {/* Profile Photo Crop Dialog */}
      <ProfilePhotoCropDialog
        open={showCropDialog}
        onOpenChange={handleCropDialogClose}
        imageSrc={selectedImageSrc || ''}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
