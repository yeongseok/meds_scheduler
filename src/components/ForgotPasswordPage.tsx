import React, { useState } from 'react';
import { Mail, ArrowLeft, Smartphone, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useLanguage } from './LanguageContext';
import { resetPassword } from '../lib/firebase/auth';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedIdentifier, setSubmittedIdentifier] = useState('');
  const [submittedMethod, setSubmittedMethod] = useState<'email' | 'phone'>('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'phone') {
      setError(
        language === 'ko'
          ? '전화번호로 비밀번호를 재설정하는 기능은 준비 중이에요.'
          : 'Password reset via phone is coming soon.'
      );
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await resetPassword(email);
      setSubmittedIdentifier(email);
      setSubmittedMethod('email');
      setIsSubmitted(true);
    } catch (resetError: unknown) {
      const fallbackMessage =
        language === 'ko'
          ? '비밀번호 재설정 메일을 보내지 못했어요. 다시 시도해주세요.'
          : 'Unable to send the reset email. Please try again.';
      const message = resetError instanceof Error ? resetError.message : fallbackMessage;
      setError(message || fallbackMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-12 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-ping"></div>
        </div>

        {/* Success Content */}
        <div className="w-full max-w-md px-6 z-10">
          <Card className="bg-white/80 backdrop-blur-lg border-none shadow-2xl p-8 rounded-3xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <CheckCircle size={40} className="text-white" />
            </div>

            <h2 className="mb-4">
              {submittedMethod === 'email'
                ? language === 'ko'
                  ? '이메일을 확인해주세요'
                  : 'Check your email'
                : language === 'ko'
                  ? '휴대폰을 확인해주세요'
                  : 'Check your phone'}
            </h2>

            <p className="text-gray-600 mb-8">
              <span className="text-amber-600">{submittedIdentifier}</span>{' '}
              {submittedMethod === 'email'
                ? language === 'ko'
                  ? '로 비밀번호 재설정 링크를 보냈어요. 받은 메일에서 안내를 따라 재설정해주세요.'
                  : 'has been sent a password reset link. Follow the instructions in the email to reset your password.'
                : language === 'ko'
                  ? '로 메시지를 보냈어요. 안내를 따라 비밀번호를 재설정해주세요.'
                  : 'has been sent a message. Follow the instructions to reset your password.'}
            </p>

            <Button
              onClick={onBackToLogin}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {language === 'ko' ? '로그인으로 돌아가기' : 'Back to Login'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-12 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-48 right-20 w-28 h-28 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md px-6 z-10">
        {/* Back Button */}
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{language === 'ko' ? '로그인으로 돌아가기' : 'Back to Login'}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2">
            {language === 'ko' ? '비밀번호를 잊으셨나요?' : 'Forgot your password?'}
          </h1>
          <p className="text-gray-600">
            {language === 'ko'
              ? '걱정하지 마세요. 이메일 또는 휴대폰 번호를 입력하시면 비밀번호 재설정 방법을 보내드립니다.'
              : "Don't worry. Enter your email or phone number and we'll send instructions to reset your password."}
          </p>
        </div>

        {/* Reset Card */}
        <Card className="bg-white/80 backdrop-blur-lg border-none shadow-2xl p-6 rounded-3xl">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'email' | 'phone')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email">{language === 'ko' ? '이메일' : 'Email'}</TabsTrigger>
              <TabsTrigger value="phone">{language === 'ko' ? '휴대폰' : 'Phone'}</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-5">
              <TabsContent value="email" className="space-y-5 mt-0">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">
                    {language === 'ko' ? '이메일 주소' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 bg-white/50"
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-5 mt-0">
                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700">
                    {language === 'ko' ? '휴대폰 번호' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Smartphone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={language === 'ko' ? '010-0000-0000' : '+1 (555) 000-0000'}
                      className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 bg-white/50"
                      required
                    />
                  </div>
                </div>
              </TabsContent>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {language === 'ko' ? '재설정 링크 보내기' : 'Send Reset Link'}
              </Button>
            </form>
          </Tabs>
        </Card>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {language === 'ko' ? '비밀번호가 기억나셨나요?' : 'Remembered your password?'}{' '}
            <button
              onClick={onBackToLogin}
              className="text-amber-600 hover:text-amber-700 hover:underline"
            >
              {language === 'ko' ? '로그인하기' : 'Back to Login'}
            </button>
          </p>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 opacity-30">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="url(#forgotGradient)"
            fillOpacity="1"
            d="M0,160L48,154.7C96,149,192,139,288,154.7C384,171,480,213,576,213.3C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="forgotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
