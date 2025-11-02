import React from 'react';
import { Clock, Edit2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MedicineListCardProps {
  id: string;
  name: string;
  dosage: string;
  formType: string;
  frequency: string;
  times: string;
  gradientColors: string;
  onEdit?: (id: string, name: string) => void;
  editIconColor?: string;
  language: 'ko' | 'en';
}

export function MedicineListCard({
  id,
  name,
  dosage,
  formType,
  frequency,
  times,
  gradientColors,
  onEdit,
  editIconColor = 'text-amber-600',
  language
}: MedicineListCardProps) {
  return (
    <Card className="medicine-card p-3 border-0 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 bg-gradient-to-r ${gradientColors} rounded-2xl flex items-center justify-center`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">
              {name}
            </h3>
            <p className="text-base text-gray-600">
              {dosage} • {formType}
            </p>
            <div className="mt-1">
              <Badge variant="outline" className="text-stone-600 border-stone-300 text-sm">
                {frequency}
              </Badge>
            </div>
          </div>
        </div>
        {onEdit && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onEdit(id, name)}
          >
            <Edit2 size={16} className={editIconColor} />
          </Button>
        )}
      </div>
      <div className="m-[0px] pl-[72px] text-sm text-gray-600">
        <Clock size={14} className="inline mr-1" />
        {times}
      </div>
    </Card>
  );
}
