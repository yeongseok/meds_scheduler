import React from 'react';
import { Pill, Calendar, Clock, Award, Target, MoreVertical } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  type: string;
  frequency: string;
  nextDose: string;
  status: string;
  color: string;
  bgColor: string;
  adherence: number;
  streak: number;
  totalDoses: number;
  takenDoses: number;
}

interface HistoryMedicineCardProps {
  medicine: Medicine;
  language: 'ko' | 'en';
  showActions?: boolean;
  onView: () => void;
  onDelete?: () => void;
}

export function HistoryMedicineCard({ medicine, language, showActions = true, onView, onDelete }: HistoryMedicineCardProps) {
  const getStatusBadge = (status: string, adherence: number) => {
    switch (status) {
      case 'active':
        if (adherence >= 90) {
          return <Badge className="bg-green-100 text-green-700 border-green-200">🟢 {language === 'ko' ? '훌륭함' : 'Excellent'}</Badge>;
        } else if (adherence >= 80) {
          return <Badge className="bg-brand-light text-brand-accent border-brand-primary">🟡 {language === 'ko' ? '좋음' : 'Good'}</Badge>;
        } else {
          return <Badge className="bg-red-100 text-red-700 border-red-200">🟠 {language === 'ko' ? '주의 필요' : 'Needs Attention'}</Badge>;
        }
      case 'completed':
        return <Badge className="bg-stone-100 text-stone-700 border-stone-200">✅ {language === 'ko' ? '완료됨' : 'Completed'}</Badge>;
      case 'paused':
        return <Badge className="bg-stone-100 text-stone-700 border-stone-200">⏸️ {language === 'ko' ? '일시중지' : 'Paused'}</Badge>;
      default:
        return <Badge variant="outline">{language === 'ko' ? '알 수 없음' : 'Unknown'}</Badge>;
    }
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 10) {
      return <Badge className="bg-brand-accent text-white border-brand-accent">🔥 {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    } else if (streak >= 5) {
      return <Badge className="bg-brand-primary text-gray-700 border-brand-primary">⭐ {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    } else if (streak > 0) {
      return <Badge className="bg-brand-surface text-gray-600 border-brand-secondary">✨ {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    }
    return null;
  };

  return (
    <Card className="medicine-card p-5 border-0 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between m-[0px]">
        <div className="flex items-start space-x-4 flex-1">
          {/* Medicine Icon */}
          <div className={`w-16 h-16 bg-gradient-to-r ${medicine.color} rounded-2xl flex items-center justify-center relative`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <ImageWithFallback
                src={(medicine as any).photo || (medicine as any).image || 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGwlMjB0YWJsZXR8ZW58MXx8fHwxNzYyMzM1MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'}
                alt={medicine.name}
                className="w-full h-full object-cover"
              />
            </div>
            {medicine.streak >= 10 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center">
                <Award size={12} className="text-white" />
              </div>
            )}
          </div>
          
          {/* Medicine Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1 text-[20px]">{medicine.name}</h3>
            <p className="text-sm text-gray-600 mb-2 text-[16px]">{medicine.dosage} • {medicine.type}</p>
            
            {/* Progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 text-[14px]">{language === 'ko' ? '진행도' : 'Progress'}</span>
                <span className="text-xs font-medium text-gray-700 text-[14px]">
                  {medicine.takenDoses}/{medicine.totalDoses}
                </span>
              </div>
              <Progress value={(medicine.takenDoses / medicine.totalDoses) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onView}
              className="text-brand-accent hover:text-brand-accent/80 hover:bg-brand-surface text-[16px]"
            >
              {language === 'ko' ? '보기' : 'View'}
            </Button>
            {onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className="text-destructive text-[16px]"
                    onClick={onDelete}
                  >
                    {language === 'ko' ? '삭제' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Adherence Visualization */}
      <div className="bg-gray-50 p-3 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target size={14} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700 text-[16px]">{language === 'ko' ? '순응도' : 'Adherence'}</span>
          </div>
          <span className="text-sm font-bold text-gray-800 text-[16px]">{medicine.adherence}%</span>
        </div>
        <Progress value={medicine.adherence} className="h-1 mt-2" />
      </div>
    </Card>
  );
}
