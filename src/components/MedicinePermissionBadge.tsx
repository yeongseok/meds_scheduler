import React from 'react';

interface MedicinePermissionBadgeProps {
  count: number;
  className?: string;
}

export function MedicinePermissionBadge({ count, className = '' }: MedicinePermissionBadgeProps) {
  if (count === 0) return null;

  return (
    <div
      className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-[#FF4444] rounded-full flex items-center justify-center ${className}`}
    >
      <span className="text-white text-[11px] leading-none">
        {count > 9 ? '9+' : count}
      </span>
    </div>
  );
}
