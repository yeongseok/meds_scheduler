import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { useLanguage } from './LanguageContext';

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  const { language } = useLanguage();

  const termsKorean = [
    {
      title: '1. 약관 동의',
      content: '약드세요에 접속하고 사용함으로써 본 약관의 조항에 동의하고 구속되는 것에 동의합니다. 본 약관에 동의하지 않으시면 앱을 사용하지 마시기 바랍니다.'
    },
    {
      title: '2. 사용 라이선스',
      content: '약드세요를 개인적, 비상업적 용도로만 일시적으로 사용할 수 있는 권한이 부여됩니다. 이러한 제한 사항을 위반하면 이 라이선스는 자동으로 종료됩니다. 다음과 같은 행위는 금지됩니다:\n\n• 소프트웨어를 수정하거나 복사하는 행위\n• 상업적 목적으로 사용하는 행위\n• 소프트웨어를 리버스 엔지니어링하는 행위\n• 저작권 또는 기타 독점 표기를 제거하는 행위'
    },
    {
      title: '3. 의료 면책조항',
      content: '약드세요는 약 복용 알림 도구이며 의학적 조언으로 간주되어서는 안 됩니다. 약물 및 치료 계획에 관해서는 항상 자격을 갖춘 의료 제공자와 상담하십시오. 이 앱은 전문적인 의학적 조언, 진단 또는 치료를 대체하지 않습니다.\n\n앱에서 제공하는 정보는 교육 목적으로만 제공됩니다. 약물 복용을 시작, 중단 또는 변경하기 전에 항상 의사 또는 약사와 상담하십시오.'
    },
    {
      title: '4. 사용자 책임',
      content: '앱에 입력한 약물 정보의 정확성을 유지할 책임은 사용자에게 있습니다. 모든 약물 일정, 복용량 및 알림이 정확한지 확인해야 합니다. 앱 개발자는 약물 관리의 오류나 누락에 대해 책임을 지지 않습니다.\n\n사용자는 다음 사항에 대해 책임이 있습니다:\n• 정확한 약물 정보 입력\n• 알림 설정의 적절한 구성\n• 약물 일정의 정기적인 검토 및 업데이트\n• 기기가 알림을 받을 수 있는 상태 유지'
    },
    {
      title: '5. 데이터 정확성',
      content: '정확하고 신뢰할 수 있는 서비스를 제공하기 위해 노력하지만, 앱이 오류 없이 또는 중단 없이 작동할 것이라고 보장하지 않습니다. 기기 설정, 네트워크 문제 또는 기타 기술적 요인으로 인해 알림이 항상 정시에 전달되지 않을 수 있음을 인정합니다.\n\n사용자는 앱이 백업 알림 시스템이며 주요 약물 관리 방법이 되어서는 안 된다는 점을 이해합니다.'
    },
    {
      title: '6. 책임의 제한',
      content: '어떠한 경우에도 약드세요 또는 그 개발자는 앱의 사용 또는 사용 불능으로 인해 발생하는 손해(데이터 또는 이익의 손실, 약물 오류로 인한 손해를 포함하되 이에 국한되지 않음)에 대해 책임을 지지 않습니다.\n\n이러한 제한은 해당 관할권에서 허용하는 최대 범위까지 적용됩니다.'
    },
    {
      title: '7. 서비스 변경',
      content: '약드세요는 사전 통지 없이 언제든지 앱의 기능을 수정, 일시 중단 또는 중단할 권리를 보유합니다. 서비스 변경으로 인해 발생하는 손해에 대해 책임을 지지 않습니다.'
    },
    {
      title: '8. 수정',
      content: '당사는 언제든지 본 약관을 수정하거나 대체할 권리를 보유합니다. 그러한 변경 후에도 앱을 계속 사용하는 것은 그러한 변경에 동의하는 것으로 간주됩니다.\n\n중요한 변경 사항은 앱 내 알림을 통해 공지됩니다. 변경된 약관을 정기적으로 검토하는 것은 사용자의 책임입니다.'
    },
    {
      title: '9. 준거법',
      content: '본 약관은 대한민국 법률에 따라 규율되고 해석됩니다. 본 약관과 관련하여 발생하는 모든 분쟁은 대한민국 법원의 전속 관할권에 따릅니다.'
    },
    {
      title: '10. 연락처 정보',
      content: '본 서비스 이용약관에 대해 질문이 있으시면 앱의 피드백 기능을 통해 문의해 주시기 바랍니다.\n\n마지막 업데이트: 2024년 11월'
    }
  ];

  const termsEnglish = [
    {
      title: '1. Agreement to Terms',
      content: 'By accessing and using MediRemind, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.'
    },
    {
      title: '2. Use License',
      content: 'You are granted a temporary permission to use MediRemind for personal, non-commercial purposes only. This license will automatically terminate if you violate any of these restrictions. You may not:\n\n• Modify or copy the software\n• Use it for commercial purposes\n• Reverse engineer the software\n• Remove any copyright or proprietary notations'
    },
    {
      title: '3. Medical Disclaimer',
      content: 'MediRemind is a medication reminder tool and should not be considered as medical advice. Always consult with a qualified healthcare provider regarding medications and treatment plans. This app is not a substitute for professional medical advice, diagnosis, or treatment.\n\nThe information provided in the app is for educational purposes only. Always consult your doctor or pharmacist before starting, stopping, or changing any medication.'
    },
    {
      title: '4. User Responsibility',
      content: 'You are responsible for maintaining the accuracy of medication information entered into the app. You must ensure all medication schedules, dosages, and reminders are correct. The app developers are not liable for errors or omissions in medication management.\n\nUsers are responsible for:\n• Entering accurate medication information\n• Properly configuring reminder settings\n• Regularly reviewing and updating medication schedules\n• Ensuring their device is able to receive notifications'
    },
    {
      title: '5. Data Accuracy',
      content: 'While we strive to provide accurate and reliable service, we do not guarantee that the app will operate error-free or without interruption. You acknowledge that reminders may not always be delivered on time due to device settings, network issues, or other technical factors.\n\nUsers understand that the app is a backup reminder system and should not be the primary method of medication management.'
    },
    {
      title: '6. Limitation of Liability',
      content: 'In no event shall MediRemind or its developers be liable for any damages arising from the use or inability to use the app, including but not limited to loss of data or profits, or damages from medication errors.\n\nThis limitation applies to the maximum extent permitted by applicable law.'
    },
    {
      title: '7. Service Changes',
      content: 'MediRemind reserves the right to modify, suspend, or discontinue any features of the app at any time without prior notice. We are not liable for any damages resulting from service changes.'
    },
    {
      title: '8. Modifications',
      content: 'We reserve the right to modify or replace these terms at any time. Continued use of the app after such changes constitutes acceptance of those changes.\n\nSignificant changes will be communicated through in-app notifications. It is your responsibility to review the terms regularly for any changes.'
    },
    {
      title: '9. Governing Law',
      content: 'These terms shall be governed by and construed in accordance with the laws of the Republic of Korea. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of Korean courts.'
    },
    {
      title: '10. Contact Information',
      content: 'If you have any questions about these Terms of Service, please contact us through the app\'s feedback feature.\n\nLast Updated: November 2024'
    }
  ];

  const terms = language === 'ko' ? termsKorean : termsEnglish;

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
            <FileText className="text-[#3674B5]" size={24} />
            <h1 className="text-xl">
              {language === 'ko' ? '이용약관' : 'Terms of Service'}
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
              <FileText className="text-[#3674B5] flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1 text-[18px]">
                  {language === 'ko' ? '서비스 이용약관' : 'Terms of Service'}
                </h3>
                <p className="text-gray-600 text-[15px]">
                  {language === 'ko' 
                    ? '약드세요 서비스 이용에 대한 약관 및 조건입니다. 앱을 사용하기 전에 주의 깊게 읽어주시기 바랍니다.'
                    : 'These are the terms and conditions for using MediRemind. Please read carefully before using the app.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Terms Sections */}
          {terms.map((section, index) => (
            <Card key={index} className="p-4 bg-white border-gray-200 shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-3 text-[18px]">
                {section.title}
              </h2>
              <p className="text-gray-600 whitespace-pre-line text-[15px] leading-relaxed">
                {section.content}
              </p>
            </Card>
          ))}

          {/* Acceptance Notice */}
          <Card className="p-4 bg-[#E8F1FC] border-[#3674B5]/20">
            <p className="text-gray-700 text-[15px] text-center">
              {language === 'ko' 
                ? '약드세요를 계속 사용함으로써 위의 모든 약관에 동의하는 것으로 간주됩니다.'
                : 'By continuing to use MediRemind, you agree to all of the terms above.'}
            </p>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
