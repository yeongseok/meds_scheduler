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
            animate={isToday && !isSelected ? {
              borderColor: ['#3674B5', '#93C5FD', '#3674B5'],
            } : {}}
            transition={isToday && !isSelected ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            } : undefined}
            style={isToday && !isSelected ? { borderColor: '#3674B5' } : undefined}
            className={`relative flex flex-col items-center justify-center rounded-lg h-[60px] ${
              isSelected
                ? 'bg-brand-accent text-white shadow-md border-2 border-transparent p-2'
                : isToday
                ? 'bg-brand-surface text-brand-accent border-[3px] py-[6px] px-2'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent p-2'
            }`}
          >
            <span className={`text-[12px] mb-1 font-medium ${isSelected ? 'text-white' : 'text-gray-500'}`}>
              {language === 'ko' ? day.substring(0, 1) : day.substring(0, 3)}
            </span>
            <span className={`text-[20px] font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
              {dateNum}
            </span>
            {hasMissed && (
              <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 rounded-full border border-white shadow-md animate-pulse"></div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
