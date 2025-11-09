import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';
import { CareRecipient } from './SharedHeader';

interface HomePageAlertCardProps {
  currentPerson: CareRecipient;
  onSendReminder: () => void;
}

export const HomePageAlertCard = React.memo<HomePageAlertCardProps>(({ 
  currentPerson, 
  onSendReminder 
}) => {
  const { t, language } = useLanguage();
  
  const firstName = currentPerson.name.split(' ')[0];
  const overdueCount = currentPerson.todayStatus.overdue;

  return (
    <Card className="p-4 bg-[#E8F1FC] border-[#3674B5] border-2">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-[#3674B5] rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle className="text-white" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1 text-lg text-[18px]">
            {t('home.attentionNeeded')}
          </h3>
          <p className="text-base text-gray-700 text-[16px]">
            {language === 'ko' 
              ? `${firstName}님은 ${overdueCount}개의 약을 복용하지 않았습니다. 확인해 주세요.`
              : `${firstName} ${t('home.overdueMessage').replace('{count}', String(overdueCount))}`}
          </p>
          <Button 
            className="mt-3 bg-[#3674B5] hover:bg-[#2563A8] text-white h-10 text-base" 
            onClick={onSendReminder}
          >
            {t('home.sendReminder')}
          </Button>
        </div>
      </div>
    </Card>
  );
});

HomePageAlertCard.displayName = 'HomePageAlertCard';
