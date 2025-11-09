import React from 'react';
import { Clock, Edit2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
  editIconColor = 'text-brand-accent',
  language
}: MedicineListCardProps) {
  return (
    <Card className="medicine-card p-3 border-3 border-brand-secondary hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Medicine Icon */}
          <div className={`w-14 h-14 ${gradientColors} rounded-2xl flex items-center justify-center relative`}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2luZSUyMHBpbGwlMjB0YWJsZXR8ZW58MXx8fHwxNzYyMzM1MjIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Medicine Info */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">
              {name}
            </h3>
            <p className="text-base text-gray-600">
              {dosage} • {formType}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <Clock size={14} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {times}
              </span>
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
    </Card>
  );
}
