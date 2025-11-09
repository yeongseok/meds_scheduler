import React, { useState } from 'react';
import { UserPlus, MessageCircle, Mail, Phone, Activity, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { useAuth, sendInvitation } from '../lib';

interface InviteGuardianButtonProps {
  language: 'ko' | 'en';
}

export function InviteGuardianButton({ language }: InviteGuardianButtonProps) {
  const { user } = useAuth();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('');
  const [inviteMethod, setInviteMethod] = useState('email');
  const [invitePhone, setInvitePhone] = useState('');
  const [shareHistory, setShareHistory] = useState(true);
  const [shareReminders, setShareReminders] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const handleSendInvite = async () => {
    // Validation
    if (!inviteName.trim() || !inviteRelationship.trim()) {
      toast.error(language === 'ko' ? '모든 필드를 입력해주세요' : 'Please fill in all fields');
      return;
    }

    if (!user) {
      toast.error(language === 'ko' ? '로그인이 필요합니다' : 'Login required');
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

    setIsSending(true);

    try {
      // Send invitation to Firebase
      await sendInvitation({
        fromUserId: user.uid,
        fromUserName: user.displayName || 'User',
        fromUserEmail: user.email || '',
        toEmail: inviteEmail,
        relationship: inviteRelationship,
        status: 'pending',
        expiresAt: new Date() // Will be set by the function
      });

      // In a real app, this would send an invitation via the selected method
      const methodName = inviteMethod === 'kakaotalk' ? (language === 'ko' ? '카카오톡' : 'KakaoTalk')
        : inviteMethod === 'gmail' ? (language === 'ko' ? '지메일' : 'Gmail')
        : inviteMethod === 'email' ? (language === 'ko' ? '이메일' : 'Email')
        : (language === 'ko' ? '문자' : 'SMS');

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
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(
        language === 'ko'
          ? `초대 전송 실패: ${error.message}`
          : `Failed to send invitation: ${error.message}`
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-14 bg-brand-accent hover:bg-brand-accent/90 text-white shadow-md text-[18px]">
          <UserPlus size={20} className="mr-2" />
          {language === 'ko' ? '케어 서클에 초대' : 'Invite to Care Circle'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[20px]">
            {language === 'ko' ? '보호자 초대' : 'Invite Guardian'}
          </DialogTitle>
          <DialogDescription className="text-[14px] text-gray-600">
            {language === 'ko' 
              ? '가족, 간병인 또는 의료 제공자를 케어 서클에 초대하세요.'
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
                    <MessageCircle size={20} className="text-brand-accent" />
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
                    <Mail size={20} className="text-brand-accent" />
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
                    <Activity size={20} className="text-brand-accent mt-1" />
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
                    <Bell size={20} className="text-brand-accent mt-1" />
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
            disabled={isSending}
          >
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSendInvite}
            disabled={isSending}
            className="flex-1 bg-brand-accent hover:bg-brand-accent/90 text-[16px] disabled:opacity-50"
          >
            {isSending 
              ? (language === 'ko' ? '전송 중...' : 'Sending...')
              : (language === 'ko' ? '초대 보내기' : 'Send Invitation')
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
