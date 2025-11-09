import React, { useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface PhotoUploadSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoSelected: (file: File) => void;
  title?: string;
}

export function PhotoUploadSheet({
  open,
  onOpenChange,
  onPhotoSelected,
  title
}: PhotoUploadSheetProps) {
  const { language } = useLanguage();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelected(file);
      onOpenChange(false);
    }
    // Reset input value so the same file can be selected again
    e.target.value = '';
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleChooseFromGallery = () => {
    galleryInputRef.current?.click();
  };

  const defaultTitle = language === 'ko' ? '사진 추가' : 'Add Photo';

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Bottom Sheet */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="bg-white border-t border-gray-200 rounded-t-3xl px-0 pb-8"
        >
          <SheetHeader className="px-6 pb-4">
            <SheetTitle className="text-gray-800 text-center text-[18px]">
              {title || defaultTitle}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {language === 'ko' 
                ? '사진을 촬영하거나 갤러리에서 선택하세요' 
                : 'Take a photo or choose from gallery'}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-2 px-4">
            {/* Take Photo Option */}
            <button
              onClick={handleTakePhoto}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#3674B5]/10 flex items-center justify-center flex-shrink-0">
                <Camera className="text-[#3674B5]" size={24} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-gray-800 text-[17px]">
                  {language === 'ko' ? '사진 촬영' : 'Take Photo'}
                </div>
                <div className="text-gray-500 text-[15px]">
                  {language === 'ko' ? '카메라로 새 사진 촬영' : 'Use camera to take a new photo'}
                </div>
              </div>
            </button>

            {/* Choose from Gallery Option */}
            <button
              onClick={handleChooseFromGallery}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#3674B5]/10 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="text-[#3674B5]" size={24} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-gray-800 text-[17px]">
                  {language === 'ko' ? '갤러리에서 선택' : 'Choose from Gallery'}
                </div>
                <div className="text-gray-500 text-[15px]">
                  {language === 'ko' ? '기존 사진에서 선택' : 'Select from existing photos'}
                </div>
              </div>
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="w-full p-4 rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors mt-4"
            >
              <div className="text-gray-800 text-[17px]">
                {language === 'ko' ? '취소' : 'Cancel'}
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
