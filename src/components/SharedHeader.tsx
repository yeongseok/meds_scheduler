import React, { useState } from 'react';
import { Settings, Plus, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
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
}

export function SharedHeader({ 
  selectedView, 
  setSelectedView, 
  careRecipients, 
  setCareRecipients,
  onNavigateToSettings,
  showMe = true
}: SharedHeaderProps) {
  const { t, language } = useLanguage();
  const [showAddRecipientDialog, setShowAddRecipientDialog] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newRecipientRelation, setNewRecipientRelation] = useState('');
  const [shareRecords, setShareRecords] = useState(true);
  const [shareMissedAlerts, setShareMissedAlerts] = useState(true);

  // Function to invite a guardian
  const handleInviteGuardian = () => {
    if (!newRecipientName.trim() || !newRecipientEmail.trim() || !newRecipientRelation.trim()) {
      toast.error(language === 'ko' ? '모든 필드를 입력해주세요' : 'Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipientEmail)) {
      toast.error(language === 'ko' ? '유효한 이메일 주소를 입력해주세요' : 'Please enter a valid email address');
      return;
    }

    // In a real app, this would send an invitation via email/SMS
    toast.success(
      language === 'ko' 
        ? `${newRecipientEmail}로 보호자 초대를 보냈습니다` 
        : `Guardian invitation sent to ${newRecipientEmail}`
    );
    
    // Reset form
    setNewRecipientName('');
    setNewRecipientEmail('');
    setNewRecipientRelation('');
    setShareRecords(true);
    setShareMissedAlerts(true);
    setShowAddRecipientDialog(false);
  };

  return (
    <>
      {/* Floating Island Header */}
      <div className="p-4 flex-shrink-0">
        <div className="gradient-primary rounded-3xl shadow-lg text-white relative overflow-hidden px-5 py-4">
          {/* Top Row: Date and Settings */}
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
              onClick={() => setShowAddRecipientDialog(true)}
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
        <DialogContent className="max-w-[90%] rounded-2xl">
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
            <div className="space-y-2">
              <Label htmlFor="recipientEmail" className="text-[16px]">
                {language === 'ko' ? '이메일' : 'Email'}
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder={language === 'ko' ? '예: mom@example.com' : 'e.g., mom@example.com'}
                value={newRecipientEmail}
                onChange={(e) => setNewRecipientEmail(e.target.value)}
                className="text-[16px]"
              />
            </div>
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
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="shareRecords" className="text-[16px]">
                  {language === 'ko' ? '복용 기록 공유' : 'Share medication records'}
                </Label>
                <Switch
                  id="shareRecords"
                  checked={shareRecords}
                  onCheckedChange={setShareRecords}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="shareMissedAlerts" className="text-[16px]">
                  {language === 'ko' ? '미복용 알림 공유' : 'Share missed alerts'}
                </Label>
                <Switch
                  id="shareMissedAlerts"
                  checked={shareMissedAlerts}
                  onCheckedChange={setShareMissedAlerts}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
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
    </>
  );
}
