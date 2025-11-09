import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';
import { Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TimePickerProps {
  value: string; // Format: "HH:MM" in 24-hour format
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  // Parse value on mount or when value changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const hourNum = parseInt(h);
      
      if (hourNum === 0) {
        setPeriod('AM');
        setHour('12');
      } else if (hourNum < 12) {
        setPeriod('AM');
        setHour(hourNum.toString().padStart(2, '0'));
      } else if (hourNum === 12) {
        setPeriod('PM');
        setHour('12');
      } else {
        setPeriod('PM');
        setHour((hourNum - 12).toString().padStart(2, '0'));
      }
      
      setMinute(m);
    }
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSave = () => {
    let hour24 = parseInt(hour);
    
    if (period === 'AM') {
      if (hour24 === 12) hour24 = 0;
    } else {
      if (hour24 !== 12) hour24 += 12;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${minute}`;
    onChange(timeString);
    setIsOpen(false);
  };

  const displayTime = () => {
    if (!value) return language === 'ko' ? '시간 선택' : 'Select time';
    const [h, m] = value.split(':');
    const hourNum = parseInt(h);
    const displayPeriod = hourNum < 12 
      ? (language === 'ko' ? '오전' : 'AM')
      : (language === 'ko' ? '오후' : 'PM');
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayPeriod} ${displayHour}:${m}`;
  };

  const scrollToItem = (ref: React.RefObject<HTMLDivElement>, value: string, items: string[]) => {
    if (ref.current) {
      const index = items.indexOf(value);
      const itemHeight = 36; // Height of each item (h-9)
      ref.current.scrollTop = index * itemHeight - itemHeight * 2; // Center the selected item
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToItem(hourRef, hour, hours);
        scrollToItem(minuteRef, minute, minutes);
      }, 50);
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 justify-start text-left border-gray-200 hover:border-[#3674B5] bg-white rounded-xl text-[16px]"
        >
          <Clock className="mr-2 h-4 w-4 text-[#3674B5]" />
          <span className="text-gray-700">{displayTime()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[280px] p-0 border-gray-200 shadow-lg overflow-hidden" 
        align="center"
        sideOffset={8}
      >
        {/* Period Selector */}
        <div className="flex gap-2 p-3 bg-white">
          <Button
            type="button"
            onClick={() => setPeriod('AM')}
            className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all ${
              period === 'AM' 
                ? 'bg-[#3674B5] hover:bg-[#3674B5]/90 text-white shadow-sm' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {language === 'ko' ? '오전' : 'AM'}
          </Button>
          <Button
            type="button"
            onClick={() => setPeriod('PM')}
            className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all ${
              period === 'PM' 
                ? 'bg-[#3674B5] hover:bg-[#3674B5]/90 text-white shadow-sm' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {language === 'ko' ? '오후' : 'PM'}
          </Button>
        </div>

        {/* Time Selector */}
        <div className="flex gap-0 px-3 pb-3 bg-white">
          {/* Hours */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-xs text-gray-500 font-medium mb-2">{language === 'ko' ? '시' : 'Hour'}</div>
            <div 
              ref={hourRef}
              className="w-full h-[180px] overflow-y-scroll mobile-scroll"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="py-[72px]" style={{ pointerEvents: 'none' }}>
                {hours.map((h) => (
                  <div
                    key={h}
                    onClick={() => setHour(h)}
                    className={`w-full h-9 flex items-center justify-center text-2xl transition-all font-medium cursor-pointer select-none ${
                      h === hour
                        ? 'text-[#3674B5] scale-110'
                        : 'text-gray-300'
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-px bg-gray-200 my-6 mx-1" />

          {/* Minutes */}
          <div className="flex-1 flex flex-col items-center">
            <div className="text-xs text-gray-500 font-medium mb-2">{language === 'ko' ? '분' : 'Min'}</div>
            <div 
              ref={minuteRef}
              className="w-full h-[180px] overflow-y-scroll mobile-scroll"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="py-[72px]" style={{ pointerEvents: 'none' }}>
                {minutes.map((m) => (
                  <div
                    key={m}
                    onClick={() => setMinute(m)}
                    className={`w-full h-9 flex items-center justify-center text-2xl transition-all font-medium cursor-pointer select-none ${
                      m === minute
                        ? 'text-[#3674B5] scale-110'
                        : 'text-gray-300'
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 p-3 bg-white border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1 h-10 rounded-lg text-sm border-gray-300 hover:bg-gray-50"
          >
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 h-10 rounded-lg bg-[#3674B5] hover:bg-[#3674B5]/90 text-white text-sm shadow-sm"
          >
            {language === 'ko' ? '확인' : 'Confirm'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
