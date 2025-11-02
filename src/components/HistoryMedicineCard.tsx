import React from 'react';
import { Pill, Calendar, Clock, Award, Target, MoreVertical } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

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
          return <Badge className="bg-amber-100 text-amber-700 border-amber-200">🟢 {language === 'ko' ? '훌륭함' : 'Excellent'}</Badge>;
        } else if (adherence >= 80) {
          return <Badge className="bg-orange-100 text-orange-700 border-orange-200">🟡 {language === 'ko' ? '좋음' : 'Good'}</Badge>;
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
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">🔥 {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    } else if (streak >= 5) {
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">⭐ {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    } else if (streak > 0) {
      return <Badge className="bg-amber-50 text-amber-600 border-amber-200">✨ {streak}{language === 'ko' ? '일' : ' days'}</Badge>;
    }
    return null;
  };

  return (
    <Card className="medicine-card p-5 border-0 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between m-[0px]">
        <div className="flex items-start space-x-4 flex-1">
          {/* Medicine Icon */}
          <div className={`w-16 h-16 bg-gradient-to-r ${medicine.color} rounded-2xl flex items-center justify-center relative`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Pill size={16} className="text-gray-600" />
            </div>
            {medicine.streak >= 10 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
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
            
            {/* Schedule Info */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <div className="flex items-center space-x-1 whitespace-nowrap">
                <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600 text-[14px]">{medicine.frequency}</span>
              </div>
              <div className="flex items-center space-x-1 whitespace-nowrap">
                <Clock size={12} className="text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600 text-[14px]">{language === 'ko' ? '다음' : 'Next'}: {medicine.nextDose}</span>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex items-center space-x-2 flex-wrap">
              {getStatusBadge(medicine.status, medicine.adherence)}
              {getStreakBadge(medicine.streak)}
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
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-[16px]"
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
      <div className={`${medicine.bgColor} p-3 rounded-xl`}>
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
