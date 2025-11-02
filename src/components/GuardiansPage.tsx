import React, { useState } from 'react';
import { UserPlus, Shield, Users, Mail, Check, X, Eye, Share2, Bell, Activity, MessageCircle, Phone } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from './LanguageContext';

export function GuardiansPage() {
  const { language } = useLanguage();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('');
  const [inviteMethod, setInviteMethod] = useState('email');
  const [invitePhone, setInvitePhone] = useState('');
  const [shareHistory, setShareHistory] = useState(true);
  const [shareReminders, setShareReminders] = useState(true);
  
  // Alert dialog states
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [resendDialogOpen, setResendDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<{id: string, name: string} | null>(null);
  const [selectedInvite, setSelectedInvite] = useState<{id: string, email: string} | null>(null);
  
  // Edit permissions dialog state
  const [editPermissionsOpen, setEditPermissionsOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<any>(null);
  const [editCanViewHistory, setEditCanViewHistory] = useState(false);
  const [editCanGetNotifications, setEditCanGetNotifications] = useState(false);
  const [editRelationship, setEditRelationship] = useState('');

  // Mock data for guardians
  const guardians = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      relationship: language === 'ko' ? '딸' : 'Daughter',
      status: 'active',
      canViewHistory: true,
      canGetNotifications: true,
      addedDate: 'Jan 15, 2025',
      initials: 'SJ',
      color: 'bg-orange-300'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'dr.chen@clinic.com',
      relationship: language === 'ko' ? '의사' : 'Doctor',
      status: 'active',
      canViewHistory: true,
      canGetNotifications: false,
      addedDate: 'Dec 20, 2024',
      initials: 'MC',
      color: 'bg-amber-400'
    }
  ];

  const pendingInvites = [
    {
      id: '3',
      email: 'john.smith@email.com',
      sentDate: 'Jan 28, 2025',
      status: 'pending'
    }
  ];

  // Mock data for received invitations
  const receivedInvitations = [
    {
      id: 'r1',
      fromName: 'Robert Miller',
      fromEmail: 'robert.m@email.com',
      relationship: language === 'ko' ? '아버지' : 'Father',
      canViewHistory: true,
      canGetNotifications: true,
      receivedDate: 'Jan 29, 2025',
      initials: 'RM',
      color: 'bg-orange-400'
    },
    {
      id: 'r2',
      fromName: 'Emily Davis',
      fromEmail: 'emily.d@email.com',
      relationship: language === 'ko' ? '딸' : 'Daughter',
      canViewHistory: true,
      canGetNotifications: false,
      receivedDate: 'Jan 27, 2025',
      initials: 'ED',
      color: 'bg-amber-300'
    }
  ];

  // Alert dialog states for received invitations
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [selectedReceivedInvite, setSelectedReceivedInvite] = useState<{id: string, fromName: string} | null>(null);
  const [acceptRelationship, setAcceptRelationship] = useState('');

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header - Info Card */}
      <div className="p-4 flex-shrink-0">
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Share2 className="text-amber-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1 text-[18px]">
                {language === 'ko' ? '케어 서클이란?' : 'What is Care Circle?'}
              </h3>
              <p className="text-sm text-gray-600 text-[16px]">
                {language === 'ko' 
                  ? '가족, 간병인 또는 의료 제공자를 초대하여 복약 일정과 기록을 확인할 수 있습니다. 복용을 놓쳤을 때 업데이트를 받게 됩니다.'
                  : 'Invite family, caregivers, or healthcare providers to view your medication schedule and history. They\'ll receive updates when you miss a dose.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">

        {/* Invite Guardian Button */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-md text-[18px]">
              <UserPlus size={20} className="mr-2" />
              {language === 'ko' ? '케어 서클에 초대' : 'Invite to Care Circle'}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[20px]">
                {language === 'ko' ? '보호자 초대' : 'Invite Guardian'}
              </DialogTitle>
              <DialogDescription className="text-[14px] text-gray-600">
                {language === 'ko' 
                  ? '가족, 간병인 또는 의료 제공자를 케어 시료에 초대하세요.'
                  : 'Invite family, caregiver, or healthcare provider to your care team.'}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-5 py-4">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[16px]">
                  {language === 'ko' ? '이름' : 'Name'}
                </Label>
                <Input
                  id="name"
                  placeholder={language === 'ko' ? '보호자 이름 입력' : 'Enter guardian name'}
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="text-[16px]"
                />
              </div>

              {/* Invitation Method Selection */}
              <div className="space-y-2">
                <Label className="text-[16px]">
                  {language === 'ko' ? '초대 방법' : 'Invitation Method'}
                </Label>
                <RadioGroup value={inviteMethod} onValueChange={setInviteMethod} className="gap-2">
                  <div className="flex items-center space-x-3 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    <RadioGroupItem value="kakaotalk" id="kakaotalk" />
                    <Label htmlFor="kakaotalk" className="flex items-center gap-2 cursor-pointer text-[16px] flex-1">
                      <MessageCircle size={20} className="text-yellow-500" />
                      <span>{language === 'ko' ? '카카오톡' : 'KakaoTalk'}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    <RadioGroupItem value="gmail" id="gmail" />
                    <Label htmlFor="gmail" className="flex items-center gap-2 cursor-pointer text-[16px] flex-1">
                      <Mail size={20} className="text-red-500" />
                      <span>{language === 'ko' ? '구글 이메일' : 'Gmail'}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer text-[16px] flex-1">
                      <Mail size={20} className="text-blue-500" />
                      <span>{language === 'ko' ? '이메일' : 'Email'}</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                    <RadioGroupItem value="phone" id="phone" />
                    <Label htmlFor="phone" className="flex items-center gap-2 cursor-pointer text-[16px] flex-1">
                      <Phone size={20} className="text-green-500" />
                      <span>{language === 'ko' ? '전화번호' : 'Phone Number'}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Email Input - shown for email/gmail methods */}
              {(inviteMethod === 'email' || inviteMethod === 'gmail') && (
                <div className="space-y-2">
                  <Label htmlFor="contact" className="text-[16px]">
                    {language === 'ko' ? '이메일 주소' : 'Email Address'}
                  </Label>
                  <Input
                    id="contact"
                    type="email"
                    placeholder="guardian@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="text-[16px]"
                  />
                </div>
              )}

              {/* Phone Input - shown for phone method */}
              {inviteMethod === 'phone' && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-[16px]">
                    {language === 'ko' ? '전화번호' : 'Phone Number'}
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder={language === 'ko' ? '010-1234-5678' : '010-1234-5678'}
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    className="text-[16px]"
                  />
                </div>
              )}

              {/* Relation Input */}
              <div className="space-y-2">
                <Label htmlFor="relation" className="text-[16px]">
                  {language === 'ko' ? '관계' : 'Relation'}
                </Label>
                <Select value={inviteRelationship} onValueChange={setInviteRelationship}>
                  <SelectTrigger className="text-[16px]">
                    <SelectValue placeholder={language === 'ko' ? '관계 선택' : 'Select relation'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daughter" className="text-[16px]">
                      {language === 'ko' ? '딸' : 'Daughter'}
                    </SelectItem>
                    <SelectItem value="Son" className="text-[16px]">
                      {language === 'ko' ? '아들' : 'Son'}
                    </SelectItem>
                    <SelectItem value="Spouse" className="text-[16px]">
                      {language === 'ko' ? '배우자' : 'Spouse'}
                    </SelectItem>
                    <SelectItem value="Sibling" className="text-[16px]">
                      {language === 'ko' ? '형제/자매' : 'Sibling'}
                    </SelectItem>
                    <SelectItem value="Grandchild" className="text-[16px]">
                      {language === 'ko' ? '손자/손녀' : 'Grandchild'}
                    </SelectItem>
                    <SelectItem value="Friend" className="text-[16px]">
                      {language === 'ko' ? '친구' : 'Friend'}
                    </SelectItem>
                    <SelectItem value="Other" className="text-[16px]">
                      {language === 'ko' ? '기타' : 'Other'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sharing Permissions */}
              <div className="space-y-2 pt-2">
                <Label className="text-[16px]">
                  {language === 'ko' ? '부여 권한' : 'Requested Permissions'}
                </Label>
                
                <div className="space-y-3">
                  {/* Share Records Toggle */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <Activity size={20} className="text-amber-600 mt-1" />
                      <div>
                        <div className="text-[16px]">
                          {language === 'ko' ? '복용 기록 공유' : 'Share Records'}
                        </div>
                        <div className="text-[14px] text-gray-500">
                          {language === 'ko' ? '과거 복약 기록' : 'Past medication records'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={shareHistory}
                      onCheckedChange={setShareHistory}
                    />
                  </div>

                  {/* Missed Dose Alert Toggle */}
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <Bell size={20} className="text-amber-600 mt-1" />
                      <div>
                        <div className="text-[16px]">
                          {language === 'ko' ? '미복용 알림 공유' : 'Missed Dose Alert'}
                        </div>
                        <div className="text-[14px] text-gray-500">
                          {language === 'ko' ? '알림 보내기 알림' : 'Send alert notifications'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={shareReminders}
                      onCheckedChange={setShareReminders}
                    />
                  </div>
                </div>
              </div>
            </div>
            </ScrollArea>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setInviteDialogOpen(false)}
                className="flex-1 text-[16px]"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button
                onClick={() => {
                  // Validation
                  if (!inviteName.trim() || !inviteRelationship.trim()) {
                    toast.error(language === 'ko' ? '모든 필드를 입력해주세요' : 'Please fill in all fields');
                    return;
                  }

                  // Validate based on invitation method
                  if (inviteMethod === 'phone') {
                    if (!invitePhone.trim()) {
                      toast.error(language === 'ko' ? '전화번호를 입력해주세요' : 'Please enter phone number');
                      return;
                    }
                  } else if (inviteMethod === 'email' || inviteMethod === 'gmail') {
                    if (!inviteEmail.trim()) {
                      toast.error(language === 'ko' ? '이메일 주소를 입력해주세요' : 'Please enter email address');
                      return;
                    }
                    // Validate email format for email/gmail
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(inviteEmail)) {
                      toast.error(language === 'ko' ? '유효한 이메일 주소를 입력해주세요' : 'Please enter a valid email address');
                      return;
                    }
                  }

                  // In a real app, this would send an invitation via the selected method
                  const methodName = inviteMethod === 'kakaotalk' ? (language === 'ko' ? '카카오톡' : 'KakaoTalk')
                    : inviteMethod === 'gmail' ? (language === 'ko' ? '지메일' : 'Gmail')
                    : inviteMethod === 'email' ? (language === 'ko' ? '이메일' : 'Email')
                    : (language === 'ko' ? '문자' : 'SMS');

                  const contactInfo = inviteMethod === 'phone' ? invitePhone 
                    : (inviteMethod === 'email' || inviteMethod === 'gmail') ? inviteEmail 
                    : inviteName;

                  toast.success(
                    language === 'ko' 
                      ? `${methodName}으로 ${inviteName}님에게 보호자 초대를 보냈습니다` 
                      : `Guardian invitation sent to ${inviteName} via ${methodName}`
                  );
                  
                  // Reset form
                  setInviteName('');
                  setInviteEmail('');
                  setInvitePhone('');
                  setInviteRelationship('');
                  setInviteMethod('email');
                  setShareHistory(true);
                  setShareReminders(true);
                  setInviteDialogOpen(false);
                }}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-[16px]"
              >
                {language === 'ko' ? '초대 보내기' : 'Send Invitation'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Received Invitations */}
        {receivedInvitations.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="text-amber-600" size={20} />
              <h2 className="font-semibold text-gray-800 text-[18px]">
                {language === 'ko' ? '받은 초대' : 'Received Invitations'}
              </h2>
              <Badge className="bg-amber-100 text-amber-700 text-[14px]">{receivedInvitations.length}</Badge>
            </div>

            <div className="space-y-3">
              {receivedInvitations.map((invite) => (
                <Card key={invite.id} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`${invite.color} text-white`}>
                        {invite.initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-800 text-[18px]">{invite.fromName}</h3>
                        <p className="text-xs text-gray-600 text-[16px]">{invite.fromEmail}</p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-amber-100 mb-3">
                        <p className="text-xs text-gray-600 mb-2 text-[14px]">
                          <span className="font-medium text-gray-800">{invite.fromName}</span>
                          {language === 'ko' 
                            ? '님이 케어 서클에 초대하고 싶어합니다'
                            : ' wants to invite you to their Care Circle'}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {invite.canViewHistory && (
                            <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded text-[14px]">
                              <Eye size={12} className="mr-1" />
                              {language === 'ko' ? '기록 확인' : 'View history'}
                            </span>
                          )}
                          {invite.canGetNotifications && (
                            <span className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded text-[14px]">
                              <Bell size={12} className="mr-1" />
                              {language === 'ko' ? '진행알림' : 'Get alerts'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 h-9 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-[16px]"
                          onClick={() => {
                            setSelectedReceivedInvite({ id: invite.id, fromName: invite.fromName });
                            setAcceptDialogOpen(true);
                          }}
                        >
                          <Check size={16} className="mr-1" />
                          {language === 'ko' ? '수락' : 'Accept'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-[16px]"
                          onClick={() => {
                            setSelectedReceivedInvite({ id: invite.id, fromName: invite.fromName });
                            setDeclineDialogOpen(true);
                          }}
                        >
                          <X size={16} className="mr-1" />
                          {language === 'ko' ? '거절' : 'Decline'}
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 mt-2 text-[14px]">
                        {language === 'ko' ? '받은 날짜: ' : 'Received: '}{invite.receivedDate}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Guardians */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Users className="text-orange-600" size={20} />
            <h2 className="font-semibold text-gray-800 text-[18px]">
              {language === 'ko' ? '활성 보호자' : 'Active Guardians'}
            </h2>
            <Badge className="bg-orange-100 text-orange-700 text-[14px]">{guardians.length}</Badge>
          </div>

          <div className="space-y-3">
            {guardians.map((guardian) => (
              <Card key={guardian.id} className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`${guardian.color} text-white`}>
                      {guardian.initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-[18px]">{guardian.name}</h3>
                        <p className="text-sm text-gray-500 text-[16px]">{guardian.email}</p>
                      </div>
                      <Badge variant="outline" className="text-amber-600 border-amber-300 text-[14px]">
                        <Check size={12} className="mr-1" />
                        {language === 'ko' ? '활성' : 'Active'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="bg-gray-100 py-1 rounded text-[16px] px-[15px] px-[7px] py-[3px]">{guardian.relationship}</span>
                      <span className="text-[14px]">
                        {language === 'ko' ? '추가됨 ' : 'Added '}{guardian.addedDate}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mt-3 text-xs">
                      {guardian.canViewHistory && (
                        <span className="flex items-center text-amber-600 text-[14px]">
                          <Eye size={12} className="mr-1" />
                          {language === 'ko' ? '기록 확인' : 'View history'}
                        </span>
                      )}
                      {guardian.canGetNotifications && (
                        <span className="flex items-center text-orange-600 text-[14px]">
                          <Bell size={12} className="mr-1" />
                          {language === 'ko' ? '알림' : 'Alerts'}
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 text-[14px]"
                        onClick={() => {
                          setEditingGuardian(guardian);
                          setEditCanViewHistory(guardian.canViewHistory);
                          setEditCanGetNotifications(guardian.canGetNotifications);
                          setEditRelationship(guardian.relationship.toLowerCase());
                          setEditPermissionsOpen(true);
                        }}
                      >
                        {language === 'ko' ? '권한 편집' : 'Edit Permissions'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 text-[14px]"
                        onClick={() => {
                          setSelectedGuardian({ id: guardian.id, name: guardian.name });
                          setRemoveDialogOpen(true);
                        }}
                      >
                        <X size={14} className="mr-1" />
                        {language === 'ko' ? '제거' : 'Remove'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="text-amber-600" size={20} />
              <h2 className="font-semibold text-gray-800 text-[18px]">
                {language === 'ko' ? '대기 중인 초대' : 'Pending Invites'}
              </h2>
              <Badge className="bg-amber-100 text-amber-700 text-[14px]">{pendingInvites.length}</Badge>
            </div>

            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <Card key={invite.id} className="p-4 bg-white border-0 shadow-sm border-l-4 border-l-amber-400">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-amber-600" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-[16px]">{invite.email}</p>
                      <p className="text-xs text-gray-500 text-[14px]">
                        {language === 'ko' ? '보낸 날짜 ' : 'Sent '}{invite.sentDate}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-8 text-orange-600 text-[14px]"
                          onClick={() => {
                            setSelectedInvite({ id: invite.id, email: invite.email });
                            setResendDialogOpen(true);
                          }}
                        >
                          {language === 'ko' ? '재전송' : 'Resend'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-8 text-red-600 text-[14px]"
                          onClick={() => {
                            setSelectedInvite({ id: invite.id, email: invite.email });
                            setCancelDialogOpen(true);
                          }}
                        >
                          {language === 'ko' ? '취소' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start space-x-2">
            <Shield className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm text-amber-900 font-medium mb-1 text-[16px]">
                {language === 'ko' ? '개인정보가 중요합니다' : 'Your Privacy Matters'}
              </p>
              <p className="text-xs text-amber-700 text-[14px]">
                {language === 'ko' 
                  ? '보호자가 볼 수 있는 내용을 제어할 수 있습니다. 언제든지 권한을 변경하거나 액세스를 제거할 수 있습니다.'
                  : 'You control what guardians can see. You can change permissions or remove access at any time.'}
              </p>
            </div>
          </div>
        </Card>

        <div className="h-6"></div>
      </div>

      {/* Edit Permissions Dialog */}
      <Dialog open={editPermissionsOpen} onOpenChange={setEditPermissionsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-800 text-[18px]">
              {language === 'ko' ? '권한 편집' : 'Edit Permissions'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-[16px]">
              {language === 'ko'
                ? `${editingGuardian?.name}님이 케어 서클에서 액세스할 수 있는 항목을 관리하세요.`
                : `Manage what ${editingGuardian?.name} can access in your Care Circle.`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <Avatar className="w-10 h-10">
                <AvatarFallback className={`${editingGuardian?.color} text-white`}>
                  {editingGuardian?.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-[16px]">{editingGuardian?.name}</h4>
                <p className="text-xs text-gray-600 text-[14px]">{editingGuardian?.email}</p>
                <p className="text-xs text-gray-500 mt-1 text-[14px]">
                  <span className="bg-white px-2 py-0.5 rounded border border-gray-200">{editingGuardian?.relationship}</span>
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label htmlFor="editRelationship" className="text-gray-700 text-[16px]">
                  {language === 'ko' ? '관계' : 'Relationship'}
                </Label>
                <Select value={editRelationship} onValueChange={setEditRelationship}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={language === 'ko' ? '관계 선택' : 'Select relationship'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">{language === 'ko' ? '배우자' : 'Spouse'}</SelectItem>
                    <SelectItem value="partner">{language === 'ko' ? '파트너' : 'Partner'}</SelectItem>
                    <SelectItem value="daughter">{language === 'ko' ? '딸' : 'Daughter'}</SelectItem>
                    <SelectItem value="son">{language === 'ko' ? '아들' : 'Son'}</SelectItem>
                    <SelectItem value="mother">{language === 'ko' ? '어머니' : 'Mother'}</SelectItem>
                    <SelectItem value="father">{language === 'ko' ? '아버지' : 'Father'}</SelectItem>
                    <SelectItem value="sibling">{language === 'ko' ? '형제자매' : 'Sibling'}</SelectItem>
                    <SelectItem value="caregiver">{language === 'ko' ? '간병인' : 'Caregiver'}</SelectItem>
                    <SelectItem value="nurse">{language === 'ko' ? '간호사' : 'Nurse'}</SelectItem>
                    <SelectItem value="doctor">{language === 'ko' ? '의사' : 'Doctor'}</SelectItem>
                    <SelectItem value="friend">{language === 'ko' ? '친구' : 'Friend'}</SelectItem>
                    <SelectItem value="other">{language === 'ko' ? '기타' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <h4 className="font-medium text-gray-800 text-[16px]">
                {language === 'ko' ? '액세스 권한' : 'Access Permissions'}
              </h4>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Eye className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 text-[16px]">
                      {language === 'ko' ? '기록 공유' : 'Share History'}
                    </p>
                    <p className="text-xs text-gray-500 text-[14px]">
                      {language === 'ko' ? '과거 복약 기록 확인' : 'View past medication records'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={editCanViewHistory} 
                  onCheckedChange={setEditCanViewHistory} 
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Bell className="text-orange-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 text-[16px]">
                      {language === 'ko' ? '미복용 알림' : 'Missed Dose Alerts'}
                    </p>
                    <p className="text-xs text-gray-500 text-[14px]">
                      {language === 'ko' ? '기한 초과 시 알림 받기' : 'Get alerts when overdue'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={editCanGetNotifications} 
                  onCheckedChange={setEditCanGetNotifications} 
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 text-[16px]"
                onClick={() => {
                  setEditPermissionsOpen(false);
                  setEditingGuardian(null);
                }}
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[16px]"
                onClick={() => {
                  // Save permissions logic here
                  console.log('Saving permissions for:', editingGuardian?.id, {
                    relationship: editRelationship,
                    canViewHistory: editCanViewHistory,
                    canGetNotifications: editCanGetNotifications
                  });
                  setEditPermissionsOpen(false);
                  setEditingGuardian(null);
                }}
              >
                {language === 'ko' ? '변경사항 저장' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Guardian Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">
              {language === 'ko' ? '보호자를 제거하시겠습니까?' : 'Remove Guardian?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              {language === 'ko' ? (
                <>
                  <span className="font-semibold text-gray-800">{selectedGuardian?.name}</span>님을 케어 서클에서 제거하시겠습니까? 더 이상 복약 정보에 액세스할 수 없습니다.
                </>
              ) : (
                <>
                  Remove <span className="font-semibold text-gray-800">{selectedGuardian?.name}</span> from your Care Circle? They will no longer have access to your medication information.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white text-[16px]"
              onClick={() => {
                // Remove guardian logic here
                console.log('Removing guardian:', selectedGuardian?.id);
                setRemoveDialogOpen(false);
                setSelectedGuardian(null);
              }}
            >
              {language === 'ko' ? '제거' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resend Invite Confirmation Dialog */}
      <AlertDialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">
              {language === 'ko' ? '초대를 재전송하시겠습니까?' : 'Resend Invitation?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              {language === 'ko' ? (
                <>
                  <span className="font-semibold text-gray-800">{selectedInvite?.email}</span>로 다시 초대 이메일을 보내시겠습니까?
                </>
              ) : (
                <>
                  Send another invitation email to <span className="font-semibold text-gray-800">{selectedInvite?.email}</span>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-orange-500 hover:bg-orange-600 text-white text-[16px]"
              onClick={() => {
                // Resend invite logic here
                console.log('Resending invite to:', selectedInvite?.email);
                
                // Show success toast
                toast.success(language === 'ko' 
                  ? `${selectedInvite?.email}로 초대를 재전송했습니다! 📧`
                  : `Invitation resent to ${selectedInvite?.email}! 📧`);
                
                setResendDialogOpen(false);
                setSelectedInvite(null);
              }}
            >
              {language === 'ko' ? '재전송' : 'Resend'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Invite Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">
              {language === 'ko' ? '초대를 취소하시겠습니까?' : 'Cancel Invitation?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              {language === 'ko' ? (
                <>
                  <span className="font-semibold text-gray-800">{selectedInvite?.email}</span>로의 초대를 취소하시겠습니까? 이 작업은 취소할 수 없습니다.
                </>
              ) : (
                <>
                  Cancel the invitation to <span className="font-semibold text-gray-800">{selectedInvite?.email}</span>? This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">
              {language === 'ko' ? '돌아가기' : 'Go Back'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white text-[16px]"
              onClick={() => {
                // Cancel invite logic here
                console.log('Canceling invite:', selectedInvite?.id);
                setCancelDialogOpen(false);
                setSelectedInvite(null);
              }}
            >
              {language === 'ko' ? '초대 취소' : 'Cancel Invite'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Accept Invitation Confirmation Dialog */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">
              {language === 'ko' ? '초대를 수락하시겠습니까?' : 'Accept Invitation?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              {language === 'ko' ? (
                <>
                  <span className="font-semibold text-gray-800">{selectedReceivedInvite?.fromName}</span>님의 보호자가 되며, 부여된 권한에 따라 복약 정보를 확인할 수 있습니다.
                </>
              ) : (
                <>
                  You will become a guardian for <span className="font-semibold text-gray-800">{selectedReceivedInvite?.fromName}</span> and can view their medication information based on granted permissions.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accept-relationship" className="text-gray-700 text-[16px]">
                {language === 'ko' ? '나의 관계' : 'My Relationship'} <span className="text-red-500">*</span>
              </Label>
              <Select value={acceptRelationship} onValueChange={setAcceptRelationship}>
                <SelectTrigger id="accept-relationship" className="bg-white">
                  <SelectValue placeholder={language === 'ko' ? '관계 선택' : 'Select relationship'} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="spouse">{language === 'ko' ? '배우자' : 'Spouse'}</SelectItem>
                  <SelectItem value="partner">{language === 'ko' ? '파트너' : 'Partner'}</SelectItem>
                  <SelectItem value="parent">{language === 'ko' ? '부모' : 'Parent'}</SelectItem>
                  <SelectItem value="child">{language === 'ko' ? '자녀' : 'Child'}</SelectItem>
                  <SelectItem value="sibling">{language === 'ko' ? '형제자매' : 'Sibling'}</SelectItem>
                  <SelectItem value="relative">{language === 'ko' ? '기타 친척' : 'Other Relative'}</SelectItem>
                  <SelectItem value="friend">{language === 'ko' ? '친구' : 'Friend'}</SelectItem>
                  <SelectItem value="caregiver">{language === 'ko' ? '간병인' : 'Caregiver'}</SelectItem>
                  <SelectItem value="nurse">{language === 'ko' ? '간호사' : 'Nurse'}</SelectItem>
                  <SelectItem value="doctor">{language === 'ko' ? '의사' : 'Doctor'}</SelectItem>
                  <SelectItem value="pharmacist">{language === 'ko' ? '약사' : 'Pharmacist'}</SelectItem>
                  <SelectItem value="other">{language === 'ko' ? '기타' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]" onClick={() => setAcceptRelationship('')}>
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-[16px]"
              disabled={!acceptRelationship}
              onClick={() => {
                if (acceptRelationship) {
                  // Accept invitation logic here
                  console.log('Accepting invitation from:', selectedReceivedInvite?.id, 'as relationship:', acceptRelationship);
                  
                  // Show success toast
                  toast.success(language === 'ko' 
                    ? `${selectedReceivedInvite?.fromName}님의 보호자가 되었습니다! 🤝`
                    : `You are now a guardian for ${selectedReceivedInvite?.fromName}! 🤝`);
                  
                  setAcceptDialogOpen(false);
                  setSelectedReceivedInvite(null);
                  setAcceptRelationship('');
                }
              }}
            >
              {language === 'ko' ? '수락' : 'Accept'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Invitation Confirmation Dialog */}
      <AlertDialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">
              {language === 'ko' ? '초대를 거절하시겠습니까?' : 'Decline Invitation?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              {language === 'ko' ? (
                <>
                  <span className="font-semibold text-gray-800">{selectedReceivedInvite?.fromName}</span>님의 초대를 거절하시겠습니까? 상대방에게 알림이 가지 않습니다.
                </>
              ) : (
                <>
                  Decline the invitation from <span className="font-semibold text-gray-800">{selectedReceivedInvite?.fromName}</span>? They will not be notified.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">
              {language === 'ko' ? '돌아가기' : 'Go Back'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white text-[16px]"
              onClick={() => {
                // Decline invitation logic here
                console.log('Declining invitation from:', selectedReceivedInvite?.id);
                
                // Show toast
                toast(language === 'ko' 
                  ? `${selectedReceivedInvite?.fromName}님의 초대를 거절했습니다`
                  : `Declined invitation from ${selectedReceivedInvite?.fromName}`);
                
                setDeclineDialogOpen(false);
                setSelectedReceivedInvite(null);
              }}
            >
              {language === 'ko' ? '거절' : 'Decline'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
