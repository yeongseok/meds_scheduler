import React, { useState } from 'react';
import { ChevronLeft, Bell, Check, X, Clock } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { MedicinePermissionRequestDialog } from './MedicinePermissionRequestDialog';

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

interface MedicinePermissionRequestsPageProps {
  onBack: () => void;
  onApprove: (requestId: string) => void;
  onDeny: (requestId: string) => void;
}

export function MedicinePermissionRequestsPage({
  onBack,
  onApprove,
  onDeny
}: MedicinePermissionRequestsPageProps) {
  const { language } = useLanguage();
  const [selectedRequest, setSelectedRequest] = useState<MedicinePermissionRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data - In production, this would come from a hook like useMedicinePermissionRequests
  const [requests, setRequests] = useState<MedicinePermissionRequest[]>([
    {
      id: '1',
      guardianId: 'g1',
      guardianName: '김지은',
      medicineName: '아스피린',
      dosage: '100mg, 1정',
      medicineType: 'tablet',
      frequency: '하루 1회',
      times: ['09:00'],
      startDate: '2025-01-15',
      duration: 30,
      instructions: '식후 30분에 물과 함께 복용',
      requestedAt: new Date('2025-01-10T14:30:00')
    },
    {
      id: '2',
      guardianId: 'g2',
      guardianName: '이민수',
      medicineName: '비타민 D',
      dosage: '2000 IU, 1정',
      medicineType: 'capsule',
      frequency: '하루 1회',
      times: ['08:00'],
      startDate: '2025-01-12',
      duration: 90,
      requestedAt: new Date('2025-01-09T10:15:00')
    }
  ]);

  const handleRequestClick = (request: MedicinePermissionRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    onApprove(requestId);
  };

  const handleDeny = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    onDeny(requestId);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return language === 'ko' ? '방금 전' : 'Just now';
    } else if (diffMins < 60) {
      return language === 'ko' ? `${diffMins}분 전` : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return language === 'ko' ? `${diffHours}시간 전` : `${diffHours}h ago`;
    } else {
      return language === 'ko' ? `${diffDays}일 전` : `${diffDays}d ago`;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-[18px] text-gray-800">
            {language === 'ko' ? '승인 요청' : 'Approval Requests'}
          </h1>
          <div className="w-10" /> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {requests.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="text-gray-400" size={32} />
            </div>
            <h3 className="text-[16px] text-gray-800 mb-2">
              {language === 'ko' ? '승인 요청이 없습니다' : 'No Pending Requests'}
            </h3>
            <p className="text-[14px] text-gray-600 text-center">
              {language === 'ko'
                ? '보호자가 약 추가를 요청하면 여기에 표시됩니다'
                : 'Guardian medicine requests will appear here'}
            </p>
          </div>
        ) : (
          /* Request List */
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => handleRequestClick(request)}
                className="bg-white border-2 border-[#3674B5]/20 rounded-2xl p-4 cursor-pointer hover:border-[#3674B5]/40 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8F1FC] flex items-center justify-center">
                      <Bell className="text-[#3674B5]" size={16} />
                    </div>
                    <div>
                      <div className="text-[16px] text-gray-800">
                        {request.guardianName}
                      </div>
                      <div className="text-[13px] text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {formatRelativeTime(request.requestedAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medicine Info */}
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-3">
                    {request.photoURL && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img
                          src={request.photoURL}
                          alt={request.medicineName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[17px] text-gray-800 mb-0.5 truncate">
                        {request.medicineName}
                      </div>
                      <div className="text-[15px] text-gray-600">
                        {request.dosage} • {request.times.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(request.id);
                    }}
                    className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Check size={16} />
                    <span className="text-[15px]">
                      {language === 'ko' ? '승인' : 'Approve'}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeny(request.id);
                    }}
                    className="flex-1 h-10 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <X size={16} />
                    <span className="text-[15px]">
                      {language === 'ko' ? '거부' : 'Deny'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permission Request Dialog */}
      <MedicinePermissionRequestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        request={selectedRequest}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    </div>
  );
}
