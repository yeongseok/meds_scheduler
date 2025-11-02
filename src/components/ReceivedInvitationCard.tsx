import React from 'react';
import { Check, X, Eye, Bell } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ReceivedInvitation {
  id: string;
  fromName: string;
  fromEmail: string;
  relationship: string;
  canViewHistory: boolean;
  canGetNotifications: boolean;
  receivedDate: string;
  initials: string;
  color: string;
}

interface ReceivedInvitationCardProps {
  invite: ReceivedInvitation;
  language: 'ko' | 'en';
  onAccept: () => void;
  onDecline: () => void;
}

export function ReceivedInvitationCard({ invite, language, onAccept, onDecline }: ReceivedInvitationCardProps) {
  return (
    <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
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
              onClick={onAccept}
            >
              <Check size={16} className="mr-1" />
              {language === 'ko' ? '수락' : 'Accept'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-[16px]"
              onClick={onDecline}
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
  );
}
