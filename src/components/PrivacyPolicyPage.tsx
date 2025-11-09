import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { useLanguage } from './LanguageContext';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  const { language } = useLanguage();

  const privacyKorean = [
    {
      title: '1. 수집하는 정보',
      content: '약드세요는 사용자가 자발적으로 제공하는 다음과 같은 정보를 수집하고 저장합니다:\n\n• 약물 정보 (약물명, 복용량, 일정)\n• 복용 기록 및 메모\n• 알림 설정 및 선호도\n• 프로필 정보 (선택 사항)\n\n모든 데이터는 기기에 로컬로 저장되며 사용자의 완전한 통제 하에 있습니다.'
    },
    {
      title: '2. 정보 사용 방법',
      content: '수집된 정보는 다음과 같은 목적으로만 사용됩니다:\n\n• 약물 복용 알림 서비스 제공\n• 복용 기록 추적 및 관리\n• 앱 기능 개선 및 사용자 경험 향상\n• 돌봄 서클 기능 제공 (선택 사항)\n\n개인 건강 정보를 제3자와 공유, 판매 또는 전송하지 않습니다. 사용자의 프라이버시는 최우선 사항입니다.'
    },
    {
      title: '3. 데이터 저장',
      content: '약드세요는 모든 약물 정보를 기기에 로컬로 저장합니다. 외부 서버에 데이터를 저장하지 않으며, 클라우드 동기화를 제공하지 않습니다.\n\n이것은 다음을 의미합니다:\n• 데이터가 사용자의 완전한 통제 하에 있습니다\n• 제3자가 데이터에 액세스할 수 없습니다\n• 필요한 경우 데이터를 백업하는 것은 사용자의 책임입니다\n• 앱을 삭제하면 모든 데이터가 영구적으로 삭제됩니다'
    },
    {
      title: '4. 데이터 보안',
      content: '무단 액세스, 변경, 공개 또는 파괴로부터 데이터를 보호하기 위해 합리적인 보안 조치를 시행합니다:\n\n• 기기 수준 암호화 지원\n• 보안 저장소 사용\n• 정기적인 보안 업데이트\n• 최소 권한 원칙 적용\n\n그러나 전자 저장 방법이 100% 안전한 것은 아니며 절대적인 보안을 보장할 수 없습니다. 기기 자체의 보안을 유지하는 것은 사용자의 책임입니다.'
    },
    {
      title: '5. 알림 시스템',
      content: '앱은 기기의 로컬 알림 시스템을 사용하여 약물 복용 시간을 알려줍니다:\n\n• 알림은 기기에서 로컬로 생성됩니다\n• 외부 서버로 알림 데이터가 전송되지 않습니다\n• 사용자가 언제든지 알림을 제어할 수 있습니다\n• 알림에는 민감한 의료 정보가 포함되지 않을 수 있습니다 (사용자 설정에 따라)'
    },
    {
      title: '6. 돌봄 서클 기능',
      content: '돌봄 서클 기능은 선택 사항이며 다음과 같이 작동합니다:\n\n• 사용자가 직접 공유할 정보를 선택합니다\n• 지정된 연락처와만 정보가 공유됩니다\n• 언제든지 공유를 중단할 수 있습니다\n• 공유된 데이터는 안전하게 암호화되어 전송됩니다\n\n이 기능을 사용하기 전에 공유할 정보의 민감성을 고려하시기 바랍니다.'
    },
    {
      title: '7. 제3자 서비스',
      content: '약드세요는 기본적으로 제3자 서비스를 사용하지 않습니다. 앱의 모든 기능은 독립적으로 작동합니다.\n\n향후 제3자 서비스를 통합하는 경우:\n• 사전에 사용자에게 명확하게 고지합니다\n• 사용자의 동의를 구합니다\n• 개인정보 처리방침을 업데이트합니다'
    },
    {
      title: '8. 사용자의 권리',
      content: '사용자는 자신의 데이터에 대해 다음과 같은 권리를 가집니다:\n\n• 액세스 권한: 앱에 저장된 모든 데이터를 확인할 수 있습니다\n• 수정 권한: 언제든지 데이터를 수정할 수 있습니다\n• 삭제 권한: 개별 항목 또는 모든 데이터를 삭제할 수 있습니다\n• 내보내기 권한: 데이터를 내보낼 수 있습니다 (향후 기능)\n\n이러한 권리는 앱의 설정 메뉴를 통해 행사할 수 있습니다.'
    },
    {
      title: '9. 어린이 개인정보 보호',
      content: '약드세요는 13세 미만 어린이의 사용을 목적으로 하지 않습니다. 13세 미만 어린이로부터 개인 정보를 고의로 수집하지 않습니다.\n\n부모 또는 보호자가 자녀가 동의 없이 개인 정보를 제공했다는 사실을 알게 된 경우, 피드백 기능을 통해 문의해 주시면 해당 정보를 삭제하기 위한 조치를 취하겠습니다.'
    },
    {
      title: '10. 개인정보 처리방침 변경',
      content: '개인정보 처리방침을 수시로 업데이트할 수 있습니다. 변경 사항이 있는 경우:\n\n• 앱에 새 정책을 게시합니다\n• 중요한 변경 사항은 앱 내 알림으로 공지합니다\n• "마지막 업데이트" 날짜를 갱신합니다\n\n변경 후 앱을 계속 사용하면 새로운 정책에 동의하는 것으로 간주됩니다. 정기적으로 이 페이지를 확인하여 변경 사항을 파악하는 것이 좋습니다.'
    },
    {
      title: '11. 데이터 전송 및 국제 사용',
      content: '약드세요는 로컬 저장소만 사용하므로 국제 데이터 전송이 발생하지 않습니다. 모든 데이터는 사용자의 기기에만 저장됩니다.\n\n앱은 전 세계 어디서나 사용할 수 있지만 모든 데이터는 로컬로 유지됩니다.'
    },
    {
      title: '12. 쿠키 및 추적 기술',
      content: '약드세요는 쿠키나 기타 추적 기술을 사용하지 않습니다. 사용자의 활동을 추적하거나 분석하지 않습니다.\n\n앱 성능 향상을 위해 익명화된 사용 통계를 수집할 수 있지만, 이는 선택 사항이며 사용자가 제어할 수 있습니다.'
    },
    {
      title: '13. 문의하기',
      content: '본 개인정보 처리방침에 대해 질문, 우려 사항 또는 요청이 있으시면 앱의 피드백 기능을 통해 문의해 주시기 바랍니다.\n\n답변 드리는 데 영업일 기준 3-5일이 소요될 수 있습니다.\n\n마지막 업데이트: 2024년 11월'
    }
  ];

  const privacyEnglish = [
    {
      title: '1. Information We Collect',
      content: 'MediRemind collects and stores the following information that you voluntarily provide:\n\n• Medication information (names, dosages, schedules)\n• Medication intake records and notes\n• Notification settings and preferences\n• Profile information (optional)\n\nAll data is stored locally on your device and remains under your complete control.'
    },
    {
      title: '2. How We Use Your Information',
      content: 'The collected information is used only for the following purposes:\n\n• Providing medication reminder services\n• Tracking and managing medication intake records\n• Improving app features and user experience\n• Providing Care Circle functionality (optional)\n\nWe do not share, sell, or transmit your personal health information to third parties. Your privacy is our top priority.'
    },
    {
      title: '3. Data Storage',
      content: 'MediRemind stores all medication information locally on your device. We do not store data on external servers and do not provide cloud synchronization.\n\nThis means:\n• Your data remains under your complete control\n• Third parties cannot access your data\n• You are responsible for backing up your data if needed\n• Deleting the app will permanently remove all data'
    },
    {
      title: '4. Data Security',
      content: 'We implement reasonable security measures to protect your data from unauthorized access, alteration, disclosure, or destruction:\n\n• Device-level encryption support\n• Secure storage usage\n• Regular security updates\n• Principle of least privilege\n\nHowever, no method of electronic storage is 100% secure, and we cannot guarantee absolute security. Maintaining the security of your device itself is your responsibility.'
    },
    {
      title: '5. Notification System',
      content: 'The app uses your device\'s local notification system to remind you of medication times:\n\n• Notifications are generated locally on your device\n• No notification data is sent to external servers\n• You can control notifications at any time\n• Notifications may exclude sensitive medical information (based on your settings)'
    },
    {
      title: '6. Care Circle Feature',
      content: 'The Care Circle feature is optional and works as follows:\n\n• You directly choose what information to share\n• Information is shared only with designated contacts\n• You can stop sharing at any time\n• Shared data is transmitted securely and encrypted\n\nPlease consider the sensitivity of the information before using this feature.'
    },
    {
      title: '7. Third-Party Services',
      content: 'MediRemind does not use third-party services by default. All app features operate independently.\n\nIf we integrate third-party services in the future:\n• We will clearly notify users in advance\n• We will obtain user consent\n• We will update this Privacy Policy'
    },
    {
      title: '8. Your Rights',
      content: 'You have the following rights regarding your data:\n\n• Access: View all data stored in the app\n• Modification: Modify data at any time\n• Deletion: Delete individual items or all data\n• Export: Export your data (future feature)\n\nThese rights can be exercised through the app\'s settings menu.'
    },
    {
      title: '9. Children\'s Privacy',
      content: 'MediRemind is not intended for use by children under 13 years of age. We do not knowingly collect personal information from children under 13.\n\nIf a parent or guardian becomes aware that their child has provided us with personal information without consent, please contact us through the feedback feature, and we will take steps to remove that information.'
    },
    {
      title: '10. Privacy Policy Changes',
      content: 'We may update this Privacy Policy from time to time. When changes occur:\n\n• We will post the new policy in the app\n• Significant changes will be communicated via in-app notifications\n• We will update the "Last Updated" date\n\nContinued use of the app after changes constitutes acceptance of the new policy. We recommend checking this page regularly for any changes.'
    },
    {
      title: '11. Data Transfer and International Use',
      content: 'Since MediRemind uses only local storage, no international data transfers occur. All data is stored only on your device.\n\nThe app can be used anywhere in the world, but all data remains local.'
    },
    {
      title: '12. Cookies and Tracking Technologies',
      content: 'MediRemind does not use cookies or other tracking technologies. We do not track or analyze your activities.\n\nWe may collect anonymized usage statistics to improve app performance, but this is optional and under your control.'
    },
    {
      title: '13. Contact Us',
      content: 'If you have any questions, concerns, or requests about this Privacy Policy, please contact us through the app\'s feedback feature.\n\nWe aim to respond within 3-5 business days.\n\nLast Updated: November 2024'
    }
  ];

  const privacy = language === 'ko' ? privacyKorean : privacyEnglish;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={22} />
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="text-[#3674B5]" size={24} />
            <h1 className="text-xl">
              {language === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          {/* Introduction Card */}
          <Card className="p-4 bg-[#E8F1FC] border-[#3674B5]/20">
            <div className="flex items-start space-x-3">
              <Shield className="text-[#3674B5] flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-[18px]">
                  {language === 'ko' ? '개인정보 처리방침' : 'Privacy Policy'}
                </h3>
                <p className="text-gray-600 text-[15px]">
                  {language === 'ko' 
                    ? '약드세요는 사용자의 개인정보를 소중히 여깁니다. 본 방침은 개인정보의 수집, 사용, 보호 방법에 대해 설명합니다.'
                    : 'MediRemind values your privacy. This policy explains how we collect, use, and protect your personal information.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Privacy Sections */}
          {privacy.map((section, index) => (
            <Card key={index} className="p-4 bg-white border-gray-200 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-3 text-[18px]">
                {section.title}
              </h2>
              <p className="text-gray-600 whitespace-pre-line text-[15px] leading-relaxed">
                {section.content}
              </p>
            </Card>
          ))}

          {/* Commitment Notice */}
          <Card className="p-4 bg-[#E8F1FC] border-[#3674B5]/20">
            <p className="text-gray-700 text-[15px] text-center">
              {language === 'ko' 
                ? '약드세요는 사용자의 개인정보 보호와 프라이버시를 최우선으로 생각합니다.'
                : 'MediRemind is committed to protecting your privacy and personal information as our top priority.'}
            </p>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
