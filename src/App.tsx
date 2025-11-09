import React, { useState } from 'react';
import { Home, Plus, List, Calendar, Settings, Users } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './components/LoginPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { SignUpPage } from './components/SignUpPage';
import { HomePage } from './components/HomePage';
import { AddMedicinePage } from './components/AddMedicinePage';
import { EditMedicinePage } from './components/EditMedicinePage';
import { MedicineListPage } from './components/MedicineListPage';
import { SchedulePage } from './components/SchedulePage';
import { SettingsPage } from './components/SettingsPage';
import { MedicineDetailPage } from './components/MedicineDetailPage';
import { GuardiansPage } from './components/GuardiansPage';
import { GuardianViewPage } from './components/GuardianViewPage';
import { ProfilePage } from './components/ProfilePage';
import { AddMedicineWizard } from './components/AddMedicineWizard';
import { AlarmScreen } from './components/AlarmScreen';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { EmailSignUpPage } from './components/EmailSignUpPage';
import { PhoneSignUpPage } from './components/PhoneSignUpPage';
import { WelcomeSplashScreen } from './components/WelcomeSplashScreen';
import { MedicinePermissionRequestsPage } from './components/MedicinePermissionRequestsPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { LanguageProvider, useLanguage } from './components/LanguageContext';

type Page = 'splash' | 'login' | 'signup' | 'email-signup' | 'phone-signup' | 'forgot-password' | 'welcome-splash' | 'home' | 'add' | 'edit' | 'list' | 'schedule' | 'settings' | 'detail' | 'guardians' | 'guardian-view' | 'profile' | 'terms' | 'privacy' | 'permission-requests';

export interface NewMedicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  status: string;
  type: string;
  color: string;
  bgColor: string;
  asNeeded?: boolean;
}

