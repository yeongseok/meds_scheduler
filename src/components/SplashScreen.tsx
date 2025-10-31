import React, { useEffect } from 'react';
import { Pill, Heart, Shield, Clock } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-300 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-8 w-16 h-16 bg-orange-300 rounded-full animate-bounce delay-100"></div>
        <div className="absolute bottom-32 left-8 w-12 h-12 bg-rose-300 rounded-full animate-ping delay-200"></div>
        <div className="absolute bottom-48 right-12 w-14 h-14 bg-amber-300 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-48 left-1/3 w-18 h-18 bg-orange-300 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-16 right-1/3 w-10 h-10 bg-rose-300 rounded-full animate-ping delay-700"></div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 space-y-8">
        {/* App Icon */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-3xl gradient-primary flex items-center justify-center pill-shadow">
            <Pill size={64} className="text-white animate-pulse" />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-400 rounded-2xl flex items-center justify-center animate-bounce delay-200">
            <Heart size={20} className="text-white" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center animate-bounce delay-500">
            <Shield size={20} className="text-white" />
          </div>
          <div className="absolute top-1/2 -right-8 w-10 h-10 bg-rose-400 rounded-xl flex items-center justify-center animate-pulse delay-700">
            <Clock size={16} className="text-white" />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-800">
            <span className="text-amber-600">메디</span>
            <span className="text-emerald-500">케어</span>
          </h1>
          <p className="text-lg text-gray-600">당신의 건강, 우리의 최우선</p>
        </div>

        {/* Feature Icons */}
        <div className="flex justify-center space-x-6 mt-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Pill size={24} className="text-amber-600" />
            </div>
            <span className="text-xs text-gray-600">복용 기록</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <Clock size={24} className="text-emerald-600" />
            </div>
            <span className="text-xs text-gray-600">알림 설정</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center">
              <Heart size={24} className="text-rose-600" />
            </div>
            <span className="text-xs text-gray-600">건강 유지</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path 
            fill="url(#gradient)" 
            fillOpacity="0.3" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,96C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}