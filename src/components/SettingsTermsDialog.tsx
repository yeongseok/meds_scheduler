import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface SettingsTermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsTermsDialog({ open, onOpenChange }: SettingsTermsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>서비스 이용약관</DialogTitle>
          <DialogDescription>
            약드세요 서비스 이용에 대한 약관 및 조건을 확인하세요.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="mb-2">1. 약관 동의</h3>
              <p className="text-muted-foreground">
                약드세요에 접속하고 사용함으로써 본 약관의 조항에 동의하고 구속되는 것에 동의합니다.
              </p>
            </section>

            <section>
              <h3 className="mb-2">2. 사용 라이선스</h3>
              <p className="text-muted-foreground">
                약드세요를 개인적, 비상업적 용도로만 일시적으로 사용할 수 있는 권한이 부여됩니다. 이러한 제한 사항을 위반하면 이 라이선스는 자동으로 종료됩니다.
              </p>
            </section>

            <section>
              <h3 className="mb-2">3. 의료 면책조항</h3>
              <p className="text-muted-foreground">
                약드세요는 약 복용 알림 도구이며 의학적 조언으로 간주되어서는 안 됩니다. 약물 및 치료 계획에 관해서는 항상 자격을 갖춘 의료 제공자와 상담하십시오. 이 앱은 전문적인 의학적 조언, 진단 또는 치료를 대체하지 않습니다.
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
                어떠한 경우에도 약드세요 또는 그 개발자는 앱의 사용 또는 사용 불능으로 인해 발생하는 손해(데이터 또는 이익의 손실, 약물 오류로 인한 손해를 포함하되 이에 국한되지 않음)에 대해 책임을 지지 않습니다.
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
  );
}
