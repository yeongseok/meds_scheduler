import React, { useState } from 'react';
import { Users, Mail, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Activity, Bell, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useLanguage } from './LanguageContext';
import { GuardianInfoCard } from './GuardianInfoCard';
import { PrivacyNoteCard } from './PrivacyNoteCard';
import { InviteGuardianButton } from './InviteGuardianButton';
import { ReceivedInvitationCard } from './ReceivedInvitationCard';
import { ActiveGuardianCard } from './ActiveGuardianCard';
import { PendingInviteCard } from './PendingInviteCard';
import { GuardianSectionHeader } from './GuardianSectionHeader';

export function GuardiansPage() {
  const { language } = useLanguage();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  
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

  // Alert dialog states for received invitations
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [selectedReceivedInvite, setSelectedReceivedInvite] = useState<{id: string, fromName: string} | null>(null);
  const [acceptRelationship, setAcceptRelationship] = useState('');

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

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header - Info Card */}
      <div className="p-4 flex-shrink-0">
        <GuardianInfoCard language={language} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">

        {/* Invite Guardian Button */}
        <InviteGuardianButton language={language} />

        {/* Received Invitations */}
        {receivedInvitations.length > 0 && (
          <div>
            <GuardianSectionHeader
              icon={Mail}
              iconColor="text-amber-600"
              title={language === 'ko' ? '받은 초대' : 'Received Invitations'}
              count={receivedInvitations.length}
              badgeColor="bg-amber-100 text-amber-700"
            />

            <div className="space-y-3">
              {receivedInvitations.map((invite) => (
                <ReceivedInvitationCard
                  key={invite.id}
                  invite={invite}
                  language={language}
                  onAccept={() => {
                    // Check if user already has 1 or more guardians in their care circle
                    if (guardians.length >= 1) {
                      setShowUpgradeDialog(true);
                    } else {
                      setSelectedReceivedInvite({ id: invite.id, fromName: invite.fromName });
                      setAcceptDialogOpen(true);
                    }
                  }}
                  onDecline={() => {
                    setSelectedReceivedInvite({ id: invite.id, fromName: invite.fromName });
                    setDeclineDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Guardians */}
        <div>
          <GuardianSectionHeader
            icon={Users}
            iconColor="text-orange-600"
            title={language === 'ko' ? '활성 보호자' : 'Active Guardians'}
            count={guardians.length}
            badgeColor="bg-orange-100 text-orange-700"
          />

          <div className="space-y-3">
            {guardians.map((guardian) => (
              <ActiveGuardianCard
                key={guardian.id}
                guardian={guardian}
                language={language}
                onEditPermissions={() => {
                  setEditingGuardian(guardian);
                  setEditCanViewHistory(guardian.canViewHistory);
                  setEditCanGetNotifications(guardian.canGetNotifications);
                  setEditRelationship(guardian.relationship.toLowerCase());
                  setEditPermissionsOpen(true);
                }}
                onRemove={() => {
                  setSelectedGuardian({ id: guardian.id, name: guardian.name });
                  setRemoveDialogOpen(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <div>
            <GuardianSectionHeader
              icon={Mail}
              iconColor="text-amber-600"
              title={language === 'ko' ? '대기 중인 초대' : 'Pending Invites'}
              count={pendingInvites.length}
              badgeColor="bg-amber-100 text-amber-700"
            />

            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <PendingInviteCard
                  key={invite.id}
                  invite={invite}
                  language={language}
                  onResend={() => {
                    setSelectedInvite({ id: invite.id, email: invite.email });
                    setResendDialogOpen(true);
                  }}
                  onCancel={() => {
                    setSelectedInvite({ id: invite.id, email: invite.email });
                    setCancelDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <PrivacyNoteCard language={language} />

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

            <div className="space-y-2">
              <Label className="text-[16px]">
                {language === 'ko' ? '관계' : 'Relationship'}
              </Label>
              <Select value={editRelationship} onValueChange={setEditRelationship}>
                <SelectTrigger className="bg-white text-[16px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="daughter">{language === 'ko' ? '딸' : 'Daughter'}</SelectItem>
                  <SelectItem value="son">{language === 'ko' ? '아들' : 'Son'}</SelectItem>
                  <SelectItem value="spouse">{language === 'ko' ? '배우자' : 'Spouse'}</SelectItem>
                  <SelectItem value="sibling">{language === 'ko' ? '형제/자매' : 'Sibling'}</SelectItem>
                  <SelectItem value="grandchild">{language === 'ko' ? '손자/손녀' : 'Grandchild'}</SelectItem>
                  <SelectItem value="friend">{language === 'ko' ? '친구' : 'Friend'}</SelectItem>
                  <SelectItem value="doctor">{language === 'ko' ? '의사' : 'Doctor'}</SelectItem>
                  <SelectItem value="other">{language === 'ko' ? '기타' : 'Other'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[16px]">
                {language === 'ko' ? '권한' : 'Permissions'}
              </Label>
              
              <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start gap-3">
                  <Activity size={20} className="text-amber-600 mt-1" />
                  <div>
                    <div className="text-[16px]">
                      {language === 'ko' ? '복용 기록 확인' : 'View History'}
                    </div>
                    <div className="text-[14px] text-gray-500">
                      {language === 'ko' ? '과거 복약 기록 접근' : 'Access past medication records'}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={editCanViewHistory}
                  onCheckedChange={setEditCanViewHistory}
                />
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start gap-3">
                  <Bell size={20} className="text-amber-600 mt-1" />
                  <div>
                    <div className="text-[16px]">
                      {language === 'ko' ? '미복용 알림' : 'Missed Dose Alerts'}
                    </div>
                    <div className="text-[14px] text-gray-500">
                      {language === 'ko' ? '알림 보내기 알림' : 'Receive alert notifications'}
                    </div>
                  </div>
                </div>
                <Switch
                  checked={editCanGetNotifications}
                  onCheckedChange={setEditCanGetNotifications}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setEditPermissionsOpen(false)}
              className="flex-1 text-[16px]"
            >
              {language === 'ko' ? '취소' : 'Cancel'}
            </Button>
            <Button
              onClick={() => {
                toast.success(language === 'ko' ? '권한이 업데이트되었습니다! ✓' : 'Permissions updated! ✓');
                setEditPermissionsOpen(false);
              }}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-[16px]"
            >
              {language === 'ko' ? '저장' : 'Save'}
            </Button>
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
                  <span className="font-semibold text-gray-800">{selectedGuardian?.name}</span>님이 더 이상 귀하의 복약 정보에 액세스할 수 없습니다.
                </>
              ) : (
                <>
                  <span className="font-semibold text-gray-800">{selectedGuardian?.name}</span> will no longer have access to your medication information.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white text-[16px]"
              onClick={() => {
                toast.success(language === 'ko' ? `${selectedGuardian?.name}님이 제거되었습니다` : `${selectedGuardian?.name} has been removed`);
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
                  <span className="font-semibold text-gray-800">{selectedInvite?.email}</span>님에게 보낸 대기 중인 초대가 취소됩니다.
                </>
              ) : (
                <>
                  The pending invitation to <span className="font-semibold text-gray-800">{selectedInvite?.email}</span> will be canceled.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">
              {language === 'ko' ? '돌아가기' : 'Go Back'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white text-[16px]"
              onClick={() => {
                toast.success(language === 'ko' ? '초대가 취소되었습니다' : 'Invitation canceled');
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-green-500 hover:bg-green-600 text-white text-[16px]"
              onClick={() => {
                if (!acceptRelationship) {
                  toast.error(language === 'ko' ? '관계를 선택해주세요' : 'Please select your relationship');
                  return;
                }
                
                toast.success(language === 'ko' 
                  ? `${selectedReceivedInvite?.fromName}님의 케어 서클에 참여했습니다! 🎉`
                  : `You joined ${selectedReceivedInvite?.fromName}'s Care Circle! 🎉`);
                
                setAcceptDialogOpen(false);
                setSelectedReceivedInvite(null);
                setAcceptRelationship('');
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
                  <span className="font-semibold text-gray-800">{selectedReceivedInvite?.fromName}</span>님의 케어 서클 초대를 거절합니다.
                </>
              ) : (
                <>
                  You are declining <span className="font-semibold text-gray-800">{selectedReceivedInvite?.fromName}</span>'s Care Circle invitation.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">
              {language === 'ko' ? '취소' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600 text-white text-[16px]"
              onClick={() => {
                toast.success(language === 'ko' ? '초대가 거절되었습니다' : 'Invitation declined');
                setDeclineDialogOpen(false);
                setSelectedReceivedInvite(null);
              }}
            >
              {language === 'ko' ? '거절' : 'Decline'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-white max-w-md rounded-3xl">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Crown className="text-white" size={32} />
            </div>
            <DialogTitle className="text-center text-[20px]">
              {language === 'ko' ? '프리미엄으로 업그레이드' : 'Upgrade to Premium'}
            </DialogTitle>
            <DialogDescription className="text-center text-[16px]">
              {language === 'ko' 
                ? '무제한으로 보호 대상자와 케어 서클 멤버를 추가하려면 프리미엄으로 업그레이드하세요'
                : 'Upgrade to Premium to add unlimited care recipients and Care Circle members'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border-2 border-amber-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye size={16} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-[16px]">
                    {language === 'ko' ? '무제한 보호 대상자/케어 서클' : 'Unlimited Care Recipients/Circle'}
                  </h4>
                  <p className="text-sm text-gray-600 text-[14px]">
                    {language === 'ko' 
                      ? '원하는 만큼 많은 사람을 추가하고 관리하세요'
                      : 'Add and manage as many people as you need'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-[16px] h-12"
              onClick={() => {
                toast.success(language === 'ko' ? '프리미엄 구독 페이지로 이동합니다' : 'Redirecting to premium subscription');
                setShowUpgradeDialog(false);
              }}
            >
              {language === 'ko' ? '프리미엄으로 업그레이드' : 'Upgrade to Premium'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-[16px] h-12"
              onClick={() => setShowUpgradeDialog(false)}
            >
              {language === 'ko' ? '나중에' : 'Maybe Later'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
