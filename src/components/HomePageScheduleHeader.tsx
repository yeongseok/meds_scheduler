import React from 'react';
import { Activity } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { CareRecipient } from './SharedHeader';

interface HomePageScheduleHeaderProps {
  selectedView: string;
  currentPerson?: CareRecipient;
}

export const HomePageScheduleHeader = React.memo<HomePageScheduleHeaderProps>(({ 
  selectedView, 
  currentPerson 
}) => {
  const { t, language } = useLanguage();
  
  const title = selectedView === 'my-meds' 
    ? t('home.todaySchedule')
    : language === 'ko' 
      ? `${currentPerson?.name.split(' ')[0]}의 일정`
      : `${currentPerson?.name.split(' ')[0]}'s Schedule`;

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-gray-800 flex items-center space-x-2">
        <Activity className="text-[#3674B5]" size={22} />
        <span className="text-xl font-bold text-[18px]">
          {title}
        </span>
      </h2>
    </div>
  );
});

HomePageScheduleHeader.displayName = 'HomePageScheduleHeader';
