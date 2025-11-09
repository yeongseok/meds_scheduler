import React from 'react';
import { Clock, AlertCircle, AlertTriangle, CheckCircle, RotateCcw, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MedicineCardProps {
  medicine: any;
  isMyMeds: boolean;
  isTaken: boolean;
  isSkipped: boolean;
  isUntaken: boolean;
  doseCount?: number;
  onTake: (id: string) => void;
  onSkip: (id: string) => void;
  onUndoTaken: (id: string) => void;
  onUndoSkip: (id: string) => void;
  onUndoPreTaken: (id: string) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'taken':
      return <CheckCircle className="text-brand-accent" size={20} />;
    case 'overdue':
      return null; // No status icon for overdue medicines
    case 'pending':
      return <AlertCircle className="text-brand-accent animate-pulse" size={20} />;
    case 'upcoming':
      return <Clock className="text-stone-500" size={20} />;
    case 'as-needed':
      return null; // No status icon for as-needed medicines
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
  doseCount = 0,
  onTake,
  onSkip,
  onUndoTaken,
  onUndoSkip,
  onUndoPreTaken
}) => {
  const { t, language } = useLanguage();
  const isAsNeeded = medicine.asNeeded === true;
  
  // Determine if card is taken or skipped
  const isCardTaken = isTaken || (medicine.status === 'taken' && !isUntaken);
  const isCardSkipped = isSkipped;
  const shouldHideBorder = isCardTaken || isCardSkipped;
  
  // Calculate the effective status for display
  // For as-needed medicines, don't show overdue/pending/upcoming statuses
  const effectiveStatus = isCardTaken ? 'taken' : isCardSkipped ? 'skipped' : 
    (isAsNeeded && (medicine.status === 'overdue' || medicine.status === 'pending' || medicine.status === 'upcoming')) 
      ? 'as-needed' : medicine.status;

  return (
    <Card 
      className={`medicine-card p-3 border-2 hover:shadow-lg transition-all duration-200 ${
        shouldHideBorder 
          ? 'border-transparent' 
          : medicine.status === 'overdue' 
            ? 'bg-brand-light/50' 
            : ''
      }`}
      style={{
        borderColor: shouldHideBorder 
          ? 'transparent' 
          : medicine.status === 'overdue'
            ? 'var(--color-brand-border-primary)'
            : 'var(--color-brand-border-secondary)'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Medicine Icon */}
          <div className={`w-14 h-14 ${medicine.color} rounded-2xl flex items-center justify-center relative ${
            effectiveStatus === 'overdue' && !isAsNeeded ? 'ring-2 ring-red-600' : ''
          }`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <ImageWithFallback
                src={medicine.photo || medicine.image || 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGwlMjB0YWJsZXR8ZW58MXx8fHwxNzYyMzM1MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'}
                alt={medicine.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-1 -right-1">
              {getStatusIcon(effectiveStatus)}
            </div>
          </div>
          
          {/* Medicine Info */}
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${effectiveStatus === 'overdue' ? 'text-red-600' : 'text-gray-800'}`}>
              {medicine.name}
            </h3>
            <p className="text-base text-gray-600">
              {medicine.dosage} • {language === 'ko' ? '정제' : ('type' in medicine ? medicine.type : 'Tablet')}
            </p>
          </div>
        </div>

        {isMyMeds && (
          <div className="flex flex-col items-end space-y-2">
            {/* Pre-taken medicine (status='taken' in mock data) */}
            {medicine.status === 'taken' && !isTaken && !isSkipped && !isUntaken && (
              <>
                <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center justify-center gap-1 text-base w-[100px] h-10">
                  <CheckCircle size={14} /> {t('home.status.taken')}
                </Badge>
                <Button
                  variant="outline"
                  className="h-10 w-[100px] border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base flex items-center justify-center gap-1"
                  onClick={() => onUndoPreTaken(medicine.id)}
                >
                  <RotateCcw size={16} />
                  {t('home.actions.undo')}
                </Button>
              </>
            )}

            {/* Untaken medicine (was pre-taken, now undone) */}
            {isUntaken && !isTaken && !isSkipped && (
              <Button 
                className="h-10 w-20 bg-[#5A9FD4] hover:bg-[#4A8FCC] text-white text-base"
                onClick={() => onTake(medicine.id)}
              >
                {t('home.actions.take')}
              </Button>
            )}

            {/* Overdue medicine */}
            {medicine.status === 'overdue' && !isTaken && !isSkipped && !isAsNeeded && (
              <>
                <Button 
                  className="h-10 w-20 bg-[#5A9FD4] hover:bg-[#4A8FCC] text-white text-base"
                  onClick={() => onTake(medicine.id)}
                >
                  {t('home.actions.take')}
                </Button>
                {'asNeeded' in medicine && medicine.asNeeded && (
                  <Button 
                    variant="outline"
                    className="h-10 w-20 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
                    onClick={() => onSkip(medicine.id)}
                  >
                    {t('home.actions.skip')}
                  </Button>
                )}
              </>
            )}

            {/* Pending medicine */}
            {medicine.status === 'pending' && !isTaken && !isSkipped && !isAsNeeded && (
              <>
                <Button 
                  className="h-10 w-20 bg-[#5A9FD4] hover:bg-[#4A8FCC] text-white text-base"
                  onClick={() => onTake(medicine.id)}
                >
                  {t('home.actions.take')}
                </Button>
                {'asNeeded' in medicine && medicine.asNeeded && (
                  <Button 
                    variant="outline"
                    className="h-10 w-20 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base"
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
                <Button
                  variant="outline"
                  className="h-10 w-[100px] border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base flex items-center justify-center gap-1"
                  onClick={() => onUndoTaken(medicine.id)}
                >
                  <RotateCcw size={16} />
                  {t('home.actions.undo')}
                </Button>
              </>
            )}

            {/* Skipped medicine */}
            {isSkipped && (
              <>
                <Badge className="bg-gray-100 text-gray-600 border-gray-300 flex items-center justify-center gap-1 text-base w-[100px] h-10">
                  <X size={14} /> {language === 'ko' ? '건너뜀' : 'Skipped'}
                </Badge>
                <Button
                  variant="outline"
                  className="h-10 w-[100px] border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base flex items-center justify-center gap-1"
                  onClick={() => onUndoSkip(medicine.id)}
                >
                  <RotateCcw size={16} />
                  {t('home.actions.undo')}
                </Button>
              </>
            )}

            {/* Upcoming medicine */}
            {medicine.status === 'upcoming' && !isTaken && !isSkipped && !isAsNeeded && (
              <Badge variant="outline" className="bg-brand-surface text-gray-700 border-brand-secondary flex items-center justify-center gap-1 text-base w-20 h-10">
                <Clock size={14} /> {language === 'ko' ? '예정' : 'Upcoming'}
              </Badge>
            )}

            {/* As-needed medicine - always show take button with dose count */}
            {isAsNeeded && (
              <>
                {doseCount > 0 && (
                  <div className="inline-flex items-center justify-center rounded-md border bg-green-100 border-green-300 px-2 py-0.5 font-medium gap-1 w-[100px] h-10" style={{ color: '#15803d' }}>
                    <CheckCircle size={14} style={{ color: '#15803d' }} /> 
                    <span style={{ color: '#15803d' }}>{language === 'ko' ? '복용' : 'Taken'}</span>
                    <span style={{ color: '#15803d' }}> ({doseCount}{language === 'ko' ? '회' : 'x'})</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    className="h-10 w-20 bg-[#5A9FD4] hover:bg-[#4A8FCC] text-white text-base"
                    onClick={() => onTake(medicine.id)}
                  >
                    {t('home.actions.take')}
                  </Button>
                  {doseCount > 0 && (
                    <Button
                      variant="outline"
                      className="h-10 w-20 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 text-base flex items-center justify-center gap-1"
                      onClick={() => onUndoTaken(medicine.id)}
                    >
                      <RotateCcw size={16} />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
});

MedicineCard.displayName = 'MedicineCard';
