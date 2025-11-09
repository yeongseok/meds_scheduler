import React from 'react';
import { Shield } from 'lucide-react';
import { Card } from './ui/card';

interface PrivacyNoteCardProps {
  language: 'ko' | 'en';
}

export function PrivacyNoteCard({ language }: PrivacyNoteCardProps) {
  return (
    <Card className="p-4 bg-[#F0EBE3] border-[#F0EBE3]">
      <div className="flex items-start space-x-2">
        <Shield className="text-gray-700 flex-shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-sm text-gray-800 font-medium mb-1 text-[16px]">
            {language === 'ko' ? '개인정보가 중요합니다' : 'Your Privacy Matters'}
          </p>
          <p className="text-xs text-gray-700 text-[14px]">
            {language === 'ko' 
              ? '보호자가 볼 수 있는 내용을 제어할 수 있습니다. 언제든지 권한을 변경하거나 액세스를 제거할 수 있습니다.'
              : 'You control what guardians can see. You can change permissions or remove access at any time.'}
          </p>
        </div>
      </div>
    </Card>
  );
}
