import React from 'react';
import { Check, Eye, Bell, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Guardian {
  id: string;
  name: string;
  email: string;
  relationship: string;
  status: string;
  canViewHistory: boolean;
  canGetNotifications: boolean;
  addedDate: string;
  initials: string;
  color: string;
}

interface ActiveGuardianCardProps {
  guardian: Guardian;
  language: 'ko' | 'en';
  onEditPermissions: () => void;
  onRemove: () => void;
}

export function ActiveGuardianCard({ guardian, language, onEditPermissions, onRemove }: ActiveGuardianCardProps) {
  return (
    <Card className="p-4 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
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
              onClick={onEditPermissions}
            >
              {language === 'ko' ? '권한 편집' : 'Edit Permissions'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 text-[14px]"
              onClick={onRemove}
            >
              <X size={14} className="mr-1" />
              {language === 'ko' ? '제거' : 'Remove'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
