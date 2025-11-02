import React from 'react';
import { motion } from 'motion/react';

interface ScheduleDateSelectorProps {
  days: string[];
  currentDayIndex: number;
  currentWeek: number;
  selectedDateIndex: number;
  formatDate: (dayIndex: number) => number;
  hasMissedDose: (dayIndex: number) => boolean;
  onDateSelect: (index: number) => void;
  language: 'ko' | 'en';
}

export function ScheduleDateSelector({
  days,
  currentDayIndex,
  currentWeek,
  selectedDateIndex,
  formatDate,
  hasMissedDose,
  onDateSelect,
  language
}: ScheduleDateSelectorProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        const dateNum = formatDate(index);
        const isToday = index === currentDayIndex && currentWeek === 0;
        const isSelected = index === selectedDateIndex;
        const hasMissed = hasMissedDose(index);
        
        return (
          <motion.button
            key={`${day}-${index}-week${currentWeek}`}
            onClick={() => onDateSelect(index)}
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
              isSelected
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md'
                : isToday
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className={`text-[10px] mb-1 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
              {language === 'ko' ? day.substring(0, 1) : day.substring(0, 3)}
            </span>
            <span className={`text-[16px] font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
              {dateNum}
            </span>
            {isToday && !isSelected && (
              <div className="w-1 h-1 bg-amber-500 rounded-full mt-1"></div>
            )}
            {hasMissed && (
              <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 rounded-full border border-white shadow-md animate-pulse"></div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
