import React, { useState } from 'react';
import { X, ExternalLink, Sparkles, Crown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

export function AdBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      <Card className="mx-2 mb-2 p-3 bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200 shadow-md relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-200/30 rounded-full translate-y-8 -translate-x-8"></div>
        
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            {/* Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="text-white" size={24} />
            </div>
            
            {/* Ad Content */}
            <div className="flex-1">
              <h3 className="text-gray-800 font-semibold text-[16px] leading-tight">
                프리미엄으로 업그레이드
              </h3>
              <p className="text-gray-600 text-[14px] leading-tight mt-0.5">
                광고 없이 모든 기능을 사용하세요
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-9 px-4 text-[14px] shadow-sm flex-shrink-0"
          >
            <ExternalLink size={14} className="mr-1" />
            보기
          </Button>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-1 -right-1 w-6 h-6 bg-gray-600 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
            aria-label="광고 닫기"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      </Card>

      {/* Premium Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Crown className="text-white" size={32} />
            </div>
            <DialogTitle className="text-center text-[20px]">프리미엄 플랜</DialogTitle>
            <DialogDescription className="text-center text-[16px]">
              광고 없이 모든 기능을 무제한으로 사용하세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-emerald-600" />
                </div>
                <p className="text-[16px] text-gray-700">광고 제거</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-emerald-600" />
                </div>
                <p className="text-[16px] text-gray-700">무제한 약 등록</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-emerald-600" />
                </div>
                <p className="text-[16px] text-gray-700">프리미엄 알림 기능</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-emerald-600" />
                </div>
                <p className="text-[16px] text-gray-700">우선 고객 지원</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-center">
                <p className="text-gray-600 text-[14px]">월 이용료</p>
                <p className="text-[28px] text-amber-600 mt-1">₩4,900</p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-[16px] h-12"
              onClick={() => setIsDialogOpen(false)}
            >
              지금 구독하기
            </Button>
            <Button 
              variant="outline" 
              className="w-full text-[16px] h-12"
              onClick={() => setIsDialogOpen(false)}
            >
              나중에
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
