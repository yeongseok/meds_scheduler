import React, { useState } from 'react';
import { ArrowLeft, Smartphone, CheckCircle, Lock, Eye, EyeOff, Mail, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { useLanguage } from './LanguageContext';
import { toast } from 'sonner@2.0.3';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

type Step = 'input' | 'code' | 'password' | 'success';
type Method = 'email' | 'phone';

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<Step>('input');
  const [method, setMethod] = useState<Method>('phone');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send verification code to email or phone
    setStep('code');
  };

  const handleResendCode = () => {
    // Resend verification code
    setCode('');
    toast.success(
      language === 'ko' 
        ? '인증번호가 다시 전송되었습니다' 
        : 'Verification code has been sent again',
      {
        description: language === 'ko' 
          ? `${currentValue}로 인증번호를 다시 보냈습니다` 
          : `Code sent to ${currentValue}`,
        duration: 3000,
      }
    );
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify code
    if (code.length === 6) {
      setStep('password');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset password
    if (password === confirmPassword && password.length >= 8) {
      setStep('success');
    }
  };

  const currentValue = method === 'email' ? email : phone;

  // Success Screen
  if (step === 'success') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="w-full max-w-md space-y-8">
          <Card className="bg-white border-gray-200 shadow-lg p-8 rounded-2xl text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#3674B5] flex items-center justify-center">
              <CheckCircle size={40} className="text-white" strokeWidth={2.5} />
            </div>
            
            <h2 className="mb-4">
              {language === 'ko' ? '비밀번호가 재설정되었습니다' : 'Password Reset Complete'}
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              {language === 'ko' 
                ? '새로운 비밀번호로 로그인하실 수 있습니다.'
                : 'You can now log in with your new password.'}
            </p>

            <Button
              onClick={onBackToLogin}
              className="w-full h-12 rounded-xl bg-[#2563A8] hover:bg-[#3674B5] text-white"
            >
              {language === 'ko' ? '로그인으로 돌아가기' : 'Return to Login'}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-[#3674B5] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{language === 'ko' ? '로그인으로 돌아가기' : 'Back to Login'}</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#E8F1FC] flex items-center justify-center mb-4">
            <Lock size={28} className="text-[#3674B5]" />
          </div>

          <h1 className="mb-2">
            {step === 'input' && (language === 'ko' ? '비밀번호 재설정' : 'Reset Password')}
            {step === 'code' && (language === 'ko' ? '인증번호 입력' : 'Enter Verification Code')}
            {step === 'password' && (language === 'ko' ? '새 비밀번호 설정' : 'Set New Password')}
          </h1>
          <p className="text-gray-600">
            {step === 'input' && (language === 'ko' 
              ? '선택하신 방법으로 입력하시면 인증번호를 보내드립니다.' 
              : 'Enter your email or phone number and we will send you a verification code.')}
            {step === 'code' && (language === 'ko' 
              ? `${currentValue}로 전송된 6자리 인증번호를 입력하세요.` 
              : `Enter the 6-digit code sent to ${currentValue}.`)}
            {step === 'password' && (language === 'ko' 
              ? '새로운 비밀번호를 입력해주세요.' 
              : 'Enter your new password.')}
          </p>
        </div>

        {/* Reset Card */}
        <Card className="bg-white border-gray-200 shadow-lg p-6 rounded-2xl">
          {/* Step 1: Email or Phone Input */}
          {step === 'input' && (
            <form onSubmit={handleInputSubmit} className="space-y-5">
              {/* Method Tabs */}
              <Tabs value={method} onValueChange={(value) => setMethod(value as Method)}>
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#F6F5F2]">
                  <TabsTrigger value="phone" className="data-[state=active]:bg-white">
                    {language === 'ko' ? '휴대전화' : 'Phone'}
                  </TabsTrigger>
                  <TabsTrigger value="email" className="data-[state=active]:bg-white">
                    {language === 'ko' ? '이메일' : 'Email'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="phone" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">{language === 'ko' ? '휴대전화 번호' : 'Phone Number'}</label>
                    <div className="relative">
                      <Smartphone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={language === 'ko' ? '010-0000-0000' : '010-0000-0000'}
                        className="pl-10 h-12 bg-[#F6F5F2] border-gray-200"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">{language === 'ko' ? '이메일 주소' : 'Email Address'}</label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={language === 'ko' ? 'your.email@example.com' : 'your.email@example.com'}
                        className="pl-10 h-12 bg-[#F6F5F2] border-gray-200"
                        required
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#2563A8] hover:bg-[#3674B5] text-white"
              >
                {language === 'ko' ? '인증번호 받기' : 'Send Verification Code'}
              </Button>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm text-gray-700 block text-center">
                  {language === 'ko' ? '인증번호 6자리' : '6-Digit Verification Code'}
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="w-12 h-12 rounded-lg border-gray-200" />
                      <InputOTPSlot index={1} className="w-12 h-12 rounded-lg border-gray-200" />
                      <InputOTPSlot index={2} className="w-12 h-12 rounded-lg border-gray-200" />
                      <InputOTPSlot index={3} className="w-12 h-12 rounded-lg border-gray-200" />
                      <InputOTPSlot index={4} className="w-12 h-12 rounded-lg border-gray-200" />
                      <InputOTPSlot index={5} className="w-12 h-12 rounded-lg border-gray-200" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {language === 'ko' ? '인증번호가 오지 않았나요?' : "Didn't receive the code?"}{' '}
                  <button 
                    type="button" 
                    onClick={handleResendCode}
                    className="text-[#2563A8] hover:text-[#3674B5] hover:underline transition-colors"
                  >
                    {language === 'ko' ? '재전송' : 'Resend'}
                  </button>
                </p>
              </div>

              <Button
                type="submit"
                disabled={code.length !== 6}
                className="w-full h-12 rounded-xl bg-[#2563A8] hover:bg-[#3674B5] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'ko' ? '확인' : 'Verify Code'}
              </Button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-gray-700">{language === 'ko' ? '새 비밀번호' : 'New Password'}</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'ko' ? '8자 이상 입력' : 'Minimum 8 characters'}
                    className="pl-10 pr-10 h-12 bg-[#F6F5F2] border-gray-200"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {password && password.length > 0 && password.length < 8 && (
                  <p className="text-xs text-amber-600">{language === 'ko' ? '최소 8자 이상 입력하세요' : 'Minimum 8 characters required'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-700">{language === 'ko' ? '비밀번호 확인' : 'Confirm Password'}</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={language === 'ko' ? '비밀번호 재입력' : 'Re-enter password'}
                    className="pl-10 pr-10 h-12 bg-[#F6F5F2] border-gray-200"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-rose-500">{language === 'ko' ? '비밀번호가 일치하지 않습니다' : 'Passwords do not match'}</p>
                )}
                {password && confirmPassword && password === confirmPassword && password.length >= 8 && (
                  <p className="text-xs text-emerald-600">{language === 'ko' ? '비밀번호가 일치합니다' : 'Passwords match'}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!password || !confirmPassword || password !== confirmPassword || password.length < 8}
                className="w-full h-12 rounded-xl bg-[#2563A8] hover:bg-[#3674B5] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'ko' ? '비밀번호 재설정' : 'Reset Password'}
              </Button>
            </form>
          )}
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {language === 'ko' ? '비밀번호가 기억나셨나요?' : 'Remember your password?'}{' '}
            <button
              onClick={onBackToLogin}
              className="text-[#2563A8] hover:text-[#3674B5] hover:underline"
            >
              {language === 'ko' ? '로그인하기' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
