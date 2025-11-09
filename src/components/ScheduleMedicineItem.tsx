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
        return 'bg-brand-accent';
      case 'missed':
        return 'bg-brand-primary';
      case 'pending':
        return 'bg-brand-accent animate-pulse';
      case 'upcoming':
        return 'bg-stone-400';
      default:
        return 'bg-stone-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'taken':
        return <Badge className="bg-brand-surface text-brand-accent border-brand-primary text-xs text-[14px]">✓ {language === 'ko' ? '완료' : 'Done'}</Badge>;
      case 'missed':
        return <Badge className="bg-brand-light text-brand-primary border-brand-primary text-xs text-[14px]">⚠️ {language === 'ko' ? '놓침' : 'Missed'}</Badge>;
      case 'pending':
        return <Badge className="bg-brand-surface text-brand-accent border-brand-primary text-xs animate-pulse text-[14px]">🔔 {language === 'ko' ? '복용 시간' : 'Time to take'}</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="text-stone-600 border-stone-300 text-xs text-[14px]">⏰ {language === 'ko' ? '예정' : 'Upcoming'}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs text-[14px]">?</Badge>;
    }
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return <Sunrise size={14} className="text-brand-accent" />;
      case 'afternoon':
        return <Sun size={14} className="text-brand-primary" />;
      case 'evening':
        return <Sunset size={14} className="text-brand-accent" />;
      case 'night':
        return <Moon size={14} className="text-stone-600" />;
      default:
        return <Clock size={14} className="text-stone-500" />;
    }
  };

  const getPeriodGradient = (period: string) => {
    switch (period) {
      case 'morning':
        return 'bg-brand-surface';
      case 'afternoon':
        return 'bg-brand-light';
      case 'evening':
        return 'bg-brand-surface';
      case 'night':
        return 'bg-gray-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div 
      key={`${medicine.id}-${medicine.time}-${index}`} 
      className={`flex items-center justify-between gap-3 p-3 rounded-lg ${getPeriodGradient(medicine.period)} border ${
        medicine.status === 'pending' 
          ? 'border-brand-primary ring-2 ring-brand-surface' 
          : medicine.status === 'missed'
          ? 'border-brand-primary'
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
