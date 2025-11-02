import React from 'react';
import { Share2 } from 'lucide-react';
import { Card } from './ui/card';

interface GuardianInfoCardProps {
  language: 'ko' | 'en';
}

export function GuardianInfoCard({ language }: GuardianInfoCardProps) {
  return (
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
  );
}
