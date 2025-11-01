import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved === 'en' || saved === 'ko') ? saved : 'ko';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  ko: {
    // Bottom Navigation
    nav: {
      home: '홈',
      schedule: '일정',
      add: '추가',
      care: '돌봄',
      history: '기록'
    },
    // Common
    common: {
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      edit: '편집',
      back: '뒤로',
      confirm: '확인',
      close: '닫기',
      next: '다음',
      previous: '이전',
      complete: '완료',
      loading: '로딩 중...',
      error: '오류가 발생했습니다',
      success: '성공',
      search: '검색',
      filter: '필터',
      all: '모두',
      active: '활성',
      inactive: '비활성',
      yes: '예',
      no: '아니오'
    },
    // Home Page
    home: {
      title: '안녕하세요',
      date: '2025년 1월 24일 금요일',
      healthScore: '오늘의 건강 점수',
      healthScoreMessage: '잘하고 있어요! 계속 유지하세요! 💪',
      todaySchedule: '오늘의 일정',
      myMeds: '내 약',
      guardianView: '보호자로 보기',
      sendReminder: '알림 보내기',
      attentionNeeded: '주의 필요',
      overdueMessage: '님은 {count}개의 약을 복용하지 않았습니다. 확인해 주세요.',
      status: {
        taken: '복용완료',
        overdue: '지연',
        pending: '복용시간',
        upcoming: '예정',
        asNeeded: '필요시'
      },
      actions: {
        take: '복용',
        skip: '건너뛰기',
        undo: '되돌리기'
      }
    },
    // Medicine List
    list: {
      title: '내 약 목록',
      searchPlaceholder: '약 검색...',
      noMedicines: '등록된 약이 없습니다',
      addFirst: '첫 약을 추가해보세요',
      filterAll: '모든 약',
      filterActive: '복용 중',
      filterInactive: '중단됨',
      stats: {
        active: '복용 중',
        streak: '최고 연속',
        adherence: '순응도'
      },
      actions: {
        view: '보기',
        edit: '수정',
        delete: '삭제',
        archive: '보관'
      }
    },
    // Schedule
    schedule: {
      title: '복용 일정',
      today: '오늘',
      week: '주간',
      month: '월간',
      noSchedule: '예정된 일정이 없습니다',
      morning: '아침',
      afternoon: '오후',
      evening: '저녁',
      night: '밤'
    },
    // Add Medicine Wizard
    addMedicine: {
      title: '약 추가하기',
      step1: {
        title: '약 정보',
        medicineName: '약 이름',
        medicineNamePlaceholder: '약 이름을 입력하세요',
        medicineType: '약 종류',
        types: {
          tablet: '알약',
          capsule: '캡슐',
          liquid: '시럽',
          injection: '주사',
          powder: '가루약',
          other: '기타'
        }
      },
      step2: {
        title: '용량 설정',
        dosage: '용량',
        dosagePlaceholder: '예: 500mg',
        quantity: '복용량',
        quantityPlaceholder: '예: 1정',
        unit: '단위'
      },
      step3: {
        title: '복용 시간',
        asNeeded: '필요시 복용 (PRN)',
        asNeededDesc: '정해진 시간 없이 필요할 때 복용',
        selectTimes: '복용 시간 선택',
        addTime: '시간 추가',
        frequency: '복용 빈도',
        frequencyOptions: {
          daily: '매일',
          weekly: '매주',
          monthly: '매월',
          asNeeded: '필요시'
        }
      },
      step4: {
        title: '복용 기간',
        startDate: '시작일',
        endDate: '종료일',
        ongoing: '계속 복용',
        duration: '복용 기간'
      },
      step5: {
        title: '확인',
        review: '입력하신 정보를 확인하세요',
        medicineInfo: '약 정보',
        dosageInfo: '용량 정보',
        scheduleInfo: '일정 정보'
      },
      success: '약이 추가되었습니다',
      error: '약 추가에 실패했습니다'
    },
    // Settings
    settings: {
      title: '설정',
      profile: '내 프로필',
      viewProfile: '프로필 보기',
      notifications: '알림',
      notificationsDesc: '약 복용 알림 받기',
      sound: '소리',
      soundDesc: '알림 소리 켜기',
      vibration: '진동',
      vibrationDesc: '알림 진동 켜기',
      testAlarm: '알림 테스트',
      testAlarmDesc: '알림이 어떻게 작동하는지 확인',
      language: '언어',
      languageDesc: '앱 언어 설정',
      korean: '한국어',
      english: 'English',
      theme: '테마',
      darkMode: '다크 모드',
      darkModeDesc: '어두운 화면으로 전환',
      data: '데이터',
      deleteAllData: '모든 데이터 삭제',
      deleteDataDesc: '앱의 모든 데이터를 삭제합니다',
      deleteConfirm: '정말로 모든 데이터를 삭제하시겠습니까?',
      deleteWarning: '이 작업은 되돌릴 수 없습니다.',
      legal: '법률',
      terms: '이용 약관',
      privacy: '개인정보 처리방침',
      version: '버전',
      logout: '로그아웃',
      logoutConfirm: '로그아웃 하시겠습니까?'
    },
    // Profile
    profile: {
      title: '내 프로필',
      personalInfo: '개인 정보',
      contactInfo: '연락처 정보',
      accountStats: '계정 통계',
      firstName: '이름',
      lastName: '성',
      dateOfBirth: '생년월일',
      email: '이메일 주소',
      phone: '전화번호',
      selectDate: '날짜 선택',
      stats: {
        medicines: '약',
        adherence: '순응도',
        streak: '연속 일수'
      }
    },
    // Guardians/Care Circle
    guardians: {
      title: '돌봄 서클',
      myGuardians: '나의 보호자',
      iAmGuardianFor: '내가 돌보는 사람',
      addGuardian: '보호자 추가',
      requestSent: '요청 전송됨',
      pending: '대기 중',
      remove: '제거',
      viewDetails: '상세 보기',
      noGuardians: '보호자가 없습니다',
      noCareRecipients: '돌보는 사람이 없습니다'
    },
    // Alarm Screen
    alarm: {
      timeToTake: '복용 시간입니다',
      take: '복용함',
      snooze: '10분 후',
      dismiss: '건너뛰기',
      taken: '복용 완료로 기록되었습니다',
      takenDesc: '약을 복용한 시간이 기록되었습니다.',
      snoozed: '10분 후 다시 알림',
      snoozedDesc: '10분 후에 다시 알려드리겠습니다.',
      dismissed: '알림이 해제되었습니다'
    },
    // Login
    login: {
      title: '로그인',
      welcome: '환영합니다',
      email: '이메일',
      password: '비밀번호',
      forgotPassword: '비밀번호를 잊으셨나요?',
      login: '로그인',
      noAccount: '계정이 없으신가요?',
      signUp: '가입하기',
      emailPlaceholder: '이메일을 입력하세요',
      passwordPlaceholder: '비밀번호를 입력하세요'
    },
    // Sign Up
    signup: {
      title: '회원가입',
      createAccount: '계정 만들기',
      firstName: '이름',
      lastName: '성',
      email: '이메일',
      password: '비밀번호',
      confirmPassword: '비밀번호 확인',
      agreeToTerms: '이용 약관에 동의합니다',
      signUp: '가입하기',
      haveAccount: '이미 계정이 있으신가요?',
      login: '로그인'
    },
    // Forgot Password
    forgotPassword: {
      title: '비밀번호 찾기',
      description: '가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.',
      email: '이메일',
      send: '링크 보내기',
      backToLogin: '로그인으로 돌아가기',
      success: '이메일을 확인하세요',
      successDesc: '비밀번호 재설정 링크를 보냈습니다.'
    },
    // Splash Screen
    splash: {
      tagline: '건강한 습관, 더 나은 삶',
      loading: '로딩 중...'
    }
  },
  en: {
    // Bottom Navigation
    nav: {
      home: 'Home',
      schedule: 'Schedule',
      add: 'Add',
      care: 'Care',
      history: 'History'
    },
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      confirm: 'Confirm',
      close: 'Close',
      next: 'Next',
      previous: 'Previous',
      complete: 'Complete',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      yes: 'Yes',
      no: 'No'
    },
    // Home Page
    home: {
      title: 'Hello',
      date: 'Friday, January 24, 2025',
      healthScore: "Today's Health Score",
      healthScoreMessage: "You're doing great! Keep it up! 💪",
      todaySchedule: "Today's Schedule",
      myMeds: 'My Meds',
      guardianView: 'Guardian View',
      sendReminder: 'Send Reminder',
      attentionNeeded: 'Attention Needed',
      overdueMessage: 'has {count} overdue medication(s). Please check.',
      status: {
        taken: 'Taken',
        overdue: 'Overdue',
        pending: 'Due Now',
        upcoming: 'Upcoming',
        asNeeded: 'As Needed'
      },
      actions: {
        take: 'Take',
        skip: 'Skip',
        undo: 'Undo'
      }
    },
    // Medicine List
    list: {
      title: 'My Medicines',
      searchPlaceholder: 'Search medicines...',
      noMedicines: 'No medicines registered',
      addFirst: 'Add your first medicine',
      filterAll: 'All Medicines',
      filterActive: 'Active',
      filterInactive: 'Inactive',
      stats: {
        active: 'Active',
        streak: 'Best Streak',
        adherence: 'Adherence'
      },
      actions: {
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        archive: 'Archive'
      }
    },
    // Schedule
    schedule: {
      title: 'Schedule',
      today: 'Today',
      week: 'Week',
      month: 'Month',
      noSchedule: 'No scheduled items',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      night: 'Night'
    },
    // Add Medicine Wizard
    addMedicine: {
      title: 'Add Medicine',
      step1: {
        title: 'Medicine Info',
        medicineName: 'Medicine Name',
        medicineNamePlaceholder: 'Enter medicine name',
        medicineType: 'Medicine Type',
        types: {
          tablet: 'Tablet',
          capsule: 'Capsule',
          liquid: 'Liquid',
          injection: 'Injection',
          powder: 'Powder',
          other: 'Other'
        }
      },
      step2: {
        title: 'Dosage',
        dosage: 'Dosage',
        dosagePlaceholder: 'e.g., 500mg',
        quantity: 'Quantity',
        quantityPlaceholder: 'e.g., 1 tablet',
        unit: 'Unit'
      },
      step3: {
        title: 'Timing',
        asNeeded: 'As Needed (PRN)',
        asNeededDesc: 'Take as needed, no fixed schedule',
        selectTimes: 'Select Times',
        addTime: 'Add Time',
        frequency: 'Frequency',
        frequencyOptions: {
          daily: 'Daily',
          weekly: 'Weekly',
          monthly: 'Monthly',
          asNeeded: 'As Needed'
        }
      },
      step4: {
        title: 'Duration',
        startDate: 'Start Date',
        endDate: 'End Date',
        ongoing: 'Ongoing',
        duration: 'Duration'
      },
      step5: {
        title: 'Review',
        review: 'Review your information',
        medicineInfo: 'Medicine Info',
        dosageInfo: 'Dosage Info',
        scheduleInfo: 'Schedule Info'
      },
      success: 'Medicine added successfully',
      error: 'Failed to add medicine'
    },
    // Settings
    settings: {
      title: 'Settings',
      profile: 'My Profile',
      viewProfile: 'View Profile',
      notifications: 'Notifications',
      notificationsDesc: 'Receive medication reminders',
      sound: 'Sound',
      soundDesc: 'Enable notification sound',
      vibration: 'Vibration',
      vibrationDesc: 'Enable notification vibration',
      testAlarm: 'Test Alarm',
      testAlarmDesc: 'See how notifications work',
      language: 'Language',
      languageDesc: 'Set app language',
      korean: '한국어',
      english: 'English',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Switch to dark theme',
      data: 'Data',
      deleteAllData: 'Delete All Data',
      deleteDataDesc: 'Remove all app data',
      deleteConfirm: 'Are you sure you want to delete all data?',
      deleteWarning: 'This action cannot be undone.',
      legal: 'Legal',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      version: 'Version',
      logout: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?'
    },
    // Profile
    profile: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      contactInfo: 'Contact Information',
      accountStats: 'Account Statistics',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      email: 'Email Address',
      phone: 'Phone Number',
      selectDate: 'Select Date',
      stats: {
        medicines: 'Medicines',
        adherence: 'Adherence',
        streak: 'Day Streak'
      }
    },
    // Guardians/Care Circle
    guardians: {
      title: 'Care Circle',
      myGuardians: 'My Guardians',
      iAmGuardianFor: "I'm Guardian For",
      addGuardian: 'Add Guardian',
      requestSent: 'Request Sent',
      pending: 'Pending',
      remove: 'Remove',
      viewDetails: 'View Details',
      noGuardians: 'No guardians',
      noCareRecipients: 'No care recipients'
    },
    // Alarm Screen
    alarm: {
      timeToTake: "It's time to take your medicine",
      take: 'Take',
      snooze: 'Snooze 10min',
      dismiss: 'Skip',
      taken: 'Marked as taken',
      takenDesc: 'Your medication has been recorded.',
      snoozed: 'Snoozed for 10 minutes',
      snoozedDesc: "We'll remind you again in 10 minutes.",
      dismissed: 'Alarm dismissed'
    },
    // Login
    login: {
      title: 'Login',
      welcome: 'Welcome',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      login: 'Login',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password'
    },
    // Sign Up
    signup: {
      title: 'Sign Up',
      createAccount: 'Create Account',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      agreeToTerms: 'I agree to the Terms of Service',
      signUp: 'Sign Up',
      haveAccount: 'Already have an account?',
      login: 'Login'
    },
    // Forgot Password
    forgotPassword: {
      title: 'Forgot Password',
      description: 'Enter your email address and we will send you a link to reset your password.',
      email: 'Email',
      send: 'Send Link',
      backToLogin: 'Back to Login',
      success: 'Check Your Email',
      successDesc: 'We have sent you a password reset link.'
    },
    // Splash Screen
    splash: {
      tagline: 'Healthy Habits, Better Life',
      loading: 'Loading...'
    }
  }
};
