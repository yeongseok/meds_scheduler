import React, { useState } from 'react';
import { Settings, Plus, CheckCircle, HelpCircle, Activity, Bell, MessageCircle, Mail, Phone, Crown, Star, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { useLanguage } from './LanguageContext';

export interface CareRecipient {
  id: string;
  name: string;
  initials: string;
  color: string;
  relation: string;
  todayStatus?: {
    total: number;
    taken: number;
    overdue: number;
    pending: number;
    upcoming: number;
  };
  adherence?: number;
  healthScore?: number;
}

interface SharedHeaderProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
  careRecipients: CareRecipient[];
  setCareRecipients: (recipients: CareRecipient[]) => void;
  onNavigateToSettings?: () => void;
  showMe?: boolean;
  showInfoBanner?: boolean;
}

export function SharedHeader({ 
  selectedView, 
  setSelectedView, 
  careRecipients, 
  setCareRecipients,
  onNavigateToSettings,
  showMe = true,
  showInfoBanner = false
}: SharedHeaderProps) {
  const { t, language } = useLanguage();
  const [showAddRecipientDialog, setShowAddRecipientDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientPhone, setNewRecipientPhone] = useState('');
  const [newRecipientRelation, setNewRecipientRelation] = useState('');
  const [inviteMethod, setInviteMethod] = useState('email');
  const [shareRecords, setShareRecords] = useState(true);
  const [shareMissedAlerts, setShareMissedAlerts] = useState(true);

  // Function to invite a care recipient
  const handleInviteGuardian = () => {
    if (!newRecipientName.trim() || !newRecipientRelation.trim()) {
      toast.error(language === 'ko' ? '모든 필드를 입력해주세요' : 'Please fill in all fields');
      return;
    }

    // Validate based on invitation method
    if (inviteMethod === 'phone') {
      if (!newRecipientPhone.trim()) {
        toast.error(language === 'ko' ? '전화번호를 입력해주세요' : 'Please enter phone number');
        return;
      }
    } else if (inviteMethod === 'email' || inviteMethod === 'gmail') {
      if (!newRecipientEmail.trim()) {
        toast.error(language === 'ko' ? '이메일 주소를 입력해주세요' : 'Please enter email address');
        return;
      }
      // Validate email format for email/gmail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newRecipientEmail)) {
        toast.error(language === 'ko' ? '유효한 이메일 주소를 입력해주세요' : 'Please enter a valid email address');
        return;
      }
    }

    // In a real app, this would send an invitation via the selected method
    const methodName = inviteMethod === 'kakaotalk' ? (language === 'ko' ? '카카오톡' : 'KakaoTalk')
      : inviteMethod === 'gmail' ? (language === 'ko' ? '지메일' : 'Gmail')
      : inviteMethod === 'email' ? (language === 'ko' ? '이메일' : 'Email')
      : (language === 'ko' ? '문자' : 'SMS');

    toast.success(
      language === 'ko' 
        ? `${methodName}으로 ${newRecipientName}님에게 보호 대상자 초대를 보냈습니다` 
        : `Care recipient invitation sent to ${newRecipientName} via ${methodName}`
    );
    
    // Reset form
    setNewRecipientName('');
    setNewRecipientEmail('');
    setNewRecipientPhone('');
    setNewRecipientRelation('');
    setInviteMethod('email');
    setShareRecords(true);
    setShareMissedAlerts(true);
    setShowAddRecipientDialog(false);
  };

  return (
    <>
      {/* Floating Island Header */}
      <div className="p-4 flex-shrink-0">
        <div className="gradient-primary rounded-3xl shadow-lg text-white relative overflow-hidden px-5 py-4">
          {/* Info Banner (for Care Circle page) */}
          {showInfoBanner && (
            <div className="mb-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="flex items-start gap-2">
                <HelpCircle size={20} className="text-white flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-1 text-[16px]">
                    {language === 'ko' ? '케어 서클이란?' : 'What is Care Circle?'}
                  </h3>
                  <p className="text-white/90 text-[14px] leading-relaxed">
                    {language === 'ko' 
                      ? '가족, 간병인 또는 의료 제공자를 초대하여 복약 일정과 기록을 확인할 수 있습니다. 복용을 놓치면 담당자에게 알림 받을 수 있습니다.'
                      : 'Invite family, caregivers or healthcare providers to monitor medication schedule and records. Get alerts when doses are missed.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top Row: Date and Settings */}
          {!showInfoBanner && (
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white text-[15px]">{t('home.date')}</p>
              </div>
              {onNavigateToSettings && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-white/20 hover:bg-white/30 border-0 rounded-full"
                  onClick={onNavigateToSettings}
                >
                  <Settings size={18} className="text-white" />
                </Button>
              )}
            </div>
          )}

          {/* Profile Switcher Row */}
          <div className="flex items-center gap-3 overflow-x-auto">
            {/* Current User */}
            {showMe && (
              <motion.button
                onClick={() => setSelectedView('my-meds')}
                className="flex flex-col items-center flex-shrink-0 group"
                whileTap={{ scale: 0.95 }}
              >
                <div className={`relative mb-1.5 transition-all duration-200 rounded-full bg-white p-1 ${
                  selectedView === 'my-meds' || selectedView === 'my-history'
                    ? 'shadow-md' 
                    : 'opacity-80 group-hover:opacity-100'
                }`}>
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-[14px]">
                      ME
                    </AvatarFallback>
                  </Avatar>
                  {(selectedView === 'my-meds' || selectedView === 'my-history') && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
                    >
                      <CheckCircle size={12} className="text-white" />
                    </motion.div>
                  )}
                </div>
                <span className={`text-[13px] transition-all duration-200 ${
                  selectedView === 'my-meds' || selectedView === 'my-history'
                    ? 'text-white' 
                    : 'text-white/70 group-hover:text-white/90'
                }`}>
                  {language === 'ko' ? '나' : 'Me'}
                </span>
              </motion.button>
            )}

            {/* Care Recipients */}
            {careRecipients.map((person) => (
              <motion.button
                key={person.id}
                onClick={() => setSelectedView(person.id)}
                className="flex flex-col items-center flex-shrink-0 group"
                whileTap={{ scale: 0.95 }}
              >
                <div className={`relative mb-1.5 transition-all duration-200 rounded-full bg-white p-1 ${
                  selectedView === person.id 
                    ? 'shadow-md' 
                    : 'opacity-80 group-hover:opacity-100'
                }`}>
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`${person.color} text-white text-[14px]`}>
                      {person.initials}
                    </AvatarFallback>
                  </Avatar>
                  {selectedView === person.id && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
                    >
                      <CheckCircle size={12} className="text-white" />
                    </motion.div>
                  )}
                </div>
                <span className={`text-[13px] transition-all duration-200 max-w-[56px] text-center truncate ${
                  selectedView === person.id 
                    ? 'text-white' 
                    : 'text-white/70 group-hover:text-white/90'
                }`}>
                  {person.name.split(' ')[0]}
                </span>
              </motion.button>
            ))}

            {/* Add New Recipient Button */}
            <motion.button
              onClick={() => {
                // Check if user already has 1 or more care recipients (excluding "me")
                const recipientsCount = careRecipients.filter(r => r.id !== 'me').length;
                if (recipientsCount >= 1) {
                  setShowUpgradeDialog(true);
                } else {
                  setShowAddRecipientDialog(true);
                }
              }}
              className="flex flex-col items-center flex-shrink-0 group"
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative mb-1.5 w-14 h-14 rounded-full bg-white/20 border-2 border-dashed border-white/40 group-hover:border-white/60 flex items-center justify-center transition-all duration-200 group-hover:bg-white/30">
                <Plus className="text-white" size={22} />
              </div>
              <span className="text-[13px] text-white/70 group-hover:text-white/90 transition-all duration-200">
                {language === 'ko' ? '+ 추가' : '+ Add'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Add Care Recipient Dialog */}
      <Dialog open={showAddRecipientDialog} onOpenChange={setShowAddRecipientDialog}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[20px]">
              {language === 'ko' ? '보호 대상자 추가' : 'Add Care Recipient'}
            </DialogTitle>
            <DialogDescription className="text-[16px]">
              {language === 'ko' 
                ? '약 복용을 도와줄 사람의 정보를 입력해주세요.'
                : 'Enter the details of the person you want to help with medication.'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName" className="text-[16px]">
                {language === 'ko' ? '이름' : 'Name'}
              </Label>
              <Input
                id="recipientName"
                placeholder={language === 'ko' ? '예: 엄마' : 'e.g., Mom'}
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
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
                  <RadioGroupItem value="kakaotalk" id="recipient-kakaotalk" />
                  <Label htmlFor="recipient-kakaotalk" className="flex items-center gap-2 cursor-pointer text-[16px] flex-1">
                    <MessageCircle size={20} className="text-yellow-500" />
                    <span>{language === 'ko' ? '카카오톡' : 'KakaoTalk'}</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <RadioGroupItem value="gmail" id="recipient-gmail" />
                  <Label htmlFor="recipient-gmail" className="flex items-center gap-2 cursor-pointer text-[16px] flex-1">
                    <Mail size={20} className="text-red-500" />
                    <span>{language === 'ko' ? '구글 이메일' : 'Gmail'}</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <RadioGroupItem value="email" id="recipient-email" />
                  <Label htmlFor="recipient-email" className="flex items-center gap-2 cursor-pointer text-[16px] flex-1">
                    <Mail size={20} className="text-blue-500" />
                    <span>{language === 'ko' ? '이메일' : 'Email'}</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 py-3 px-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100">
                  <RadioGroupItem value="phone" id="recipient-phone" />
                  <Label htmlFor="recipient-phone" className="flex items-center gap-2 cursor-pointer text-[16px] flex-1">
                    <Phone size={20} className="text-green-500" />
                    <span>{language === 'ko' ? '전화번호' : 'Phone Number'}</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Email Input - shown for email/gmail methods */}
            {(inviteMethod === 'email' || inviteMethod === 'gmail') && (
              <div className="space-y-2">
                <Label htmlFor="recipientEmail" className="text-[16px]">
                  {language === 'ko' ? '이메일 주소' : 'Email Address'}
                </Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="recipient@email.com"
                  value={newRecipientEmail}
                  onChange={(e) => setNewRecipientEmail(e.target.value)}
                  className="text-[16px]"
                />
              </div>
            )}

            {/* Phone Input - shown for phone method */}
            {inviteMethod === 'phone' && (
              <div className="space-y-2">
                <Label htmlFor="recipientPhone" className="text-[16px]">
                  {language === 'ko' ? '전화번호' : 'Phone Number'}
                </Label>
                <Input
                  id="recipientPhone"
                  type="tel"
                  placeholder={language === 'ko' ? '010-1234-5678' : '010-1234-5678'}
                  value={newRecipientPhone}
                  onChange={(e) => setNewRecipientPhone(e.target.value)}
                  className="text-[16px]"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="recipientRelation" className="text-[16px]">
                {language === 'ko' ? '관계' : 'Relationship'}
              </Label>
              <Input
                id="recipientRelation"
                placeholder={language === 'ko' ? '예: 어머니' : 'e.g., Mother'}
                value={newRecipientRelation}
                onChange={(e) => setNewRecipientRelation(e.target.value)}
                className="text-[16px]"
              />
            </div>
            <div className="space-y-2 pt-2">
              <Label className="text-[16px]">
                {language === 'ko' ? '요청 권한' : 'Requested Permissions'}
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
                    id="shareRecords"
                    checked={shareRecords}
                    onCheckedChange={setShareRecords}
                  />
                </div>

                {/* Missed Dose Alert Toggle */}
                <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Bell size={20} className="text-amber-600 mt-1" />
                    <div>
                      <div className="text-[16px]">
                        {language === 'ko' ? '미복용 알림 공유' : 'Share missed alerts'}
                      </div>
                      <div className="text-[14px] text-gray-500">
                        {language === 'ko' ? '알림 보내기 알림' : 'Send alert notifications'}
                      </div>
                    </div>
                  </div>
                  <Switch
                    id="shareMissedAlerts"
                    checked={shareMissedAlerts}
                    onCheckedChange={setShareMissedAlerts}
                  />
                </div>
              </div>
            </div>
          </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddRecipientDialog(false)}
              className="flex-1 text-[16px]"
            >
              {language === 'ko' ? '취소' : 'Cancel'}
            </Button>
            <Button
              onClick={handleInviteGuardian}
              className="flex-1 gradient-primary text-white text-[16px]"
            >
              {language === 'ko' ? '초대 보내기' : 'Send Invitation'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pro Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {language === 'ko' ? '프리미엄으로 업그레이드' : 'Upgrade to Premium'}
            </DialogTitle>
            <DialogDescription>
              {language === 'ko' 
                ? '더 많은 보호 대상자를 추가하려면 프리미엄이 필요합니다'
                : 'Premium required to add more care recipients'}
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4 py-4">
            {/* Premium Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Crown className="text-white" size={40} />
              </div>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-[24px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {language === 'ko' ? '프리미엄으로 업그레이드' : 'Upgrade to Premium'}
              </h2>
              <p className="text-[16px] text-gray-600 mt-2">
                {language === 'ko' 
                  ? '더 많은 보호 대상자를 추가하려면 프리미엄이 필요합니다'
                  : 'Premium required to add more care recipients'}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 text-left bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="text-white" size={14} />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-gray-800">
                    {language === 'ko' ? '무제한 보호 대상자' : 'Unlimited Care Recipients'}
                  </p>
                  <p className="text-[14px] text-gray-600">
                    {language === 'ko' 
                      ? '가족 모두의 약 관리를 한 곳에서'
                      : 'Manage medications for your entire family'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl p-4 border-2 border-amber-200">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-[14px] text-gray-500 line-through">
                  {language === 'ko' ? '₩9,900' : '$9.99'}
                </span>
                <span className="text-[32px] font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {language === 'ko' ? '₩4,900' : '$4.99'}
                </span>
                <span className="text-[16px] text-gray-600">
                  {language === 'ko' ? '/월' : '/month'}
                </span>
              </div>
              <p className="text-[14px] text-amber-600 font-semibold mt-1">
                {language === 'ko' ? '50% 할인 중!' : '50% OFF Limited Time!'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={() => {
                  toast.success(
                    language === 'ko' 
                      ? '프리미엄 구독이 곧 제공될 예정입니다!' 
                      : 'Premium subscription coming soon!'
                  );
                  setShowUpgradeDialog(false);
                }}
                className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg text-[18px] font-semibold"
              >
                <Crown className="mr-2" size={20} />
                {language === 'ko' ? '프리미엄 시작하기' : 'Start Premium'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowUpgradeDialog(false)}
                className="w-full text-[16px] text-gray-600"
              >
                {language === 'ko' ? '나중에' : 'Maybe Later'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
