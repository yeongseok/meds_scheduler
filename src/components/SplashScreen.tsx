import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { AppIcon } from './AppIcon';

interface SplashScreenProps {
  onComplete: () => void;
  isWelcome?: boolean;
}

export function SplashScreen({ onComplete, isWelcome = false }: SplashScreenProps) {
  const { language } = useLanguage();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, isWelcome ? 2000 : 2500);

    return () => clearTimeout(timer);
  }, [onComplete, isWelcome]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="text-center space-y-8">
        {/* Animated App Icon */}
        <div className="relative flex justify-center">
          <AppIcon size={96} animate={true} />
        </div>

        {/* App Name with Animation */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl">
            <motion.span
              className="text-[#3674B5]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {language === 'ko' ? '약드세요' : 'MediRemind'}
            </motion.span>
          </h1>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            {isWelcome 
              ? (language === 'ko' ? '환영합니다!' : 'Welcome!')
              : (language === 'ko' ? '당신의 건강, 우리의 최우선' : 'Your health, our priority')
            }
          </motion.p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          <div className="flex space-x-2">
            <motion.div
              className="w-2.5 h-2.5 bg-[#F3D0D7] rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="w-2.5 h-2.5 bg-[#F0EBE3] rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.1
              }}
            />
            <motion.div
              className="w-2.5 h-2.5 bg-[#E8BFC6] rounded-full"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
