import React from 'react';
import { Mail } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface PendingInvite {
  id: string;
  email: string;
  sentDate: string;
  status: string;
}

interface PendingInviteCardProps {
  invite: PendingInvite;
  language: 'ko' | 'en';
  onResend: () => void;
  onCancel: () => void;
}

export function PendingInviteCard({ invite, language, onResend, onCancel }: PendingInviteCardProps) {
  return (
    <Card className="p-4 bg-white border-0 shadow-sm border-l-4 border-l-brand-accent">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center flex-shrink-0">
          <Mail className="text-brand-accent" size={18} />
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
              className="text-xs h-8 text-brand-accent text-[14px]"
              onClick={onResend}
            >
              {language === 'ko' ? '재전송' : 'Resend'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 text-red-600 text-[14px]"
              onClick={onCancel}
            >
              {language === 'ko' ? '취소' : 'Cancel'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
