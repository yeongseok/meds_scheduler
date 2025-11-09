import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface ScheduleWeekNavigatorProps {
  currentWeekMonthYear: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  language: 'ko' | 'en';
}

export function ScheduleWeekNavigator({
  currentWeekMonthYear,
  onPreviousWeek,
  onNextWeek,
  onToday,
  language
}: ScheduleWeekNavigatorProps) {
  return (
    <div className="flex items-center justify-between mb-3 gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousWeek}
        className="h-8 px-2 border-brand-primary hover:bg-brand-surface hover:border-brand-accent"
      >
        <ChevronLeft size={18} className="text-brand-accent" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToday}
        className="h-8 text-[18px] font-semibold text-brand-accent hover:bg-brand-surface hover:text-gray-800"
      >
        {currentWeekMonthYear}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNextWeek}
        className="h-8 px-2 border-brand-primary hover:bg-brand-surface hover:border-brand-accent"
      >
        <ChevronRight size={18} className="text-brand-accent" />
      </Button>
    </div>
  );
}
