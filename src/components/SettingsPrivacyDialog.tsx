import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface SettingsPrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsPrivacyDialog({ open, onOpenChange }: SettingsPrivacyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                약드세요는 사용자가 자발적으로 제공하는 약물 정보(약물명, 복용량, 일정 및 관련 메모)를 수집하고 저장합니다. 모든 데이터는 기기에 로컬로 저장됩니다.
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
                약드세요는 13세 미만 어린이의 사용을 목적으로 하지 않습니다. 어린이로부터 개인 정보를 고의로 수집하지 않습니다.
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
  );
}
