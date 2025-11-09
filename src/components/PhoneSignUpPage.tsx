import React, { useState } from 'react';
import { Smartphone, Lock, Eye, EyeOff, ArrowLeft, User, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useLanguage } from './LanguageContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface PhoneSignUpPageProps {
  onBack: () => void;
  onSignUp: () => void;
}

export function PhoneSignUpPage({ onBack, onSignUp }: PhoneSignUpPageProps) {
  const { language } = useLanguage();
  const [step, setStep] = useState<'info' | 'verify'>('info');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [showPasswordMismatchDialog, setShowPasswordMismatchDialog] = useState(false);
  const [showInvalidPhoneDialog, setShowInvalidPhoneDialog] = useState(false);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format based on language
    if (language === 'ko') {
      // Korean format: 010-1234-5678
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    } else {
      // US format: (555) 123-4567
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const numbers = phoneNumber.replace(/\D/g, '');
    if (language === 'ko') {
      // Korean phone numbers: 10-11 digits starting with 010
      return numbers.length >= 10 && numbers.length <= 11 && numbers.startsWith('010');
    } else {
      // US phone numbers: 10 digits
      return numbers.length === 10;
    }
  };

  const handleSendVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      setShowInvalidPhoneDialog(true);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setShowPasswordMismatchDialog(true);
      return;
    }

    // In real app, send SMS verification code
    console.log('Sending SMS verification to:', phone);
    setStep('verify');
  };

  const handleVerifyAndSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      return;
    }

    // In real app, verify code and create account
    console.log('Verifying code:', verificationCode);
    onSignUp();
  };

  const handleResendCode = () => {
    setIsResending(true);
    // In real app, resend SMS verification code
    console.log('Resending SMS verification code');
    setTimeout(() => {
      setIsResending(false);
    }, 2000);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      {/* Main Content */}
      <div className="w-full max-w-md px-6 z-10 py-8 overflow-y-auto h-screen">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#3674B5] mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{language === 'ko' ? '뒤로 가기' : 'Back'}</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#E8F1FC] flex items-center justify-center">
            <Smartphone size={40} className="text-[#3674B5]" />
          </div>
          <h1 className="mb-2">
            {language === 'ko' ? '휴대전화로 가입' : 'Sign Up with Phone'}
          </h1>
          <p className="text-gray-600">
            {step === 'info' 
              ? (language === 'ko' ? '계정 정보를 입력하세요' : 'Enter your account information')
              : (language === 'ko' ? 'SMS로 전송된 인증 코드를 입력하세요' : 'Enter the verification code sent via SMS')}
          </p>
        </div>

        {step === 'info' ? (
          /* Step 1: Account Information */
          <Card className="bg-white border-gray-200 shadow-lg p-6 rounded-2xl mb-6">
            <form onSubmit={handleSendVerification} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">
                  {language === 'ko' ? '이름' : 'Name'}
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'ko' ? '홍길동' : 'John Doe'}
                    className="pl-10 h-12 bg-[#F6F5F2] border-gray-200"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">
                  {language === 'ko' ? '휴대전화 번호' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Smartphone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder={language === 'ko' ? '010-1234-5678' : '(555) 123-4567'}
                    className="pl-10 h-12 bg-[#F6F5F2] border-gray-200"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 px-1">
                  {language === 'ko' 
                    ? 'SMS 인증을 위해 사용됩니다' 
                    : 'Used for SMS verification'}
                </p>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">
                  {language === 'ko' ? '비밀번호' : 'Password'}
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'ko' ? '8자 이상 입력하세요' : 'At least 8 characters'}
                    className="pl-10 pr-10 h-12 bg-[#F6F5F2] border-gray-200"
                    required
                    minLength={8}
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

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm text-gray-700">
                  {language === 'ko' ? '비밀번호 확인' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={language === 'ko' ? '비밀번호를 다시 입력하세요' : 'Re-enter your password'}
                    className="pl-10 pr-10 h-12 bg-[#F6F5F2] border-gray-200"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#2563A8] hover:bg-[#3674B5] text-white mt-6"
              >
                {language === 'ko' ? '인증 코드 전송' : 'Send Verification Code'}
              </Button>
            </form>
          </Card>
        ) : (
          /* Step 2: SMS Verification */
          <Card className="bg-white border-gray-200 shadow-lg p-6 rounded-2xl mb-6">
            <form onSubmit={handleVerifyAndSignUp} className="space-y-6">
              {/* Phone Display */}
              <div className="text-center p-4 bg-[#E8F1FC] rounded-xl">
                <p className="text-sm text-gray-600 mb-1">
                  {language === 'ko' ? 'SMS로 인증 코드를 전송했습니다' : 'Verification code sent via SMS to'}
                </p>
                <p className="text-gray-800">{phone}</p>
              </div>

              {/* OTP Input */}
              <div className="space-y-3">
                <label className="text-sm text-gray-700 text-center block">
                  {language === 'ko' ? '인증 코드 (6자리)' : 'Verification Code (6 digits)'}
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
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
              </div>

              {/* SMS Notice */}
              <div className="text-center p-3 bg-[#F6F5F2] rounded-xl">
                <p className="text-xs text-gray-600">
                  {language === 'ko' 
                    ? '⚠️ SMS 수신까지 최대 1분이 소요될 수 있습니다' 
                    : '⚠️ SMS may take up to 1 minute to arrive'}
                </p>
              </div>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  {language === 'ko' ? '코드를 받지 못하셨나요?' : "Didn't receive the code?"}
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-[#2563A8] hover:text-[#3674B5] hover:underline disabled:opacity-50"
                >
                  {isResending 
                    ? (language === 'ko' ? '전송 중...' : 'Sending...')
                    : (language === 'ko' ? '코드 재전송' : 'Resend Code')}
                </button>
              </div>

              {/* Verify and Sign Up Button */}
              <Button
                type="submit"
                disabled={verificationCode.length !== 6}
                className="w-full h-12 rounded-xl bg-[#2563A8] hover:bg-[#3674B5] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'ko' ? '인증하고 가입하기' : 'Verify and Sign Up'}
              </Button>

              {/* Back to edit */}
              <button
                type="button"
                onClick={() => setStep('info')}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
              >
                {language === 'ko' ? '전화번호 변경하기' : 'Change phone number'}
              </button>
            </form>
          </Card>
        )}

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>

      {/* Password Mismatch Dialog */}
      <AlertDialog open={showPasswordMismatchDialog} onOpenChange={setShowPasswordMismatchDialog}>
        <AlertDialogContent className="max-w-sm mx-4 rounded-2xl bg-white border-gray-200 shadow-lg">
          <AlertDialogHeader>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500 flex items-center justify-center">
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
              className="w-full rounded-xl bg-[#2563A8] hover:bg-[#3674B5] text-white"
            >
              {language === 'ko' ? '확인' : 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invalid Phone Dialog */}
      <AlertDialog open={showInvalidPhoneDialog} onOpenChange={setShowInvalidPhoneDialog}>
        <AlertDialogContent className="max-w-sm mx-4 rounded-2xl bg-white border-gray-200 shadow-lg">
          <AlertDialogHeader>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500 flex items-center justify-center">
              <AlertCircle size={32} className="text-white" />
            </div>
            <AlertDialogTitle className="text-center">
              {language === 'ko' ? '유효하지 않은 전화번호' : 'Invalid Phone Number'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {language === 'ko'
                ? '올바른 휴대전화 번호를 입력해 주세요. (예: 010-1234-5678)'
                : 'Please enter a valid phone number. (e.g., (555) 123-4567)'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={() => setShowInvalidPhoneDialog(false)}
              className="w-full rounded-xl bg-[#2563A8] hover:bg-[#3674B5] text-white"
            >
              {language === 'ko' ? '확인' : 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
