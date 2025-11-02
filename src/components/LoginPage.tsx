import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Heart, Shield, Pill, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useLanguage } from './LanguageContext';
import { signInWithEmail, signInWithGoogle } from '../lib/firebase/auth';

interface LoginPageProps {
  onLogin: () => void;
  onNavigateToSignUp?: () => void;
  onNavigateToForgotPassword?: () => void;
}

export function LoginPage({ onLogin, onNavigateToSignUp, onNavigateToForgotPassword }: LoginPageProps) {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await signInWithEmail(email, password);
      onLogin();
    } catch (authError: unknown) {
      const fallbackMessage = language === 'ko' ? '로그인에 실패했어요. 다시 시도해주세요.' : 'Unable to sign in. Please try again.';
      const message = authError instanceof Error ? authError.message : fallbackMessage;
      setError(message || fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setGoogleLoading(true);
      await signInWithGoogle();
      onLogin();
    } catch (authError: unknown) {
      const fallbackMessage = language === 'ko' ? '구글 로그인에 실패했어요. 다시 시도해주세요.' : 'Unable to sign in with Google. Please try again.';
      const message = authError instanceof Error ? authError.message : fallbackMessage;
      setError(message || fallbackMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-12 w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-48 right-20 w-28 h-28 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md px-6 z-10">
        {/* App Logo & Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center shadow-2xl">
              <Pill size={48} className="text-white" />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center animate-bounce">
              <Heart size={18} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center animate-pulse">
              <Shield size={18} className="text-white" />
            </div>
          </div>
          
          <h1 className="mb-2 text-3xl">
            <span className="text-amber-600">{language === 'ko' ? '메디' : 'Medi'}</span>
            <span className="text-emerald-500">{language === 'ko' ? '케어' : 'Care'}</span>
          </h1>
          <p className="text-gray-600 text-base">
            {language === 'ko' ? '다시 오신 것을 환영합니다! 로그인해주세요' : 'Welcome back! Please sign in'}
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white/80 backdrop-blur-lg border-none shadow-2xl p-6 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-base text-gray-700 text-[16px]">
                {language === 'ko' ? '이메일 주소' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 bg-white/50 text-base"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-base text-gray-700 text-[16px]">
                {language === 'ko' ? '비밀번호' : 'Password'}
              </label>
              <div className="relative">
                <Lock size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'ko' ? '비밀번호를 입력하세요' : 'Enter your password'}
                  className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 bg-white/50 text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-base text-amber-600 hover:text-amber-700 hover:underline"
              >
                {language === 'ko' ? '비밀번호를 잊으셨나요?' : 'Forgot your password?'}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-base"
            >
              {t('login.signIn')}
            </Button>
          </form>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-base">
            {language === 'ko' ? '계정이 없으신가요?' : "Don't have an account?"}{' '}
            <button
              onClick={onNavigateToSignUp}
              className="text-amber-600 hover:text-amber-700 hover:underline text-base"
            >
              {t('login.signUp')}
            </button>
          </p>
        </div>

        {/* Quick Login Options */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-sm text-gray-500 text-[14px]">
                {language === 'ko' ? '또는 다음으로 계속하기' : 'Or continue with'}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Kakao */}
            <button className="h-12 rounded-2xl bg-[#FEE500] hover:bg-[#FFD900] border border-gray-200 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C7.03 3 3 6.58 3 11c0 2.37 1.32 4.47 3.35 5.86-.14.58-.95 3.27-1.06 3.73-.13.54.19.53.4.38.16-.1 2.54-1.71 3.47-2.34.81.18 1.67.27 2.55.27 4.97 0 9-3.58 9-8s-4.03-8-9-8z" fill="#3C1E1E"/>
              </svg>
              <span className="text-sm text-gray-800 text-[14px]">
                {language === 'ko' ? '카카오' : 'Kakao'}
              </span>
            </button>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="h-12 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm text-gray-700 text-[14px]">
                {language === 'ko' ? '구글' : 'Google'}
              </span>
            </button>

            {/* Email */}
            <button className="h-12 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <Mail size={20} className="text-amber-600" />
              <span className="text-sm text-gray-700 text-[14px]">
                {language === 'ko' ? '이메일' : 'Email'}
              </span>
            </button>

            {/* Phone */}
            <button className="h-12 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <Smartphone size={20} className="text-emerald-600" />
              <span className="text-sm text-gray-700 text-[14px]">
                {language === 'ko' ? '휴대폰' : 'Phone'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 opacity-30">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="url(#loginGradient)"
            fillOpacity="1"
            d="M0,160L48,154.7C96,149,192,139,288,154.7C384,171,480,213,576,213.3C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="loginGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="33%" stopColor="#f97316" />
              <stop offset="66%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
