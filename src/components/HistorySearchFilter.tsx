import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface HistorySearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  language: 'ko' | 'en';
}

export function HistorySearchFilter({ 
  searchQuery, 
  onSearchChange, 
  selectedFilter, 
  onFilterChange, 
  language 
}: HistorySearchFilterProps) {
  return (
    <div className="flex space-x-3 mb-4">
      <div className="flex-1 relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={language === 'ko' ? '약 검색...' : 'Search medications...'}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 bg-white"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white border-gray-200 hover:border-orange-400">
            <Filter size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onFilterChange('all')} className="text-[16px]">
            {language === 'ko' ? '모든 약' : 'All Medications'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('active')} className="text-[16px]">
            {language === 'ko' ? '복용 중만' : 'Active Only'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('completed')} className="text-[16px]">
            {language === 'ko' ? '완료됨' : 'Completed'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange('paused')} className="text-[16px]">
            {language === 'ko' ? '일시중지' : 'Paused'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