function AppContent() {
  const { t, language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('splash');
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
  const [selectedMedicineName, setSelectedMedicineName] = useState<string>('Vitamin D');
  const [newMedicine, setNewMedicine] = useState<NewMedicine | null>(null);
  const [isAddMedicineWizardOpen, setIsAddMedicineWizardOpen] = useState(false);
  const [isAlarmVisible, setIsAlarmVisible] = useState(false);
  const [selectedView, setSelectedView] = useState('my-meds'); // Shared state for profile switcher
  const [previousPage, setPreviousPage] = useState<Page>('login'); // Track previous page for back navigation

  const handleSplashComplete = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
    setCurrentPage('welcome-splash');
  };

  const handleWelcomeSplashComplete = () => {
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentPage('login');
  };

  const handleViewMedicine = (medicineId: string) => {
    setSelectedMedicineId(medicineId);
    setCurrentPage('detail');
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedMedicineId(null);
  };

  const handleEditMedicine = (medicineId: string, medicineName: string) => {
    setSelectedMedicineId(medicineId);
    setSelectedMedicineName(medicineName);
    setCurrentPage('edit');
  };

  const handleAddMedicine = (medicine: NewMedicine) => {
    setNewMedicine(medicine);
    setCurrentPage('home');
    setIsAddMedicineWizardOpen(false);
  };

  const handleAlarmTaken = () => {
    setIsAlarmVisible(false);
    toast.success(t('alarm.taken'), {
      description: t('alarm.takenDesc')
    });
  };

  const handleAlarmSnooze = () => {
    setIsAlarmVisible(false);
    toast.info(t('alarm.snoozed'), {
      description: t('alarm.snoozedDesc')
    });
  };

  const handleAlarmDismiss = () => {
    setIsAlarmVisible(false);
    toast(t('alarm.dismissed'));
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => setCurrentPage('signup')} onNavigateToForgotPassword={() => setCurrentPage('forgot-password')} onNavigateToEmailSignUp={() => setCurrentPage('email-signup')} onNavigateToPhoneSignUp={() => setCurrentPage('phone-signup')} />;
      case 'signup':
        return <SignUpPage onBackToLogin={() => setCurrentPage('login')} onSignUp={handleLogin} onNavigateToTerms={() => { setPreviousPage('signup'); setCurrentPage('terms'); }} onNavigateToPrivacy={() => { setPreviousPage('signup'); setCurrentPage('privacy'); }} onNavigateToEmailSignUp={() => setCurrentPage('email-signup')} onNavigateToPhoneSignUp={() => setCurrentPage('phone-signup')} />;
      case 'email-signup':
        return <EmailSignUpPage onBack={() => setCurrentPage('login')} onSignUp={handleLogin} />;
      case 'phone-signup':
        return <PhoneSignUpPage onBack={() => setCurrentPage('login')} onSignUp={handleLogin} />;
      case 'forgot-password':
        return <ForgotPasswordPage onBackToLogin={() => setCurrentPage('login')} />;
      case 'welcome-splash':
        return <WelcomeSplashScreen onComplete={handleWelcomeSplashComplete} />;
      case 'home':
        return <HomePage onViewMedicine={handleViewMedicine} onNavigateToSettings={() => setCurrentPage('settings')} onNavigateToAddMedicine={() => setIsAddMedicineWizardOpen(true)} newMedicine={newMedicine} onClearNewMedicine={() => setNewMedicine(null)} selectedView={selectedView} setSelectedView={setSelectedView} />;
      case 'add':
        return <AddMedicinePage onBack={() => setCurrentPage('home')} onAddMedicine={handleAddMedicine} />;
      case 'edit':
        return <EditMedicinePage medicineId={selectedMedicineId || undefined} medicineName={selectedMedicineName} onBack={() => setCurrentPage('schedule')} />;
      case 'list':
        return <MedicineListPage onViewMedicine={handleViewMedicine} onNavigateToSettings={() => setCurrentPage('settings')} selectedView={selectedView} setSelectedView={setSelectedView} />;
      case 'schedule':
        return <SchedulePage onEditMedicine={handleEditMedicine} onNavigateToSettings={() => setCurrentPage('settings')} selectedView={selectedView} setSelectedView={setSelectedView} />;
      case 'settings':
        return <SettingsPage onNavigateToProfile={() => setCurrentPage('profile')} onNavigateToTerms={() => { setPreviousPage('settings'); setCurrentPage('terms'); }} onNavigateToPrivacy={() => { setPreviousPage('settings'); setCurrentPage('privacy'); }} onLogout={handleLogout} onTestAlarm={() => setIsAlarmVisible(true)} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentPage('settings')} />;
      case 'terms':
        return <TermsOfServicePage onBack={() => setCurrentPage(previousPage)} />;
      case 'privacy':
        return <PrivacyPolicyPage onBack={() => setCurrentPage(previousPage)} />;
      case 'detail':
        return <MedicineDetailPage medicineId={selectedMedicineId} onBack={handleBackToList} />;
      case 'guardians':
        return <GuardiansPage onNavigateToPermissionRequests={() => setCurrentPage('permission-requests')} />;
      case 'guardian-view':
        return <GuardianViewPage onNavigateToSettings={() => setCurrentPage('settings')} />;
      case 'permission-requests':
        return <MedicinePermissionRequestsPage 
          onBack={() => setCurrentPage('guardians')} 
          onApprove={(requestId) => {
            toast.success(language === 'ko' ? '약이 추가되었습니다' : 'Medicine added successfully');
          }}
          onDeny={(requestId) => {
            toast.success(language === 'ko' ? '요청이 거부되었습니다' : 'Request denied');
          }}
        />;
      default:
        return <HomePage onViewMedicine={handleViewMedicine} />;
    }
  };

  const getNavItemStyle = (page: Page) => {
    const isActive = currentPage === page;
    return `flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
      isActive 
        ? 'text-gray-900' 
        : 'text-gray-400 hover:text-gray-600'
    }`;
  };

  const getNavIconStrokeWidth = (page: Page) => {
    return currentPage === page ? 2.5 : 2;
  };

  if (currentPage === 'splash' || currentPage === 'login' || currentPage === 'signup' || currentPage === 'email-signup' || currentPage === 'phone-signup' || currentPage === 'forgot-password' || currentPage === 'welcome-splash' || currentPage === 'terms' || currentPage === 'privacy' || currentPage === 'permission-requests') {
    return (
      <>
        {renderCurrentPage()}
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-white max-w-md mx-auto">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {renderCurrentPage()}
        </div>

        {/* Bottom Navigation */}
        {currentPage !== 'detail' && currentPage !== 'guardian-view' && currentPage !== 'edit' && currentPage !== 'profile' && currentPage !== 'terms' && currentPage !== 'privacy' && currentPage !== 'permission-requests' && (
          <nav className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 p-2 mx-2 mb-2 rounded-2xl shadow-lg">
            <div className="flex justify-around items-center">
              <button
                onClick={() => setCurrentPage('home')}
                className={getNavItemStyle('home')}
              >
                <Home size={24} strokeWidth={getNavIconStrokeWidth('home')} />
                <span className="text-xs mt-1 text-[16px]">{t('nav.home')}</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('schedule')}
                className={getNavItemStyle('schedule')}
              >
                <Calendar size={24} strokeWidth={getNavIconStrokeWidth('schedule')} />
                <span className="text-xs mt-1 text-[16px]">{t('nav.schedule')}</span>
              </button>
              
              <button
                onClick={() => setIsAddMedicineWizardOpen(true)}
                className="flex flex-col items-center p-3 rounded-2xl transition-all duration-200 text-gray-400 hover:text-gray-600"
              >
                <Plus size={24} strokeWidth={2.5} />
                <span className="text-xs mt-1 text-[16px]">{t('nav.add')}</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('guardians')}
                className={getNavItemStyle('guardians')}
              >
                <Users size={24} strokeWidth={getNavIconStrokeWidth('guardians')} />
                <span className="text-xs mt-1 text-[16px]">{t('nav.care')}</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('list')}
                className={getNavItemStyle('list')}
              >
                <List size={24} strokeWidth={getNavIconStrokeWidth('list')} />
                <span className="text-xs mt-1 text-[16px]">{t('nav.history')}</span>
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* Add Medicine Wizard */}
      <AddMedicineWizard 
        isOpen={isAddMedicineWizardOpen}
        onClose={() => setIsAddMedicineWizardOpen(false)}
        onAddMedicine={handleAddMedicine}
      />

      {/* Alarm Screen */}
      <AlarmScreen
        isVisible={isAlarmVisible}
        medicineName="Vitamin D"
        dosage="1000 IU, 1정"
        time="09:00"
        medicineType="tablet"
        medicinePhotoURL={undefined} // In production, this would be populated from the actual medicine record
        onTaken={handleAlarmTaken}
        onSnooze={handleAlarmSnooze}
        onDismiss={handleAlarmDismiss}
        onSettings={() => {
          setIsAlarmVisible(false);
          setCurrentPage('settings');
        }}
      />

      <Toaster position="top-center" richColors />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}