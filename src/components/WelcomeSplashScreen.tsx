import React from 'react';
import { SplashScreen } from './SplashScreen';

interface WelcomeSplashScreenProps {
  onComplete: () => void;
}

export function WelcomeSplashScreen({ onComplete }: WelcomeSplashScreenProps) {
  return <SplashScreen onComplete={onComplete} isWelcome={true} />;
}
