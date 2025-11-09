import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface GuardianSectionHeaderProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  count: number;
  badgeColor: string;
}

export function GuardianSectionHeader({ icon: Icon, iconColor, title, count, badgeColor }: GuardianSectionHeaderProps) {
  return (
    <div className="flex items-center space-x-2 mb-3">
      <Icon className={iconColor} size={20} />
      <h2 className="font-semibold text-gray-800 text-[18px]">
        {title}
      </h2>
      <Badge className={`${badgeColor} text-[14px]`}>{count}</Badge>
    </div>
  );
}
