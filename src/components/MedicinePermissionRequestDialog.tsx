import React from 'react';
import { Check, X, User, Pill, Clock, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useLanguage } from './LanguageContext';

interface MedicinePermissionRequest {
  id: string;
  guardianId: string;
  guardianName: string;
  guardianPhotoURL?: string;
  medicineName: string;
  dosage: string;
  medicineType: string;
  frequency: string;
  times: string[];
  startDate: string;
  duration: number;
  instructions?: string;
  photoURL?: string;
  requestedAt: Date;
}

interface MedicinePermissionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MedicinePermissionRequest | null;
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
}

export function MedicinePermissionRequestDialog({
  open,
  onOpenChange,
  request,
  onApprove,
  onDeny
}: MedicinePermissionRequestDialogProps) {
  const { language } = useLanguage();

  if (!request) return null;

  const handleApprove = () => {
    onApprove(request.id);
    onOpenChange(false);
  };

  const handleDeny = () => {
    onDeny(request.id);
    onOpenChange(false);
  };

  const getMedicineTypeLabel = (type: string) => {
    const types: Record<string, { ko: string; en: string }> = {
      tablet: { ko: '정제', en: 'Tablet' },
      capsule: { ko: '캡슐', en: 'Capsule' },
      liquid: { ko: '액상', en: 'Liquid' },
      injection: { ko: '주사', en: 'Injection' },
      cream: { ko: '크림', en: 'Cream' },
      inhaler: { ko: '흡입제', en: 'Inhaler' },
      other: { ko: '기타', en: 'Other' }
    };
    return language === 'ko' ? types[type]?.ko || type : types[type]?.en || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white rounded-3xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[#E8F1FC] flex items-center justify-center">
                <Pill className="text-[#3674B5]" size={32} />
              </div>
            </div>
            <div>
              <DialogTitle className="text-[20px] text-gray-800 mb-1">
                {language === 'ko' ? '약 추가 승인 요청' : 'Medicine Approval Request'}
              </DialogTitle>
              <DialogDescription className="text-[14px] text-gray-600">
                {language === 'ko' 
                  ? '보호자가 새로운 약을 추가하려고 합니다' 
                  : 'Your guardian wants to add a new medicine'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Guardian Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#3674B5] flex items-center justify-center overflow-hidden">
              {request.guardianPhotoURL ? (
                <img 
                  src={request.guardianPhotoURL} 
                  alt={request.guardianName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-white" size={20} />
              )}
            </div>
            <div>
              <div className="text-[12px] text-gray-500">
                {language === 'ko' ? '요청자' : 'Requested by'}
              </div>
              <div className="text-[15px] text-gray-800">
                {request.guardianName}
              </div>
            </div>
          </div>

          {/* Medicine Preview */}
          <div className="bg-white border-2 border-[#3674B5]/20 rounded-2xl p-4 space-y-4">
            {/* Medicine Photo */}
            {request.photoURL && (
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img 
                    src={request.photoURL} 
                    alt={request.medicineName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Medicine Name */}
            <div>
              <div className="text-[12px] text-gray-500 mb-1">
                {language === 'ko' ? '약 이름' : 'Medicine Name'}
              </div>
              <div className="text-[18px] text-gray-800">
                {request.medicineName}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[12px] text-gray-500 mb-1">
                  {language === 'ko' ? '복용량' : 'Dosage'}
                </div>
                <div className="text-[14px] text-gray-800">
                  {request.dosage}
                </div>
              </div>
              <div>
                <div className="text-[12px] text-gray-500 mb-1">
                  {language === 'ko' ? '형태' : 'Type'}
                </div>
                <div className="text-[14px] text-gray-800">
                  {getMedicineTypeLabel(request.medicineType)}
                </div>
              </div>
            </div>

            {/* Frequency & Times */}
            <div>
              <div className="text-[12px] text-gray-500 mb-1">
                {language === 'ko' ? '복용 시간' : 'Schedule'}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14px] text-gray-800">{request.frequency}</span>
                {request.times.map((time, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#E8F1FC] text-[#3674B5] rounded-lg text-[13px]"
                  >
                    <Clock size={12} />
                    {time}
                  </span>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-500" />
              <div className="text-[13px] text-gray-600">
                {language === 'ko' 
                  ? `${request.startDate}부터 ${request.duration}일간` 
                  : `${request.duration} days from ${request.startDate}`}
              </div>
            </div>

            {/* Instructions */}
            {request.instructions && (
              <div className="pt-3 border-t border-gray-200">
                <div className="text-[12px] text-gray-500 mb-1">
                  {language === 'ko' ? '복용 방법' : 'Instructions'}
                </div>
                <div className="text-[13px] text-gray-700">
                  {request.instructions}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleApprove}
              className="w-full h-12 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-xl"
            >
              <Check size={18} className="mr-2" />
              <span className="text-[15px]">
                {language === 'ko' ? '승인하기' : 'Approve'}
              </span>
            </Button>
            <Button
              onClick={handleDeny}
              variant="outline"
              className="w-full h-12 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl"
            >
              <X size={18} className="mr-2" />
              <span className="text-[15px]">
                {language === 'ko' ? '거부하기' : 'Deny'}
              </span>
            </Button>
          </div>

          {/* Info Note */}
          <p className="text-[12px] text-gray-500 text-center px-2">
            {language === 'ko' 
              ? '승인하면 이 약이 내 복용 목록에 추가됩니다' 
              : 'Approving will add this medicine to your medication list'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
