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
        className="h-8 px-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
      >
        <ChevronLeft size={18} className="text-amber-600" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onToday}
        className="h-8 text-[14px] font-semibold text-amber-700 hover:bg-amber-50 hover:text-amber-800"
      >
        {currentWeekMonthYear}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNextWeek}
        className="h-8 px-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
      >
        <ChevronRight size={18} className="text-amber-600" />
      </Button>
    </div>
  );
}
