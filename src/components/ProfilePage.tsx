import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar as CalendarIcon, Camera, Edit2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567'
  });

  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(1990, 4, 15));

  const handleSave = () => {
    // Save profile data
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="gradient-primary p-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft size={22} />
            </Button>
            <h1 className="ml-2 text-xl font-bold">내 프로필</h1>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-0 text-base"
            >
              <Edit2 size={18} className="mr-2" />
              편집
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleCancel}
                variant="ghost"
                className="text-white hover:bg-white/20 text-base"
              >
                취소
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-white/20 hover:bg-white/30 text-white border-0 text-base"
              >
                <Save size={18} className="mr-2" />
                저장
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Profile Picture */}
        <Card className="medicine-card p-4 border-0">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Camera size={16} className="text-white" />
                </button>
              )}
            </div>
            <h2 className="mt-4 text-gray-800 text-xl">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-base text-gray-600">{profileData.email}</p>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <User className="text-amber-600" size={20} />
            <span className="text-[16px] font-bold">개인 정보</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="first-name" className="text-gray-700">이름</Label>
              <Input
                id="first-name"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                disabled={!isEditing}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white disabled:opacity-70"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="last-name" className="text-gray-700">성</Label>
              <Input
                id="last-name"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                disabled={!isEditing}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white disabled:opacity-70"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">생년월일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!isEditing}
                  className="w-full justify-start text-left h-12 border-gray-200 hover:border-amber-400 bg-white rounded-xl disabled:opacity-70"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-amber-500" />
                  {dateOfBirth ? dateOfBirth.toLocaleDateString() : <span className="text-gray-400">날짜 선택</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={dateOfBirth}
                  onSelect={(date) => date && setDateOfBirth(date)}
                  initialFocus
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="medicine-card p-4 space-y-4 border-0">
          <h3 className="flex items-center space-x-2 text-gray-800">
            <Mail className="text-amber-600" size={20} />
            <span className="text-[16px] font-bold">연락처 정보</span>
          </h3>
          
          <div className="space-y-3">
            <Label htmlFor="email" className="text-gray-700">이메일 주소</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white disabled:opacity-70"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-gray-700">전화번호</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-white disabled:opacity-70"
              />
            </div>
          </div>
        </Card>

        {/* Account Stats */}
        <Card className="medicine-card p-4 border-0 bg-gradient-to-br from-amber-50 to-orange-50">
          <h3 className="flex items-center space-x-2 text-gray-800 mb-4">
            <span className="text-[16px] font-bold">계정 통계</span>
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-2xl font-bold text-amber-600">12</p>
              <p className="text-xs text-gray-600 mt-1">약</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-2xl font-bold text-orange-600">94%</p>
              <p className="text-xs text-gray-600 mt-1">순응도</p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-2xl font-bold text-amber-600">45</p>
              <p className="text-xs text-gray-600 mt-1">연속 일수</p>
            </div>
          </div>
        </Card>

        {/* Spacing for bottom padding */}
        <div className="pb-6"></div>
      </div>
    </div>
  );
}
