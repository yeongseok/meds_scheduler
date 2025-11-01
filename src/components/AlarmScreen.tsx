import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Pill, X, Snooze, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useLanguage } from './LanguageContext';

interface AlarmScreenProps {
  isVisible: boolean;
  medicineName: string;
  dosage: string;
  time: string;
  medicineType?: string;
  onTaken: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
  onSettings?: () => void;
}

export function AlarmScreen({
  isVisible,
  medicineName,
  dosage,
  time,
  medicineType = 'tablet',
  onTaken,
  onSnooze,
  onDismiss,
  onSettings
}: AlarmScreenProps) {
  const { language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ko' ? 'ko-KR' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: language !== 'ko' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-6">
      {/* Settings Icon */}
      {onSettings && (
        <button
          onClick={onSettings}
          className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all"
        >
          <Settings className="text-gray-600" size={24} />
        </button>
      )}

      {/* Animated bell icon */}
      <div className="absolute top-12 animate-bounce">
        <div className="relative">
          <Bell className="text-amber-600 animate-pulse" size={64} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Current Time Display */}
        <div className="text-center space-y-2">
          <div className="text-[72px] font-bold text-gray-800 leading-none tracking-tight">
            {formatTime(currentTime)}
          </div>
          <div className="text-[20px] text-gray-600">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Medicine Alert Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-2 border-amber-300 shadow-2xl p-8 space-y-6">
          {/* Alert Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg">
              <Pill className="text-white" size={40} />
            </div>
            <h2 className="text-[32px] font-bold text-gray-800">
              {language === 'ko' ? '약 복용 시간' : 'Medication Time'}
            </h2>
            <p className="text-[20px] text-gray-600">
              {language === 'ko' ? '지금 약을 복용할 시간입니다' : "It's time to take your medication"}
            </p>
          </div>

          {/* Medicine Information */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 space-y-4 border border-amber-200">
            <div className="space-y-2">
              <div className="text-[16px] text-gray-600">
                {language === 'ko' ? '약 이름' : 'Medicine Name'}
              </div>
              <div className="text-[28px] font-bold text-gray-800">
                {medicineName}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-amber-200">
              <div>
                <div className="text-[16px] text-gray-600 mb-1">
                  {language === 'ko' ? '복용량' : 'Dosage'}
                </div>
                <div className="text-[24px] font-semibold text-gray-800">
                  {dosage}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[16px] text-gray-600 mb-1">
                  {language === 'ko' ? '예정 시간' : 'Scheduled Time'}
                </div>
                <div className="text-[24px] font-semibold text-amber-600 flex items-center justify-end gap-2">
                  <Clock size={24} />
                  {time}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Take Button */}
            <Button
              onClick={onTaken}
              className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all text-[20px] font-semibold"
            >
              <Check size={28} className="mr-3" />
              {language === 'ko' ? '복용 완료' : 'Mark as Taken'}
            </Button>

            {/* Snooze Button */}
            <Button
              onClick={onSnooze}
              variant="outline"
              className="w-full h-14 border-2 border-amber-400 bg-white hover:bg-amber-50 text-amber-700 shadow-md hover:shadow-lg transition-all text-[18px] font-semibold"
            >
              <Clock size={24} className="mr-2" />
              {language === 'ko' ? '10분 후 다시 알림' : 'Remind in 10 min'}
            </Button>

            {/* Dismiss Button */}
            <Button
              onClick={onDismiss}
              variant="ghost"
              className="w-full h-12 text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-[16px]"
            >
              <X size={20} className="mr-2" />
              {language === 'ko' ? '알림 끄기' : 'Dismiss'}
            </Button>
          </div>
        </Card>

        {/* Bottom Hint */}
        <div className="text-center text-[14px] text-gray-500">
          복용 후 '복용 완료' 버튼을 눌러주세요
        </div>
      </div>
    </div>
  );
}
