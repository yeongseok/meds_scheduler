import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Shield, 
  Smartphone, 
  Moon, 
  ChevronRight,
  Trash2,
  FileText,
  LogOut,
  Globe,
  LucideIcon
} from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useLanguage } from './LanguageContext';
import { SettingsTermsDialog } from './SettingsTermsDialog';
import { SettingsPrivacyDialog } from './SettingsPrivacyDialog';
import { useAuth, useSettings, deleteAllUserData, logOut as firebaseLogout } from '../lib';
import { toast } from 'sonner@2.0.3';

interface SettingsPageProps {
  onNavigateToProfile?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
  onLogout?: () => void;
  onTestAlarm?: () => void;
}

interface SettingItemProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
}

// Reusable Section Header Component
const SectionHeader = ({ icon: Icon, title }: SectionHeaderProps) => (
  <div className="py-[5px] px-4 border-b border-border">
    <h3 className="flex items-center space-x-2">
      <Icon size={18} />
      <span>{title}</span>
    </h3>
  </div>
);

// Reusable Setting Item Component
const SettingItem = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  onClick 
}: SettingItemProps) => (
  <div 
    className={`flex items-center justify-between py-[5px] px-4 ${onClick ? 'cursor-pointer hover:bg-accent rounded-lg' : ''}`}
    onClick={onClick}
  >
    <div className={`flex space-x-3 ${description ? 'items-start' : 'items-center'}`}>
      <Icon size={20} className={`text-muted-foreground ${description ? 'mt-0.5' : ''}`} />
      <div>
        <p className="font-medium text-base">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {action && <div>{action}</div>}
    {onClick && <ChevronRight size={18} className="text-muted-foreground" />}
  </div>
);

