import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from './LanguageContext';
import { AppIcon } from './AppIcon';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: () => void;
  onNavigateToSignUp?: () => void;
  onNavigateToForgotPassword?: () => void;
  onNavigateToEmailSignUp?: () => void;
  onNavigateToPhoneSignUp?: () => void;
}

export function LoginPage({ onLogin, onNavigateToSignUp, onNavigateToForgotPassword }: LoginPageProps) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'email' && email && password) {
      onLogin();
    } else if (loginMethod === 'phone' && phone && password) {
      onLogin();
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-md space-y-8">
        
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-3">
            <AppIcon size={80} animate={true} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl mb-2">
              <span className="text-[#3674B5]">{language === 'ko' ? '약드세요' : 'MediRemind'}</span>
            </h1>
            <p className="text-gray-600">
              {language === 'ko' ? '다시 오신 것을 환영합니다' : 'Welcome back'}
            </p>
          </motion.div>
        </div>

        {/* Login Form with Tabs */}
        <Tabs defaultValue="email" className="w-full" onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
          <TabsList className="grid w-full grid-cols-2 bg-[#F6F5F2] mb-6">
            <TabsTrigger value="email" className="data-[state=active]:bg-white">
              <Mail className="mr-2" size={18} />
              {language === 'ko' ? '이메일' : 'Email'}
            </TabsTrigger>
            <TabsTrigger value="phone" className="data-[state=active]:bg-white">
              <Smartphone className="mr-2" size={18} />
              {language === 'ko' ? '휴대폰' : 'Phone'}
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TabsContent value="email" className="space-y-5 mt-0">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  {language === 'ko' ? '이메일' : 'Email'}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="pl-10 h-12 bg-[#F6F5F2] border-gray-200"
                    required={loginMethod === 'email'}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-5 mt-0">
              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  {language === 'ko' ? '휴대폰 번호' : 'Phone Number'}
                </Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={language === 'ko' ? '010-1234-5678' : '+1 (555) 123-4567'}
                    className="pl-10 h-12 bg-[#F6F5F2] border-gray-200"
                    required={loginMethod === 'phone'}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Password Input - Common for both */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">
                  {language === 'ko' ? '비밀번호' : 'Password'}
                </Label>
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-sm text-[#2563A8] hover:text-[#3674B5]"
                >
                  {language === 'ko' ? '비밀번호 찾기' : 'Forgot?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'ko' ? '비밀번호를 입력하세요' : 'Enter your password'}
                  className="pl-10 pr-10 h-12 bg-[#F6F5F2] border-gray-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#2563A8] hover:bg-[#3674B5] text-white"
            >
              {t('login.login')}
            </Button>
          </form>
        </Tabs>

        {/* Divider */}
        <div className="relative">
          <Separator className="bg-gray-200" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
            {language === 'ko' ? '또는' : 'or'}
          </span>
        </div>

        {/* Social Login Options */}
        <div className="grid grid-cols-2 gap-3">
          {/* Kakao */}
          <Button
            type="button"
            variant="outline"
            className="h-11 bg-[#FEE500] hover:bg-[#FFD900] border-[#FEE500] hover:border-[#FFD900]"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <path d="M12 3C7.03 3 3 6.58 3 11c0 2.37 1.32 4.47 3.35 5.86-.14.58-.95 3.27-1.06 3.73-.13.54.19.53.4.38.16-.1 2.54-1.71 3.47-2.34.81.18 1.67.27 2.55.27 4.97 0 9-3.58 9-8s-4.03-8-9-8z" fill="#3C1E1E"/>
            </svg>
            <span className="text-sm text-gray-800">
              {language === 'ko' ? '카카오' : 'Kakao'}
            </span>
          </Button>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="h-11 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm text-gray-700">
              {language === 'ko' ? '구글' : 'Google'}
            </span>
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {language === 'ko' ? '계정이 없으신가요?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="text-[#2563A8] hover:text-[#3674B5] hover:underline"
            >
              {t('login.signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
