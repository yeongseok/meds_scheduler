import React from 'react';
import { ExternalLink, Tag } from 'lucide-react';
import { Card } from './ui/card';

export function AdBanner() {
  return (
    <Card className="mx-4 mb-3 bg-white border-gray-200 shadow-sm">
      {/* Sponsored Label */}
      <div className="px-2 pt-1 pb-0.5 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <Tag size={10} className="text-gray-400" />
          <span className="text-gray-400 text-[11px]">스폰서 광고</span>
        </div>
      </div>

      {/* Ad Content */}
      <div className="p-2 flex items-center gap-2">
        {/* Ad Image */}
        <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          <div className="text-brand-accent text-[16px] font-bold">건강+</div>
        </div>

        {/* Ad Details */}
        <div className="flex-1">
          <h4 className="text-gray-900 font-semibold text-[13px] leading-tight mb-0.5">
            건강 보조제 특별 할인
          </h4>
          <p className="text-gray-600 text-[12px] leading-tight mb-1">
            비타민, 영양제 최대 40% 할인 중
          </p>
          <div className="flex items-center gap-1 text-brand-accent text-[11px]">
            <span className="font-medium">자세히 보기</span>
            <ExternalLink size={10} />
          </div>
        </div>
      </div>
    </Card>
  );
}
