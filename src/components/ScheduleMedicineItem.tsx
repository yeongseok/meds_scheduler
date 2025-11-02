import React from 'react';
import { Pill, Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { Badge } from './ui/badge';

interface Medicine {
  id: string;
  name: string;
  time: string;
  dosage: string;
  status: 'taken' | 'missed' | 'pending' | 'upcoming';
  period: 'morning' | 'afternoon' | 'evening' | 'night';
}

interface ScheduleMedicineItemProps {
  medicine: Medicine;
  index: number;
  language: 'ko' | 'en';
}

export function ScheduleMedicineItem({ medicine, index, language }: ScheduleMedicineItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return 'bg-amber-500';
      case 'missed':
        return 'bg-orange-500';
      case 'pending':
        return 'bg-amber-500 animate-pulse';
      case 'upcoming':
        return 'bg-stone-400';
      default:
        return 'bg-stone-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'taken':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs text-[14px]">✓ {language === 'ko' ? '완료' : 'Done'}</Badge>;
      case 'missed':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs text-[14px]">⚠️ {language === 'ko' ? '놓침' : 'Missed'}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs animate-pulse text-[14px]">🔔 {language === 'ko' ? '복용 시간' : 'Time to take'}</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-stone-600 border-stone-300 text-xs text-[14px]">⏰ {language === 'ko' ? '예정' : 'Upcoming'}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs text-[14px]">?</Badge>;
    }
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return <Sunrise size={14} className="text-amber-500" />;
      case 'afternoon':
        return <Sun size={14} className="text-orange-500" />;
      case 'evening':
        return <Sunset size={14} className="text-orange-600" />;
      case 'night':
        return <Moon size={14} className="text-stone-600" />;
      default:
        return <Clock size={14} className="text-stone-500" />;
    }
  };

  const getPeriodGradient = (period: string) => {
    switch (period) {
      case 'morning':
        return 'from-amber-50 to-orange-50';
      case 'afternoon':
        return 'from-orange-50 to-amber-50';
      case 'evening':
        return 'from-orange-50 to-stone-50';
      case 'night':
        return 'from-stone-50 to-amber-50';
      default:
        return 'from-stone-50 to-amber-50';
    }
  };

  return (
    <div 
      key={`${medicine.id}-${medicine.time}-${index}`} 
      className={`flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r ${getPeriodGradient(medicine.period)} border ${
        medicine.status === 'pending' 
          ? 'border-amber-300 ring-2 ring-amber-100' 
          : medicine.status === 'missed'
          ? 'border-orange-300'
          : 'border-transparent'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className={`w-10 h-10 ${getStatusColor(medicine.status)} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Pill className="text-white" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 text-[16px]">{medicine.name}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-600 text-[14px] mt-1">
            {getPeriodIcon(medicine.period)}
            <span>{medicine.time}</span>
            <span>•</span>
            <span>{medicine.dosage}</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        {getStatusBadge(medicine.status)}
      </div>
    </div>
  );
}
