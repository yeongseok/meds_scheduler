import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useLanguage } from './LanguageContext';
import { useAuth, reauthenticateUser } from '../lib';
import { toast } from 'sonner@2.0.3';

interface UserAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: () => void;
  title?: string;
  description?: string;
}

export function UserAuthDialog({
  open,
  onOpenChange,
  onAuthenticated,
  title,
  description
}: UserAuthDialogProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = async () => {
    if (!user?.email) {
      toast.error(
        language === 'ko'
          ? '사용자 이메일을 찾을 수 없습니다'
          : 'User email not found'
      );
      return;
    }

    if (!password.trim()) {
      toast.error(
        language === 'ko'
          ? '비밀번호를 입력해주세요'
          : 'Please enter your password'
      );
      return;
    }

    setIsAuthenticating(true);

    try {
      await reauthenticateUser(user.email, password);
      
      // Authentication successful
      toast.success(
        language === 'ko'
          ? '인증되었습니다'
          : 'Authenticated successfully'
      );
      
      // Clear password and close dialog
      setPassword('');
      onOpenChange(false);
      
      // Call the authenticated callback
      onAuthenticated();
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Show user-friendly error message
      let errorMessage = '';
      
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = language === 'ko'
          ? '비밀번호가 올바르지 않습니다'
          : 'Incorrect password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = language === 'ko'
          ? '너무 많은 시도가 있었습니다. 나중에 다시 시도해주세요'
          : 'Too many attempts. Please try again later';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = language === 'ko'
          ? '네트워크 오류가 발생했습니다'
          : 'Network error occurred';
      } else {
        errorMessage = language === 'ko'
          ? `인증 실패: ${error.message}`
          : `Authentication failed: ${error.message}`;
      }
      
      toast.error(errorMessage);
      
      // Clear password on error
      setPassword('');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setShowPassword(false);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAuthenticating) {
      handleAuthenticate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="sm:max-w-md z-[9999]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="text-[#3674B5]" size={20} />
            {title || (language === 'ko' ? '사용자 인증' : 'User Authentication')}
          </DialogTitle>
          <DialogDescription>
            {description || (
              language === 'ko'
                ? '보안을 위해 비밀번호를 입력해주세요'
                : 'Please enter your password for security'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="auth-email" className="text-gray-700">
              {language === 'ko' ? '이메일' : 'Email'}
            </Label>
            <Input
              id="auth-email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50 border-gray-200"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="auth-password" className="text-gray-700">
              {language === 'ko' ? '비밀번호' : 'Password'}
            </Label>
            <div className="relative">
              <Input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAuthenticating}
                className="pr-10 border-gray-200 focus:border-brand-primary focus:ring-brand-primary/20"
                placeholder={language === 'ko' ? '비밀번호 입력' : 'Enter password'}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isAuthenticating}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              {language === 'ko'
                ? '보안을 위해 중요한 정보 변경 시 비밀번호 확인이 필요합니다.'
                : 'Password verification is required for security when changing important information.'
              }
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isAuthenticating}
            className="border-gray-200"
          >
            {language === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button
            onClick={handleAuthenticate}
            disabled={isAuthenticating || !password.trim()}
            className="bg-[#3674B5] hover:bg-[#2d5f99] text-white"
          >
            {isAuthenticating ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                {language === 'ko' ? '인증 중...' : 'Authenticating...'}
              </>
            ) : (
              <>
                <Lock size={18} className="mr-2" />
                {language === 'ko' ? '인증' : 'Authenticate'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
