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
import { AdBanner } from './components/AdBanner';
import { InAppAdvertise } from './components/InAppAdvertise';
import { AddMedicineWizard } from './components/AddMedicineWizard';
import { AlarmScreen } from './components/AlarmScreen';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { LanguageProvider, useLanguage } from './components/LanguageContext';

type Page = 'splash' | 'login' | 'signup' | 'forgot-password' | 'home' | 'add' | 'edit' | 'list' | 'schedule' | 'settings' | 'detail' | 'guardians' | 'guardian-view' | 'profile';

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
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('splash');
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(null);
  const [selectedMedicineName, setSelectedMedicineName] = useState<string>('Vitamin D');
  const [newMedicine, setNewMedicine] = useState<NewMedicine | null>(null);
  const [isAddMedicineWizardOpen, setIsAddMedicineWizardOpen] = useState(false);
  const [isAlarmVisible, setIsAlarmVisible] = useState(false);
  const [selectedView, setSelectedView] = useState('my-meds'); // Shared state for profile switcher

  const handleSplashComplete = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
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
        return <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => setCurrentPage('signup')} onNavigateToForgotPassword={() => setCurrentPage('forgot-password')} />;
      case 'signup':
        return <SignUpPage onBackToLogin={() => setCurrentPage('login')} onSignUp={handleLogin} />;
      case 'forgot-password':
        return <ForgotPasswordPage onBackToLogin={() => setCurrentPage('login')} />;
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
        return <SettingsPage onNavigateToProfile={() => setCurrentPage('profile')} onLogout={handleLogout} onTestAlarm={() => setIsAlarmVisible(true)} />;
      case 'profile':
        return <ProfilePage onBack={() => setCurrentPage('settings')} />;
      case 'detail':
        return <MedicineDetailPage medicineId={selectedMedicineId} onBack={handleBackToList} />;
      case 'guardians':
        return <GuardiansPage />;
      case 'guardian-view':
        return <GuardianViewPage onNavigateToSettings={() => setCurrentPage('settings')} />;
      default:
        return <HomePage onViewMedicine={handleViewMedicine} />;
    }
  };

  const getNavItemStyle = (page: Page) => {
    const isActive = currentPage === page;
    return `flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
      isActive 
        ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg scale-105' 
        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
    }`;
  };

  if (currentPage === 'splash' || currentPage === 'login' || currentPage === 'signup' || currentPage === 'forgot-password') {
    return renderCurrentPage();
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 max-w-md mx-auto">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {renderCurrentPage()}
        </div>

        {/* Ad Banner */}
        {currentPage !== 'detail' && currentPage !== 'guardian-view' && currentPage !== 'edit' && currentPage !== 'profile' && (
          <AdBanner />
        )}

        {/* In-App Advertise Section */}
        {currentPage !== 'detail' && currentPage !== 'guardian-view' && currentPage !== 'edit' && currentPage !== 'profile' && (
          <InAppAdvertise />
        )}

        {/* Bottom Navigation */}
        {currentPage !== 'detail' && currentPage !== 'guardian-view' && currentPage !== 'edit' && currentPage !== 'profile' && (
          <nav className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 p-2 mx-2 mb-2 rounded-2xl shadow-lg">
            <div className="flex justify-around items-center">
              <button
                onClick={() => setCurrentPage('home')}
                className={getNavItemStyle('home')}
              >
                <Home size={18} />
                <span className="text-xs mt-1 font-medium text-[16px]">{t('nav.home')}</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('schedule')}
                className={getNavItemStyle('schedule')}
              >
                <Calendar size={18} />
                <span className="text-xs mt-1 font-medium text-[16px]">{t('nav.schedule')}</span>
              </button>
              
              <button
                onClick={() => setIsAddMedicineWizardOpen(true)}
                className="flex flex-col items-center p-3 rounded-2xl transition-all duration-200 text-gray-600 hover:text-amber-600 hover:bg-amber-50"
              >
                <div className="p-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400">
                  <Plus size={18} className="text-white" />
                </div>
                <span className="text-xs mt-1 font-medium text-[16px]">{t('nav.add')}</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('guardians')}
                className={getNavItemStyle('guardians')}
              >
                <Users size={18} />
                <span className="text-xs mt-1 font-medium text-[16px]">{t('nav.care')}</span>
              </button>
              
              <button
                onClick={() => setCurrentPage('list')}
                className={getNavItemStyle('list')}
              >
                <List size={18} />
                <span className="text-xs mt-1 font-medium text-[16px]">{t('nav.history')}</span>
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