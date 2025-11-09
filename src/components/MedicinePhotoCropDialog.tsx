import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import { useLanguage } from './LanguageContext';

interface MedicinePhotoCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

export function MedicinePhotoCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete
}: MedicinePhotoCropDialogProps) {
  const { language } = useLanguage();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaChange = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas is empty'));
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImageBlob);
      onOpenChange(false);
      
      // Reset state
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset state
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <Dialog open={open && !!imageSrc} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 bg-white overflow-hidden">
        <DialogTitle className="sr-only">
          {language === 'ko' ? '약 사진 편집' : 'Edit Medicine Photo'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {language === 'ko' 
            ? '약 사진을 자르고 크기를 조정합니다. 확대/축소 및 회전 컨트롤을 사용하세요.' 
            : 'Crop and resize your medicine photo. Use zoom and rotation controls.'}
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 pr-12 border-b border-gray-200">
          <h2 className="text-gray-800 text-[16px]" aria-hidden="true">
            {language === 'ko' ? '약 사진 편집' : 'Edit Medicine Photo'}
          </h2>
        </div>

        {/* Crop Area */}
        <div className="relative w-full h-[400px] bg-gray-900">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={4 / 3}
              cropShape="rect"
              showGrid={true}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropAreaChange}
            />
          )}
        </div>

        {/* Controls */}
        <div className="p-6 space-y-6 bg-white">
          {/* Zoom Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 text-[16px]">
                {language === 'ko' ? '확대/축소' : 'Zoom'}
              </label>
              <div className="flex items-center gap-2 text-gray-600">
                <ZoomOut size={16} />
                <span className="text-xs min-w-[3ch] text-center text-[16px]">
                  {Math.round(zoom * 100)}%
                </span>
                <ZoomIn size={16} />
              </div>
            </div>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Rotation Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 text-[16px]">
                {language === 'ko' ? '회전' : 'Rotation'}
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="h-8 px-3 text-gray-700 border-gray-200 text-[16px]"
              >
                <RotateCw size={16} className="mr-2" />
                {language === 'ko' ? '90° 회전' : 'Rotate 90°'}
              </Button>
            </div>
            <Slider
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              min={0}
              max={360}
              step={1}
              className="w-full"
            />
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 text-center text-[16px]">
            {language === 'ko'
              ? '사진을 드래그하여 위치를 조정하고 확대/축소 및 회전할 수 있습니다'
              : 'Drag the photo to reposition and use zoom/rotation controls'}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50 text-[16px]"
              disabled={isProcessing}
            >
              {language === 'ko' ? '취소' : 'Cancel'}
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-[#3674B5] hover:bg-[#3674B5]/90 text-white text-[16px]"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                  {language === 'ko' ? '처리 중...' : 'Processing...'}
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  {language === 'ko' ? '적용' : 'Apply'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
