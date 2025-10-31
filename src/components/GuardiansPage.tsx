import React, { useState } from 'react';
import { UserPlus, Shield, Users, Mail, Check, X, Eye, Share2, Bell } from 'lucide-react';
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
import { toast } from 'sonner@2.0.3';

export function GuardiansPage() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRelationship, setInviteRelationship] = useState('');
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
      relationship: '딸',
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
      relationship: '의사',
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
      relationship: '아버지',
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
      relationship: '딸',
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
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold">케어 서클</h1>
            <p className="text-amber-100 text-[18px]">다른 이들을 함께 관유하세요</p>
          </div>
          <Shield className="text-white/80" size={32} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Info Card */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Share2 className="text-amber-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1 text-[18px]">케어 서클이란?</h3>
              <p className="text-sm text-gray-600 text-[16px]">
                가족, 간병인 또는 의료 제공자를 초대하여 복약 일정과 기록을 확인할 수 있습니다. 복용을 놓쳤을 때 업데이트를 받게 됩니다.
              </p>
            </div>
          </div>
        </Card>

        {/* Invite Guardian Button */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white shadow-md text-[18px]">
              <UserPlus size={20} className="mr-2" />
              케어 서클에 초대
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-800 text-[18px]">보호자 초대</DialogTitle>
              <DialogDescription className="text-gray-600 text-[16px]">
                가족, 간병인 또는 의료 제공자를 케어 서클에 초대하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="guardianName" className="text-gray-700 text-[16px]">이름</Label>
                <Input
                  id="guardianName"
                  placeholder="보호자 이름 입력"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="guardianEmail" className="text-gray-700 text-[16px]">이메일 주소</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  placeholder="guardian@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="relationship" className="text-gray-700 text-[16px]">관계</Label>
                <Select value={inviteRelationship} onValueChange={setInviteRelationship}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="관계 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">배우자</SelectItem>
                    <SelectItem value="partner">파트너</SelectItem>
                    <SelectItem value="daughter">딸</SelectItem>
                    <SelectItem value="son">아들</SelectItem>
                    <SelectItem value="mother">어머니</SelectItem>
                    <SelectItem value="father">아버지</SelectItem>
                    <SelectItem value="sibling">형제자매</SelectItem>
                    <SelectItem value="caregiver">간병인</SelectItem>
                    <SelectItem value="nurse">간호사</SelectItem>
                    <SelectItem value="doctor">의사</SelectItem>
                    <SelectItem value="friend">친구</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-gray-800 text-[16px]">공유 권한</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-700 text-[16px]">기록 공유</p>
                      <p className="text-xs text-gray-500 text-[14px]">과거 복약 기록</p>
                    </div>
                  </div>
                  <Switch checked={shareHistory} onCheckedChange={setShareHistory} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="text-gray-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-700 text-[16px]">미복용 알림</p>
                      <p className="text-xs text-gray-500 text-[14px]">기한 초과 약 알림</p>
                    </div>
                  </div>
                  <Switch checked={shareReminders} onCheckedChange={setShareReminders} />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 text-[16px]"
                  onClick={() => setInviteDialogOpen(false)}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-[16px]"
                  onClick={() => {
                    // Validation
                    if (!inviteName.trim()) {
                      toast.error('이름을 입력해주세요');
                      return;
                    }
                    if (!inviteEmail.trim()) {
                      toast.error('이메일 주소를 입력해주세요');
                      return;
                    }
                    if (!inviteRelationship) {
                      toast.error('관계를 선택해주세요');
                      return;
                    }

                    // Send invite logic here
                    console.log('Sending invite:', {
                      name: inviteName,
                      email: inviteEmail,
                      relationship: inviteRelationship,
                      canViewHistory: shareHistory,
                      canGetNotifications: shareReminders
                    });
                    
                    // Show success toast
                    toast.success(`${inviteName}님에게 초대를 보냈습니다! 📧`);
                    
                    setInviteDialogOpen(false);
                    setInviteEmail('');
                    setInviteName('');
                    setInviteRelationship('');
                  }}
                >
                  초대 보내기
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Received Invitations */}
        {receivedInvitations.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="text-amber-600" size={20} />
              <h2 className="font-semibold text-gray-800 text-[18px]">받은 초대</h2>
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
                          <span className="font-medium text-gray-800">{invite.fromName}</span>님이 케어 서클에 초대하고 싶어합니다
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {invite.canViewHistory && (
                            <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded text-[14px]">
                              <Eye size={12} className="mr-1" />
                              기록 확인
                            </span>
                          )}
                          {invite.canGetNotifications && (
                            <span className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded text-[14px]">
                              <Bell size={12} className="mr-1" />
                              진행알림
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
                          수락
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
                          거절
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 mt-2 text-[14px]">받은 날짜: {invite.receivedDate}</p>
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
            <h2 className="font-semibold text-gray-800 text-[18px]">활성 보호자</h2>
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
                        활성
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="bg-gray-100 py-1 rounded text-[16px] px-[15px] px-[7px] py-[3px]">{guardian.relationship}</span>
                      <span className="text-[14px]">추가됨 {guardian.addedDate}</span>
                    </div>

                    <div className="flex items-center space-x-3 mt-3 text-xs">
                      {guardian.canViewHistory && (
                        <span className="flex items-center text-amber-600 text-[14px]">
                          <Eye size={12} className="mr-1" />
                          기록 확인
                        </span>
                      )}
                      {guardian.canGetNotifications && (
                        <span className="flex items-center text-orange-600 text-[14px]">
                          <Bell size={12} className="mr-1" />
                          알림
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
                        권한 편집
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
                        제거
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
              <h2 className="font-semibold text-gray-800 text-[18px]">대기 중인 초대</h2>
              <Badge className="bg-amber-100 text-amber-700 text-[14px]">{pendingInvites.length}</Badge>
            </div>

            <div className="space-y-3">
              {pendingInvites.map((invite) => (
                <Card key={invite.id} className="p-4 bg-white border-0 shadow-sm border-l-4 border-l-amber-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <Mail className="text-amber-600" size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-[16px]">{invite.email}</p>
                        <p className="text-xs text-gray-500 text-[14px]">보낸 날짜 {invite.sentDate}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8 text-orange-600 text-[14px]"
                        onClick={() => {
                          setSelectedInvite({ id: invite.id, email: invite.email });
                          setResendDialogOpen(true);
                        }}
                      >
                        재전송
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
                        취소
                      </Button>
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
              <p className="text-sm text-amber-900 font-medium mb-1 text-[16px]">개인정보가 중요합니다</p>
              <p className="text-xs text-amber-700 text-[14px]">
                보호자가 볼 수 있는 내용을 제어할 수 있습니다. 언제든지 권한을 변경하거나 액세스를 제거할 수 있습니다.
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
            <DialogTitle className="text-gray-800 text-[18px]">권한 편집</DialogTitle>
            <DialogDescription className="text-gray-600 text-[16px]">
              {editingGuardian?.name}님이 케어 서클에서 액세스할 수 있는 항목을 관리하세요.
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
                <Label htmlFor="editRelationship" className="text-gray-700 text-[16px]">관계</Label>
                <Select value={editRelationship} onValueChange={setEditRelationship}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="관계 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">배우자</SelectItem>
                    <SelectItem value="partner">파트너</SelectItem>
                    <SelectItem value="daughter">딸</SelectItem>
                    <SelectItem value="son">아들</SelectItem>
                    <SelectItem value="mother">어머니</SelectItem>
                    <SelectItem value="father">아버지</SelectItem>
                    <SelectItem value="sibling">형제자매</SelectItem>
                    <SelectItem value="caregiver">간병인</SelectItem>
                    <SelectItem value="nurse">간호사</SelectItem>
                    <SelectItem value="doctor">의사</SelectItem>
                    <SelectItem value="friend">친구</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <h4 className="font-medium text-gray-800 text-[16px]">액세스 권한</h4>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Eye className="text-amber-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 text-[16px]">기록 공유</p>
                    <p className="text-xs text-gray-500 text-[14px]">과거 복약 기록 확인</p>
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
                    <p className="text-sm font-medium text-gray-700 text-[16px]">미복용 알림</p>
                    <p className="text-xs text-gray-500 text-[14px]">기한 초과 시 알림 받기</p>
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
                취소
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
                변경사항 저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Guardian Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">보호자를 제거하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              <span className="font-semibold text-gray-800">{selectedGuardian?.name}</span>님을 케어 서클에서 제거하시겠습니까? 더 이상 복약 정보에 액세스할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">취소</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white text-[16px]"
              onClick={() => {
                // Remove guardian logic here
                console.log('Removing guardian:', selectedGuardian?.id);
                setRemoveDialogOpen(false);
                setSelectedGuardian(null);
              }}
            >
              제거
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resend Invite Confirmation Dialog */}
      <AlertDialog open={resendDialogOpen} onOpenChange={setResendDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">초대를 재전송하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              <span className="font-semibold text-gray-800">{selectedInvite?.email}</span>로 다시 초대 이메일을 보내시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">취소</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-orange-500 hover:bg-orange-600 text-white text-[16px]"
              onClick={() => {
                // Resend invite logic here
                console.log('Resending invite to:', selectedInvite?.email);
                
                // Show success toast
                toast.success(`${selectedInvite?.email}로 초대를 재전송했습니다! 📧`);
                
                setResendDialogOpen(false);
                setSelectedInvite(null);
              }}
            >
              재전송
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Invite Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">초대를 취소하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              <span className="font-semibold text-gray-800">{selectedInvite?.email}</span>로의 초대를 취소하시겠습니까? 이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">돌아가기</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white text-[16px]"
              onClick={() => {
                // Cancel invite logic here
                console.log('Canceling invite:', selectedInvite?.id);
                setCancelDialogOpen(false);
                setSelectedInvite(null);
              }}
            >
              초대 취소
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Accept Invitation Confirmation Dialog */}
      <AlertDialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">초대를 수락하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              <span className="font-semibold text-gray-800">{selectedReceivedInvite?.fromName}</span>님의 보호자가 되며, 부여된 권한에 따라 복약 정보를 확인할 수 있습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accept-relationship" className="text-gray-700 text-[16px]">
                나의 관계 <span className="text-red-500">*</span>
              </Label>
              <Select value={acceptRelationship} onValueChange={setAcceptRelationship}>
                <SelectTrigger id="accept-relationship" className="bg-white">
                  <SelectValue placeholder="관계 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="spouse">배우자</SelectItem>
                  <SelectItem value="partner">파트너</SelectItem>
                  <SelectItem value="parent">부모</SelectItem>
                  <SelectItem value="child">자녀</SelectItem>
                  <SelectItem value="sibling">형제자매</SelectItem>
                  <SelectItem value="relative">기타 친척</SelectItem>
                  <SelectItem value="friend">친구</SelectItem>
                  <SelectItem value="caregiver">간병인</SelectItem>
                  <SelectItem value="nurse">간호사</SelectItem>
                  <SelectItem value="doctor">의사</SelectItem>
                  <SelectItem value="pharmacist">약사</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]" onClick={() => setAcceptRelationship('')}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-[16px]"
              disabled={!acceptRelationship}
              onClick={() => {
                if (acceptRelationship) {
                  // Accept invitation logic here
                  console.log('Accepting invitation from:', selectedReceivedInvite?.id, 'as relationship:', acceptRelationship);
                  
                  // Show success toast
                  toast.success(`${selectedReceivedInvite?.fromName}님의 보호자가 되었습니다! 🤝`);
                  
                  setAcceptDialogOpen(false);
                  setSelectedReceivedInvite(null);
                  setAcceptRelationship('');
                }
              }}
            >
              수락
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Invitation Confirmation Dialog */}
      <AlertDialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 text-[18px]">초대를 거절하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-[16px]">
              <span className="font-semibold text-gray-800">{selectedReceivedInvite?.fromName}</span>님의 초대를 거절하시겠습니까? 상대방에게 알림이 가지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-[16px]">돌아가기</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white text-[16px]"
              onClick={() => {
                // Decline invitation logic here
                console.log('Declining invitation from:', selectedReceivedInvite?.id);
                
                // Show toast
                toast(`${selectedReceivedInvite?.fromName}님의 초대를 거절했습니다`);
                
                setDeclineDialogOpen(false);
                setSelectedReceivedInvite(null);
              }}
            >
              거절
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
