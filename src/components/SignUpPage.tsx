import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Smartphone, ArrowLeft, Heart, Shield, Pill, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { useLanguage } from './LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface SignUpPageProps {
  onBackToLogin: () => void;
  onSignUp: () => void;
}

export function SignUpPage({ onBackToLogin, onSignUp }: SignUpPageProps) {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPasswordMismatchDialog, setShowPasswordMismatchDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (password !== confirmPassword) {
      setShowPasswordMismatchDialog(true);
      return;
    }
    
    if (!agreeTerms) {
      setShowTermsDialog(true);
      return;
    }
    
    // In real app, this would create account
    onSignUp();
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-12 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-ping"></div>
        <div className="absolute bottom-48 right-20 w-28 h-28 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md px-6 z-10 py-8 overflow-y-auto h-screen">
        {/* Back Button */}
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{language === 'ko' ? '로그인으로 돌아가기' : 'Back to Login'}</span>
        </button>

        {/* App Logo & Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center shadow-2xl">
              <Pill size={40} className="text-white" />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center animate-bounce">
              <Heart size={14} className="text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center animate-pulse">
              <Shield size={14} className="text-white" />
            </div>
          </div>
          
          <h1 className="mb-2">{language === 'ko' ? '계정 만들기' : 'Create Account'}</h1>
          <p className="text-gray-600">
            {language === 'ko' ? '메디케어에 가입하여 약을 관리하세요' : 'Join MediCare to manage your medications'}
          </p>
        </div>

        {/* Sign Up Card */}
        <Card className="bg-white/80 backdrop-blur-lg border-none shadow-2xl p-6 rounded-3xl mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">{language === 'ko' ? '이름' : 'Name'}</label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'ko' ? '홍길동' : 'John Doe'}
                  className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">{language === 'ko' ? '이메일 주소' : 'Email Address'}</label>
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

            {/* Phone Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">
                {language === 'ko' ? '휴대전화 번호 (선택사항)' : 'Phone Number (Optional)'}
              </label>
              <div className="relative">
                <Smartphone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={language === 'ko' ? '010-0000-0000' : '+1 (555) 000-0000'}
                  className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 bg-white/50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">{language === 'ko' ? '비밀번호' : 'Password'}</label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'ko' ? '강력한 비밀번호를 만드세요' : 'Create a strong password'}
                  className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700">
                {language === 'ko' ? '비밀번호 확인' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={language === 'ko' ? '비밀번호를 다시 입력하세요' : 'Re-enter your password'}
                  className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                {language === 'ko' ? (
                  <>
                    <button type="button" className="text-amber-600 hover:underline">
                      이용약관
                    </button>
                    {' '}및{' '}
                    <button type="button" className="text-amber-600 hover:underline">
                      개인정보 처리방침
                    </button>
                    에 동의합니다
                  </>
                ) : (
                  <>
                    I agree to the{' '}
                    <button type="button" className="text-amber-600 hover:underline">
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button type="button" className="text-amber-600 hover:underline">
                      Privacy Policy
                    </button>
                  </>
                )}
              </label>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
            >
              {language === 'ko' ? '계정 만들기' : 'Create Account'}
            </Button>
          </form>
        </Card>

        {/* Already have account link */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {language === 'ko' ? '이미 계정이 있으신가요?' : 'Already have an account?'}{' '}
            <button
              onClick={onBackToLogin}
              className="text-amber-600 hover:text-amber-700 hover:underline"
            >
              {language === 'ko' ? '로그인하기' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Quick Sign Up Options */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 text-sm text-gray-500">
                {language === 'ko' ? '또는 다음으로 가입' : 'Or sign up with'}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Kakao */}
            <button className="h-12 rounded-2xl bg-[#FEE500] hover:bg-[#FFD900] border border-gray-200 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C7.03 3 3 6.58 3 11c0 2.37 1.32 4.47 3.35 5.86-.14.58-.95 3.27-1.06 3.73-.13.54.19.53.4.38.16-.1 2.54-1.71 3.47-2.34.81.18 1.67.27 2.55.27 4.97 0 9-3.58 9-8s-4.03-8-9-8z" fill="#3C1E1E"/>
              </svg>
              <span className="text-sm text-gray-800">
                {language === 'ko' ? '카카오' : 'Kakao'}
              </span>
            </button>

            {/* Google */}
            <button className="h-12 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
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
              <span className="text-sm text-gray-700">
                {language === 'ko' ? '구글' : 'Google'}
              </span>
            </button>

            {/* Email */}
            <button className="h-12 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <Mail size={20} className="text-amber-600" />
              <span className="text-sm text-gray-700">
                {language === 'ko' ? '이메일' : 'Email'}
              </span>
            </button>

            {/* Phone */}
            <button className="h-12 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <Smartphone size={20} className="text-emerald-600" />
              <span className="text-sm text-gray-700">
                {language === 'ko' ? '전화번호' : 'Phone'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 opacity-30 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="url(#signupGradient)"
            fillOpacity="1"
            d="M0,160L48,154.7C96,149,192,139,288,154.7C384,171,480,213,576,213.3C672,213,768,171,864,138.7C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="signupGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="33%" stopColor="#f97316" />
              <stop offset="66%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Terms and Conditions Alert Dialog */}
      <AlertDialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <AlertDialogContent className="max-w-sm mx-4 rounded-3xl bg-white/95 backdrop-blur-lg border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <AlertCircle size={32} className="text-white" />
            </div>
            <AlertDialogTitle className="text-center">
              {language === 'ko' ? '이용약관 동의 필요' : 'Terms Agreement Required'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {language === 'ko' 
                ? '계정을 만들려면 이용약관에 동의해 주세요. 메디케어에 가입하기 전에 정책을 확인해 주시기 바랍니다.'
                : 'Please agree to the terms and conditions to create an account. Review our policies before joining MediCare.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={() => setShowTermsDialog(false)}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white shadow-lg"
            >
              {language === 'ko' ? '확인' : 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Mismatch Alert Dialog */}
      <AlertDialog open={showPasswordMismatchDialog} onOpenChange={setShowPasswordMismatchDialog}>
        <AlertDialogContent className="max-w-sm mx-4 rounded-3xl bg-white/95 backdrop-blur-lg border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
              <AlertCircle size={32} className="text-white" />
            </div>
            <AlertDialogTitle className="text-center">
              {language === 'ko' ? '비밀번호가 일치하지 않습니다' : 'Passwords Do Not Match'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {language === 'ko'
                ? '입력하신 비밀번호가 일치하지 않습니다. 두 비밀번호 필드에 동일한 비밀번호를 입력했는지 확인해 주세요.'
                : 'The passwords you entered do not match. Please make sure both password fields contain the same password.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={() => setShowPasswordMismatchDialog(false)}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white shadow-lg"
            >
              {language === 'ko' ? '다시 시도' : 'Try Again'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
