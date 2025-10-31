import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';

interface TimePickerProps {
  value: string; // Format: "HH:MM" in 24-hour format
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [period, setPeriod] = useState<'오전' | '오후'>('오전');
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
        setPeriod('오전');
        setHour('12');
      } else if (hourNum < 12) {
        setPeriod('오전');
        setHour(hourNum.toString().padStart(2, '0'));
      } else if (hourNum === 12) {
        setPeriod('오후');
        setHour('12');
      } else {
        setPeriod('오후');
        setHour((hourNum - 12).toString().padStart(2, '0'));
      }
      
      setMinute(m);
    }
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSave = () => {
    let hour24 = parseInt(hour);
    
    if (period === '오전') {
      if (hour24 === 12) hour24 = 0;
    } else {
      if (hour24 !== 12) hour24 += 12;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${minute}`;
    onChange(timeString);
    setIsOpen(false);
  };

  const displayTime = () => {
    if (!value) return '시간 선택';
    const [h, m] = value.split(':');
    const hourNum = parseInt(h);
    const displayPeriod = hourNum < 12 ? '오전' : '오후';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayPeriod} ${displayHour}:${m}`;
  };

  const scrollToItem = (ref: React.RefObject<HTMLDivElement>, value: string, items: string[]) => {
    if (ref.current) {
      const index = items.indexOf(value);
      const itemHeight = 56; // Height of each item
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
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 justify-start text-left border-gray-200 hover:border-amber-400 bg-white rounded-xl text-[18px]"
      >
        <span className="text-gray-700">{displayTime()}</span>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {/* Period Selector */}
            <div className="flex gap-2 p-3 bg-gray-50 border-b border-gray-200">
              <Button
                type="button"
                onClick={() => setPeriod('오전')}
                className={`flex-1 h-14 rounded-xl text-[20px] ${
                  period === '오전' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                오전
              </Button>
              <Button
                type="button"
                onClick={() => setPeriod('오후')}
                className={`flex-1 h-14 rounded-xl text-[20px] ${
                  period === '오후' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                오후
              </Button>
            </div>

            {/* Time Selector */}
            <div className="flex gap-2 p-4 bg-white">
              {/* Hours */}
              <div className="flex-1 flex flex-col items-center">
                <div className="text-[14px] text-gray-500 mb-2">시</div>
                <div 
                  ref={hourRef}
                  className="w-full h-[280px] overflow-y-auto scrollbar-hide scroll-smooth"
                  style={{ scrollSnapType: 'y mandatory' }}
                >
                  <div className="py-28">
                    {hours.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHour(h)}
                        className={`w-full h-14 flex items-center justify-center text-[24px] transition-all scroll-snap-align-center ${
                          h === hour
                            ? 'text-amber-600 scale-110'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        style={{ scrollSnapAlign: 'center' }}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-px bg-gray-200 my-4" />

              {/* Minutes */}
              <div className="flex-1 flex flex-col items-center">
                <div className="text-[14px] text-gray-500 mb-2">분</div>
                <div 
                  ref={minuteRef}
                  className="w-full h-[280px] overflow-y-auto scrollbar-hide scroll-smooth"
                  style={{ scrollSnapType: 'y mandatory' }}
                >
                  <div className="py-28">
                    {minutes.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMinute(m)}
                        className={`w-full h-14 flex items-center justify-center text-[24px] transition-all scroll-snap-align-center ${
                          m === minute
                            ? 'text-amber-600 scale-110'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        style={{ scrollSnapAlign: 'center' }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 h-12 rounded-xl text-[16px] hover:bg-gray-100"
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[16px]"
              >
                확인
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
