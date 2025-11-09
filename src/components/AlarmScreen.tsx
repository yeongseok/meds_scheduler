import React, { useState, useEffect } from 'react';
import { Clock, Settings, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';

interface AlarmScreenProps {
  isVisible: boolean;
  medicineName: string;
  dosage: string;
  time: string;
  medicineType?: string;
  medicinePhotoURL?: string;
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
  medicinePhotoURL,
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
      hour12: false
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
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header with time and settings */}
      <div className="relative pt-10 pb-6 px-6">
        {/* Current Time Display */}
        <div className="text-center">
          <div className="text-[64px] leading-none tracking-tight text-gray-800">
            {formatTime(currentTime)}
          </div>
          <div className="text-[15px] text-gray-500 mt-2">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Settings Icon */}
        {onSettings && (
          <button
            onClick={onSettings}
            className="absolute top-10 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Settings"
          >
            <Settings className="text-gray-600" size={24} />
          </button>
        )}
      </div>

      {/* Main Content - Centered Card */}
      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md">
          {/* Medicine Alert Card */}
          <div className="bg-white border-2 border-[#3674B5]/30 rounded-3xl p-6 shadow-lg">
            {/* Medicine Image or Pill Icon */}
            <div className="flex justify-center mb-6">
              {medicinePhotoURL ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#3674B5] shadow-md">
                  <img 
                    src={medicinePhotoURL} 
                    alt={medicineName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#3674B5] flex items-center justify-center">
                  <svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M10.5 20.5 10 21a2 2 0 0 1-2.828 0L3.343 17.172a2 2 0 0 1 0-2.828l.5-.5"/>
                    <path d="m13.5 3.5.5-.5a2 2 0 0 1 2.828 0l3.829 3.828a2 2 0 0 1 0 2.828l-.5.5"/>
                    <path d="M6.5 6.5 17 17"/>
                    <path d="m8 8 8 8"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-center text-[24px] text-gray-800 mb-2">
              {language === 'ko' ? '약 복용 시간' : 'Medication Time'}
            </h2>
            <p className="text-center text-[15px] text-gray-600 mb-6">
              {language === 'ko' ? '지금 약을 복용할 시간입니다' : "It's time to take your medication"}
            </p>

            {/* Medicine Info Card */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="mb-4">
                <div className="text-[16px] text-gray-500 mb-1">
                  {language === 'ko' ? '약 이름' : 'Medicine'}
                </div>
                <div className="text-[22px] text-gray-800">
                  {medicineName}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <div className="text-[16px] text-gray-500 mb-1">
                    {language === 'ko' ? '복용량' : 'Dosage'}
                  </div>
                  <div className="text-[22px] text-gray-800">
                    {dosage}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[16px] text-gray-500 mb-1">
                    {language === 'ko' ? '예정 시간' : 'Scheduled'}
                  </div>
                  <div className="text-[16px] text-[#3674B5] flex items-center gap-1.5">
                    <Clock size={16} />
                    {time}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Take Medicine Button */}
              <Button
                onClick={onTaken}
                className="w-full h-14 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <Check size={20} className="mr-2" />
                <span className="text-[17px]">
                  {language === 'ko' ? '복용 완료' : 'Mark as Taken'}
                </span>
              </Button>

              {/* Snooze Button */}
              <Button
                onClick={onSnooze}
                variant="outline"
                className="w-full h-12 border-2 border-[#3674B5] text-[#3674B5] bg-white hover:bg-[#3674B5]/5 rounded-xl"
              >
                <Clock size={18} className="mr-2" />
                <span className="text-[16px]">
                  {language === 'ko' ? '10분 후 다시 알림' : 'Remind in 10 min'}
                </span>
              </Button>

              {/* Dismiss Button */}
              <button
                onClick={onDismiss}
                className="w-full py-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="flex items-center justify-center gap-1.5 text-[15px]">
                  <X size={16} />
                  {language === 'ko' ? '알림 끄기' : 'Dismiss'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
