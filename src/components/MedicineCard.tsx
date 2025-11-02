import React from 'react';
import { Clock, AlertCircle, XCircle, CheckCircle, RotateCcw, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';

interface MedicineCardProps {
  medicine: any;
  isMyMeds: boolean;
  isTaken: boolean;
  isSkipped: boolean;
  isUntaken: boolean;
  onTake: (id: string) => void;
  onSkip: (id: string) => void;
  onUndoTaken: (id: string) => void;
  onUndoSkip: (id: string) => void;
  onUndoPreTaken: (id: string) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'taken':
      return <CheckCircle className="text-amber-600" size={20} />;
    case 'overdue':
      return <XCircle className="text-orange-600 animate-pulse" size={20} />;
    case 'pending':
      return <AlertCircle className="text-amber-500 animate-pulse" size={20} />;
    case 'upcoming':
      return <Clock className="text-stone-500" size={20} />;
    default:
      return <Clock className="text-stone-400" size={20} />;
  }
};

export const MedicineCard: React.FC<MedicineCardProps> = React.memo(({
  medicine,
  isMyMeds,
  isTaken,
  isSkipped,
  isUntaken,
  onTake,
  onSkip,
  onUndoTaken,
  onUndoSkip,
  onUndoPreTaken
}) => {
  const { t, language } = useLanguage();

  return (
    <Card 
      className={`medicine-card p-3 border-0 hover:shadow-lg transition-all duration-200 ${
        medicine.status === 'overdue' ? 'border-2 border-orange-300 bg-orange-50/50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Medicine Icon */}
          <div className={`w-14 h-14 bg-gradient-to-r ${medicine.color} rounded-2xl flex items-center justify-center relative ${
            medicine.status === 'overdue' ? 'ring-2 ring-orange-400' : ''
          }`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
            <div className="absolute -top-1 -right-1">
              {getStatusIcon(medicine.status)}
            </div>
          </div>
          
          {/* Medicine Info */}
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${medicine.status === 'overdue' ? 'text-orange-800' : 'text-gray-800'}`}>
              {medicine.name}
            </h3>
            <p className="text-base text-gray-600">
              {medicine.dosage} • {language === 'ko' ? '정제' : ('type' in medicine ? medicine.type : 'Tablet')}
            </p>
            <div className="mt-1">
              {'frequency' in medicine && medicine.frequency && (
                <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">
                  {medicine.frequency}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isMyMeds && (
          <div className="flex flex-col items-end space-y-2">
            {/* Pre-taken medicine (status='taken' in mock data) */}
            {medicine.status === 'taken' && !isTaken && !isSkipped && !isUntaken && (
              <>
                <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1 text-sm">
                  <CheckCircle size={14} /> {t('home.status.taken')}
                </Badge>
                <Button
                  variant="outline"
                  className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                  onClick={() => onUndoPreTaken(medicine.id)}
                >
                  <RotateCcw size={16} className="mr-1.5" />
                  {t('home.actions.undo')}
                </Button>
              </>
            )}

            {/* Untaken medicine (was pre-taken, now undone) */}
            {isUntaken && !isTaken && !isSkipped && (
              <Button 
                className="h-10 px-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-base"
                onClick={() => onTake(medicine.id)}
              >
                {t('home.actions.take')}
              </Button>
            )}

            {/* Overdue medicine */}
            {medicine.status === 'overdue' && !isTaken && !isSkipped && (
              <>
                <Button 
                  className="h-10 px-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-base"
                  onClick={() => onTake(medicine.id)}
                >
                  {t('home.actions.take')}
                </Button>
                {'asNeeded' in medicine && medicine.asNeeded && (
                  <Button 
                    variant="outline"
                    className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                    onClick={() => onSkip(medicine.id)}
                  >
                    {t('home.actions.skip')}
                  </Button>
                )}
              </>
            )}

            {/* Pending medicine */}
            {medicine.status === 'pending' && !isTaken && !isSkipped && (
              <>
                <Button 
                  className="h-10 px-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-base"
                  onClick={() => onTake(medicine.id)}
                >
                  {t('home.actions.take')}
                </Button>
                {'asNeeded' in medicine && medicine.asNeeded && (
                  <Button 
                    variant="outline"
                    className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                    onClick={() => onSkip(medicine.id)}
                  >
                    {t('home.actions.skip')}
                  </Button>
                )}
              </>
            )}

            {/* Taken medicine (just taken in current session) */}
            {isTaken && (
              <>
                <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1 text-sm">
                  <CheckCircle size={14} /> {t('home.status.taken')}
                </Badge>
                <Button
                  variant="outline"
                  className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                  onClick={() => onUndoTaken(medicine.id)}
                >
                  <RotateCcw size={16} className="mr-1.5" />
                  {t('home.actions.undo')}
                </Button>
              </>
            )}

            {/* Skipped medicine */}
            {isSkipped && (
              <>
                <Badge className="bg-gray-100 text-gray-600 border-gray-300 flex items-center gap-1 text-sm">
                  <X size={14} /> {language === 'ko' ? '건너뜀' : 'Skipped'}
                </Badge>
                <Button
                  variant="outline"
                  className="h-10 px-5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                  onClick={() => onUndoSkip(medicine.id)}
                >
                  <RotateCcw size={16} className="mr-1.5" />
                  {t('home.actions.undo')}
                </Button>
              </>
            )}

            {/* Upcoming medicine */}
            {medicine.status === 'upcoming' && !isTaken && !isSkipped && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 flex items-center gap-1 text-sm">
                <Clock size={14} /> {language === 'ko' ? '예정' : 'Upcoming'}
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {/* Schedule line with clock icon */}
      {'schedule' in medicine && medicine.schedule && (
        <div className="m-[0px] pl-[72px] text-sm text-gray-600">
          <Clock size={14} className="inline mr-1" />
          {medicine.schedule}
        </div>
      )}
    </Card>
  );
});

MedicineCard.displayName = 'MedicineCard';
