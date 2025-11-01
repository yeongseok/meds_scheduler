import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  Shield, 
  Smartphone, 
  Moon, 
  ChevronRight,
  Trash2,
  FileText,
  X,
  LogOut,
  Globe
} from 'lucide-react';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { useLanguage } from './LanguageContext';

interface SettingsPageProps {
  onNavigateToProfile?: () => void;
  onLogout?: () => void;
  onTestAlarm?: () => void;
}

export function SettingsPage({ onNavigateToProfile, onLogout, onTestAlarm }: SettingsPageProps) {
  const { t, language, setLanguage } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    action, 
    onClick 
  }: {
    icon: any;
    title: string;
    description?: string;
    action?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div 
      className={`flex items-center justify-between p-4 ${onClick ? 'cursor-pointer hover:bg-accent rounded-lg' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <Icon size={22} className="text-muted-foreground" />
        <div>
          <p className="font-medium text-base">{title}</p>
          {description && (
            <p className="text-base text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
      {onClick && <ChevronRight size={18} className="text-muted-foreground" />}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

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
          <div className="p-4 border-b border-border">
            <h3 className="flex items-center space-x-2">
              <Bell size={18} />
              <span>{t('settings.notifications')}</span>
            </h3>
          </div>
          
          <SettingItem
            icon={Bell}
            title={t('settings.notifications')}
            description={t('settings.notificationsDesc')}
            action={
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            }
          />
          
          {notificationsEnabled && (
            <>
              <Separator />
              <SettingItem
                icon={Smartphone}
                title={t('settings.sound')}
                description={t('settings.soundDesc')}
                action={
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                }
              />
              
              <Separator />
              <SettingItem
                icon={Smartphone}
                title={t('settings.vibration')}
                description={t('settings.vibrationDesc')}
                action={
                  <Switch
                    checked={vibrationEnabled}
                    onCheckedChange={setVibrationEnabled}
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
          <div className="p-4 border-b border-border">
            <h3 className="flex items-center space-x-2">
              <Globe size={18} />
              <span>{t('settings.language')}</span>
            </h3>
          </div>
          
          <SettingItem
            icon={Globe}
            title={t('settings.korean')}
            description="한국어"
            action={
              <Switch
                checked={language === 'ko'}
                onCheckedChange={(checked) => setLanguage(checked ? 'ko' : 'en')}
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
                onCheckedChange={(checked) => setLanguage(checked ? 'en' : 'ko')}
              />
            }
          />
        </Card>

        {/* Appearance */}
        <Card className="space-y-0">
          <div className="p-4 border-b border-border">
            <h3 className="flex items-center space-x-2">
              <Moon size={18} />
              <span>{t('settings.theme')}</span>
            </h3>
          </div>
          
          <SettingItem
            icon={Moon}
            title={t('settings.darkMode')}
            description={t('settings.darkModeDesc')}
            action={
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            }
          />
        </Card>

        {/* Data & Privacy */}
        <Card className="space-y-0">
          <div className="p-4 border-b border-border">
            <h3 className="flex items-center space-x-2">
              <Shield size={18} />
              <span>{t('settings.data')}</span>
            </h3>
          </div>
          
          <SettingItem
            icon={Trash2}
            title={t('settings.deleteAllData')}
            description={t('settings.deleteDataDesc')}
            onClick={() => setShowDeleteDialog(true)}
          />
        </Card>

        {/* Legal */}
        <Card className="space-y-0">
          <div className="p-4 border-b border-border">
            <h3 className="flex items-center space-x-2">
              <FileText size={18} />
              <span>{t('settings.legal')}</span>
            </h3>
          </div>
          
          <SettingItem
            icon={FileText}
            title={t('settings.terms')}
            onClick={() => setShowTermsDialog(true)}
          />
          
          <Separator />
          <SettingItem
            icon={Shield}
            title={t('settings.privacy')}
            onClick={() => setShowPrivacyDialog(true)}
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
            <h3>{language === 'ko' ? '메디리마인드' : 'MediRemind'}</h3>
            <p className="text-sm text-muted-foreground">{t('settings.version')} 1.0.0</p>
            <p className="text-xs text-muted-foreground">
              {language === 'ko' ? '안전한 약 복용 관리를 위해 만들어졌습니다' : 'Built for safe medication management'}
            </p>
          </div>
        </Card>

        {/* Bottom spacing for navigation */}
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
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                // Handle delete logic here
                console.log('Deleting all data...');
              }}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Terms of Service Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>서비스 이용약관</DialogTitle>
            <DialogDescription>
              메디리마인드 서비스 이용에 대한 약관 및 조건을 확인하세요.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="mb-2">1. 약관 동의</h3>
                <p className="text-muted-foreground">
                  메디리마인드에 접속하고 사용함으로써 본 약관의 조항에 동의하고 구속되는 것에 동의합니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">2. 사용 라이선스</h3>
                <p className="text-muted-foreground">
                  메디리마인드를 개인적, 비상업적 용도로만 일시적으로 사용할 수 있는 권한이 부여됩니다. 이러한 제한 사항을 위반하면 이 라이선스는 자동으로 종료됩니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">3. 의료 면책조항</h3>
                <p className="text-muted-foreground">
                  메디리마인드는 약 복용 알림 도구이며 의학적 조언으로 간주되어서는 안 됩니다. 약물 및 치료 계획에 관해서는 항상 자격을 갖춘 의료 제공자와 상담하십시오. 이 앱은 전문적인 의학적 조언, 진단 또는 치료를 대체하지 않습니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">4. 사용자 책임</h3>
                <p className="text-muted-foreground">
                  앱에 입력한 약물 정보의 정확성을 유지할 책임은 사용자에게 있습니다. 모든 약물 일정, 복용량 및 알림이 정확한지 확인해야 합니다. 앱 개발자는 약물 관리의 오류나 누락에 대해 책임을 지지 않습니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">5. 데이터 정확성</h3>
                <p className="text-muted-foreground">
                  정확하고 신뢰할 수 있는 서비스를 제공하기 위해 노력하지만, 앱이 오류 없이 또는 중단 없이 작동할 것이라고 보장하지 않습니다. 기기 설정, 네트워크 문제 또는 기타 기술적 요인으로 인해 알림이 항상 정시에 전달되지 않을 수 있음을 인정합니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">6. 책임의 제한</h3>
                <p className="text-muted-foreground">
                  어떠한 경우에도 메디리마인드 또는 그 개발자는 앱의 사용 또는 사용 불능으로 인해 발생하는 손해(데이터 또는 이익의 손실, 약물 오류로 인한 손해를 포함하되 이에 국한되지 않음)에 대해 책임을 지지 않습니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">7. 수정</h3>
                <p className="text-muted-foreground">
                  당사는 언제든지 본 약관을 수정하거나 대체할 권리를 보유합니다. 그러한 변경 후에도 앱을 계속 사용하는 것은 그러한 변경에 동의하는 것으로 간주됩니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">8. 연락처 정보</h3>
                <p className="text-muted-foreground">
                  본 서비스 이용약관에 대해 질문이 있으시면 앱의 피드백 기능을 통해 문의해 주시기 바랍니다.
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>개인정보 처리방침</DialogTitle>
            <DialogDescription>
              개인정보 수집, 사용 및 보호 방법에 대한 정책을 확인하세요.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="mb-2">1. 수집하는 정보</h3>
                <p className="text-muted-foreground">
                  메디리마인드는 사용자가 자발적으로 제공하는 약물 정보(약물명, 복용량, 일정 및 관련 메모)를 수집하고 저장합니다. 모든 데이터는 기기에 로컬로 저장됩니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">2. 정보 사용 방법</h3>
                <p className="text-muted-foreground">
                  약물 데이터는 알림 서비스를 제공하고 약물 복용 기록을 추적하는 데만 사용됩니다. 개인 건강 정보를 제3자와 공유, 판매 또는 전송하지 않습니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">3. 데이터 저장</h3>
                <p className="text-muted-foreground">
                  모든 약물 정보는 기기에 로컬로 저장됩니다. 외부 서버에 데이터를 저장하지 않습니다. 즉, 데이터가 사용자의 통제 하에 있지만 필요한 경우 백업하는 것은 사용자의 책임입니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">4. 데이터 보안</h3>
                <p className="text-muted-foreground">
                  무단 액세스로부터 데이터를 보호하기 위해 합리적인 보안 조치를 시행합니다. 그러나 전자 저장 방법이 100% 안전한 것은 아니며 절대적인 보안을 보장할 수 없습니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">5. 알림</h3>
                <p className="text-muted-foreground">
                  앱은 기기 알림을 사용하여 약물 복용을 알려줍니다. 이러한 알림은 기기에서 로컬로 생성되며 외부 서버로 전송되지 않습니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">6. 돌봄 서클 기능</h3>
                <p className="text-muted-foreground">
                  돌봄 서클 기능을 사용하기로 선택하면 지정된 연락처와 선택한 약물 정보를 공유할 수 있습니다. 이 공유는 전적으로 선택 사항이며 사용자의 통제 하에 있습니다. 공유된 데이터는 안전하게 전송됩니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">7. 사용자의 권리</h3>
                <p className="text-muted-foreground">
                  앱의 설정을 통해 언제든지 데이터에 액세스하거나 수정하거나 삭제할 권리가 있습니다. 데이터를 내보내거나 앱에서 모든 정보를 완전히 제거할 수 있습니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">8. 어린이 개인정보 보호</h3>
                <p className="text-muted-foreground">
                  메디리마인드는 13세 미만 어린이의 사용을 목적으로 하지 않습니다. 어린이로부터 개인 정보를 고의로 수집하지 않습니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">9. 개인정보 처리방침 변경</h3>
                <p className="text-muted-foreground">
                  개인정보 처리방침을 수시로 업데이트할 수 있습니다. 앱에 새 정책을 게시하여 변경 사항을 알려드립니다.
                </p>
              </section>

              <section>
                <h3 className="mb-2">10. 문의하기</h3>
                <p className="text-muted-foreground">
                  본 개인정보 처리방침에 대해 질문이 있으시면 앱의 피드백 기능을 통해 문의해 주시기 바랍니다.
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction 
              onClick={() => {
                setShowLogoutDialog(false);
                onLogout?.();
              }}
            >
              {t('settings.logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}