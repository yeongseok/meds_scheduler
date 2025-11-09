import React from 'react';
import { Plus, Calendar, PillBottle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';

interface ScheduleEmptyStateProps {
  onAddMedicine?: () => void;
  isMyMeds?: boolean;
  personName?: string;
}

export function ScheduleEmptyState({ onAddMedicine, isMyMeds = true, personName }: ScheduleEmptyStateProps) {
  const { language } = useLanguage();

  return (
    <Card className="p-8 bg-brand-surface border-2 border-dashed border-brand-primary hover:border-brand-accent transition-colors">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center">
            <PillBottle size={36} className="text-brand-accent" strokeWidth={2} />
          </div>
          {/* Calendar icon overlay */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-brand-primary">
            <Calendar size={16} className="text-brand-accent" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="text-gray-800">
            {language === 'ko' 
              ? (isMyMeds ? '오늘 복용할 약이 없습니다' : `${personName}님의 복용할 약이 없습니다`)
              : (isMyMeds ? 'No medicines scheduled today' : `No medicines scheduled for ${personName}`)}
          </h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            {language === 'ko'
              ? (isMyMeds ? '약을 추가하여 건강한 복용 습관을 시작하세요' : '약을 추가하여 복용 일정을 관리하세요')
              : (isMyMeds ? 'Add your first medicine to start building healthy habits' : 'Add medicines to manage the schedule')}
          </p>
        </div>

        {/* Add Button - Only show for "My Meds" view */}
        {isMyMeds && onAddMedicine && (
          <Button
            onClick={onAddMedicine}
            className="bg-brand-accent hover:bg-brand-accent/80 text-white h-12 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus size={20} className="mr-2" />
            <span className="text-base">
              {language === 'ko' ? '약 추가하기' : 'Add Medicine'}
            </span>
          </Button>
        )}

        {/* Illustration */}
        <div className="flex justify-center space-x-3 mt-4 opacity-50">
          <div className="w-3 h-12 bg-brand-primary rounded-full"></div>
          <div className="w-3 h-16 bg-brand-secondary rounded-full"></div>
          <div className="w-3 h-10 bg-brand-accent rounded-full"></div>
          <div className="w-3 h-14 bg-brand-primary rounded-full"></div>
          <div className="w-3 h-12 bg-brand-secondary rounded-full"></div>
        </div>
      </div>
    </Card>
  );
}
