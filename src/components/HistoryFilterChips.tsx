import React from 'react';
import { Button } from './ui/button';

interface Medicine {
  status: string;
}

interface HistoryFilterChipsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  medicines: Medicine[];
  language: 'ko' | 'en';
}

export function HistoryFilterChips({ selectedFilter, onFilterChange, medicines, language }: HistoryFilterChipsProps) {
  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      <Button
        variant={selectedFilter === 'all' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('all')}
        className={selectedFilter === 'all' ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-[16px]' : 'bg-white border-gray-200 text-[16px]'}
      >
        {language === 'ko' ? '전체' : 'All'} ({medicines.length})
      </Button>
      <Button
        variant={selectedFilter === 'active' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('active')}
        className={selectedFilter === 'active' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-[16px]' : 'bg-white border-gray-200 text-[16px]'}
      >
        {language === 'ko' ? '복용 중' : 'Active'} ({medicines.filter(m => m.status === 'active').length})
      </Button>
      <Button
        variant={selectedFilter === 'completed' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('completed')}
        className={selectedFilter === 'completed' ? 'bg-gradient-to-r from-stone-400 to-amber-400 text-[16px]' : 'bg-white border-gray-200 text-[16px]'}
      >
        {language === 'ko' ? '완료됨' : 'Completed'} ({medicines.filter(m => m.status === 'completed').length})
      </Button>
    </div>
  );
}
