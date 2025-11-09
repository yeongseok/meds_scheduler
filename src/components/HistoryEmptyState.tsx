import React from 'react';
import { Pill } from 'lucide-react';

interface HistoryEmptyStateProps {
  searchQuery: string;
  language: 'ko' | 'en';
}

export function HistoryEmptyState({ searchQuery, language }: HistoryEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
        <Pill size={32} className="text-gray-500" />
      </div>
      <h3 className="text-gray-700 mb-2 text-[20px]">{language === 'ko' ? '약을 찾을 수 없습니다' : 'No medications found'}</h3>
      <p className="text-gray-500 text-sm text-[16px]">
        {searchQuery 
          ? (language === 'ko' ? '검색어를 조정해 보세요' : 'Try adjusting your search')
          : (language === 'ko' ? '첫 번째 약을 추가하여 시작하세요' : 'Add your first medication to get started')}
      </p>
    </div>
  );
}