export function SettingsPage({ 
  onNavigateToProfile, 
  onNavigateToTerms, 
  onNavigateToPrivacy, 
  onLogout, 
  onTestAlarm 
}: SettingsPageProps) {
  const { t, language, setLanguage } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { 
    settings, 
    loading: settingsLoading, 
    updateNotifications,
    updateLanguage: updateLanguageDB,
    updateTheme
  } = useSettings(user?.uid);
  
  // State management
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync settings with UI state when loaded
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (settings) {
      setNotificationsEnabled(settings.notifications.enabled);
      setSoundEnabled(settings.notifications.sound);
      setVibrationEnabled(settings.notifications.vibration);
      setDarkMode(settings.theme === 'dark');
    }
  }, [settings]);

  // Update notification settings
  const handleNotificationsToggle = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    try {
      await updateNotifications({ enabled });
    } catch (error: any) {
      toast.error(
        language === 'ko'
          ? `설정 업데이트 실패: ${error.message}`
          : `Failed to update settings: ${error.message}`
      );
      setNotificationsEnabled(!enabled); // Revert on error
    }
  };

  const handleSoundToggle = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    try {
      await updateNotifications({ sound: enabled });
    } catch (error: any) {
      toast.error(
        language === 'ko'
          ? `설정 업데이트 실패: ${error.message}`
          : `Failed to update settings: ${error.message}`
      );
      setSoundEnabled(!enabled);
    }
  };

  const handleVibrationToggle = async (enabled: boolean) => {
    setVibrationEnabled(enabled);
    try {
      await updateNotifications({ vibration: enabled });
    } catch (error: any) {
      toast.error(
        language === 'ko'
          ? `설정 업데이트 실패: ${error.message}`
          : `Failed to update settings: ${error.message}`
      );
      setVibrationEnabled(!enabled);
    }
  };

  const handleLanguageChange = async (newLanguage: 'ko' | 'en') => {
    setLanguage(newLanguage);
    try {
      await updateLanguageDB(newLanguage);
    } catch (error: any) {
      toast.error(
        language === 'ko'
          ? `언어 설정 업데이트 실패: ${error.message}`
          : `Failed to update language: ${error.message}`
      );
      setLanguage(language); // Revert on error
    }
  };

  const handleDarkModeToggle = async (enabled: boolean) => {
    setDarkMode(enabled);
    try {
      await updateTheme(enabled ? 'dark' : 'light');
      toast.info(
        language === 'ko'
          ? '다크 모드는 향후 업데이트에서 지원될 예정입니다'
          : 'Dark mode will be supported in a future update'
      );
    } catch (error: any) {
      toast.error(
        language === 'ko'
          ? `테마 설정 업데이트 실패: ${error.message}`
          : `Failed to update theme: ${error.message}`
      );
      setDarkMode(!enabled);
    }
  };

  const handleDeleteData = async () => {
    if (!user) {
      toast.error(language === 'ko' ? '사용자 인증이 필요합니다' : 'User authentication required');
      return;
    }

    setIsDeleting(true);
    
    try {
      await deleteAllUserData(user.uid);
      toast.success(
        language === 'ko'
          ? '모든 데이터가 성공적으로 삭제되었습니다'
          : 'All data has been successfully deleted'
      );
      setShowDeleteDialog(false);
    } catch (error: any) {
      console.error('Error deleting data:', error);
      toast.error(
        language === 'ko'
          ? `데이터 삭제 실패: ${error.message}`
          : `Failed to delete data: ${error.message}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      toast.success(language === 'ko' ? '로그아웃되었습니다' : 'Logged out successfully');
      setShowLogoutDialog(false);
      onLogout?.();
    } catch (error: any) {
      toast.error(
        language === 'ko'
          ? `로그아웃 실패: ${error.message}`
          : `Failed to logout: ${error.message}`
      );
    }
  };

  const isLoading = authLoading || settingsLoading;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#3674B5] border-r-transparent"></div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Profile Section */}
            <Card>
              <SettingItem
                icon={User}
                title={t('settings.profile')}
                description={t('settings.viewProfile')}
                onClick={onNavigateToProfile}
              />
            </Card>

            {/* Notifications */}
            <Card className="space-y-0">
              <SectionHeader icon={Bell} title={t('settings.notifications')} />
              
              <SettingItem
                icon={Bell}
                title={t('settings.notifications')}
                action={
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationsToggle}
                  />
                }
              />
              
              {notificationsEnabled && (
                <>
                  <Separator />
                  <SettingItem
                    icon={Smartphone}
                    title={t('settings.sound')}
                    action={
                      <Switch
                        checked={soundEnabled}
                        onCheckedChange={handleSoundToggle}
                      />
                    }
                  />
                  
                  <Separator />
                  <SettingItem
                    icon={Smartphone}
                    title={t('settings.vibration')}
                    action={
                      <Switch
                        checked={vibrationEnabled}
                        onCheckedChange={handleVibrationToggle}
                      />
                    }
                  />
                  
                  {onTestAlarm && (
                    <>
                      <Separator />
                      <SettingItem
                        icon={Bell}
                        title={t('settings.testAlarm')}
                        description={t('settings.testAlarmDesc')}
                        onClick={onTestAlarm}
                      />
                    </>
                  )}
                </>
              )}
            </Card>

            {/* Language */}
            <Card className="space-y-0">
              <SectionHeader icon={Globe} title={t('settings.language')} />
              
              <SettingItem
                icon={Globe}
                title={t('settings.korean')}
                description="한국어"
                action={
                  <Switch
                    checked={language === 'ko'}
                    onCheckedChange={(checked) => handleLanguageChange(checked ? 'ko' : 'en')}
                  />
                }
              />
              
              <Separator />
              <SettingItem
                icon={Globe}
                title={t('settings.english')}
                description="English"
                action={
                  <Switch
                    checked={language === 'en'}
                    onCheckedChange={(checked) => handleLanguageChange(checked ? 'en' : 'ko')}
                  />
                }
              />
            </Card>

            {/* Appearance */}
            <Card className="space-y-0">
              <SectionHeader icon={Moon} title={t('settings.theme')} />
              
              <SettingItem
                icon={Moon}
                title={t('settings.darkMode')}
                description={t('settings.darkModeDesc')}
                action={
                  <Switch
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                  />
                }
              />
            </Card>

            {/* Data & Privacy */}
            <Card className="space-y-0">
              <SectionHeader icon={Shield} title={t('settings.data')} />
              
              <SettingItem
                icon={Trash2}
                title={t('settings.deleteAllData')}
                description={t('settings.deleteDataDesc')}
                onClick={() => setShowDeleteDialog(true)}
              />
            </Card>

            {/* Legal */}
            <Card className="space-y-0">
              <SectionHeader icon={FileText} title={t('settings.legal')} />
              
              <SettingItem
                icon={FileText}
                title={t('settings.terms')}
                onClick={onNavigateToTerms || (() => setShowTermsDialog(true))}
              />
              
              <Separator />
              <SettingItem
                icon={Shield}
                title={t('settings.privacy')}
                onClick={onNavigateToPrivacy || (() => setShowPrivacyDialog(true))}
              />
            </Card>

            {/* Logout */}
            <Card>
              <SettingItem
                icon={LogOut}
                title={t('settings.logout')}
                onClick={() => setShowLogoutDialog(true)}
              />
            </Card>

            {/* App Info */}
            <Card>
              <div className="p-4 text-center space-y-2">
                <h3>{language === 'ko' ? '약드세요' : 'MediRemind'}</h3>
                <p className="text-sm text-muted-foreground">{t('settings.version')} 1.0.0</p>
                <p className="text-xs text-muted-foreground">
                  {language === 'ko' ? '안전한 약 복용 관리를 위해 만들어졌습니다' : 'Built for safe medication management'}
                </p>
              </div>
            </Card>
          </>
        )}

        <div className="h-20"></div>
      </div>

      {/* Delete All Data Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
              onClick={handleDeleteData}
              disabled={isDeleting}
            >
              {isDeleting 
                ? (language === 'ko' ? '삭제 중...' : 'Deleting...')
                : t('common.delete')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terms of Service Dialog */}
      <SettingsTermsDialog 
        open={showTermsDialog} 
        onOpenChange={setShowTermsDialog} 
      />

      {/* Privacy Policy Dialog */}
      <SettingsPrivacyDialog 
        open={showPrivacyDialog} 
        onOpenChange={setShowPrivacyDialog} 
      />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.logout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.logoutConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              {t('settings.logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
