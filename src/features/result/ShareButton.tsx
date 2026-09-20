import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Image, Users, LayoutTemplate } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';

export interface ShareButtonProps {
  cardRef: React.RefObject<HTMLDivElement>;
  teamARef: React.RefObject<HTMLDivElement>;
  teamBRef: React.RefObject<HTMLDivElement>;
  matchId: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ cardRef, teamARef, teamBRef, matchId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportingType, setExportingType] = useState<string | null>(null);
  const toast = useToast();

  const handleShareOrDownload = async (refToCapture: React.RefObject<HTMLDivElement>, typeName: string, suffix: string) => {
    if (!refToCapture.current) return;

    setIsExporting(true);
    setExportingType(typeName);
    try {
      // Ensure all custom fonts (Bebas Neue, Be Vietnam Pro) are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small delay to ensure any layout reflow finishes
      await new Promise((resolve) => setTimeout(resolve, 150));

      // WARMUP RENDER: Workaround for iOS/Safari blank image bug
      // Calling toPng once and discarding the result forces the browser to paint SVG/Fonts
      await toPng(refToCapture.current, { cacheBust: true }).catch(() => {});
      
      const dataUrl = await toPng(refToCapture.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#06251B',
      });

      const fileName = `the-media-tran-${matchId}-${suffix}.png`;

      // Check if native mobile sharing is supported with files
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Kết quả đội hình ${typeName} – The Media`,
            text: `Đội hình thi đấu trận bóng nội bộ The Media: ${typeName}!`,
          });
          toast.success(`Đã chia sẻ ảnh ${typeName} thành công!`);
          setIsExporting(false);
          setExportingType(null);
          setIsOpen(false);
          return;
        } catch (shareErr: unknown) {
          if ((shareErr as Error).name !== 'AbortError') {
            // Fall through to download if share cancelled or failed
          }
        }
      }

      // Direct download fallback
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
      toast.success(`Đã tải ảnh ${typeName} thành công!`, 'Thành công');
      setIsOpen(false);
    } catch (error) {
      toast.error('Không thể tạo ảnh đội hình. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
      setExportingType(null);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="neon"
        size="md"
        onClick={() => setIsOpen(true)}
        className="gap-2 shadow-[0_0_20px_rgba(232,255,58,0.4)]"
      >
        <Share2 className="w-4 h-4" />
        <span>Xuất Ảnh / Zalo</span>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => !isExporting && setIsOpen(false)}
        title="Tải ảnh kết quả"
        description="Chọn định dạng ảnh đội hình bạn muốn lưu về máy hoặc chia sẻ lên Zalo:"
        maxWidth="md"
      >
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="justify-start h-14 hover:border-accent-neon hover:text-accent-neon hover:bg-accent-neon/5"
            onClick={() => handleShareOrDownload(cardRef, 'Tổng hợp', 'tong-hop')}
            isLoading={exportingType === 'Tổng hợp'}
            disabled={isExporting}
          >
            <LayoutTemplate className="w-5 h-5 mr-3 text-pitch-muted" />
            <div className="text-left">
              <div className="font-bold">Ảnh Tổng Hợp (Cả 2 đội)</div>
              <div className="text-xs text-pitch-muted font-normal mt-0.5">Khổ ngang 1080px (Thích hợp xem trên PC)</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-14 hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5"
            onClick={() => handleShareOrDownload(teamARef, 'Đội A', 'doi-a')}
            isLoading={exportingType === 'Đội A'}
            disabled={isExporting}
          >
            <Image className="w-5 h-5 mr-3 text-emerald-500/70" />
            <div className="text-left">
              <div className="font-bold">Chỉ xuất ảnh Đội A</div>
              <div className="text-xs text-pitch-muted font-normal mt-0.5">Khổ dọc 720px (Tối ưu xem trên điện thoại)</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="justify-start h-14 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/5"
            onClick={() => handleShareOrDownload(teamBRef, 'Đội B', 'doi-b')}
            isLoading={exportingType === 'Đội B'}
            disabled={isExporting}
          >
            <Users className="w-5 h-5 mr-3 text-cyan-500/70" />
            <div className="text-left">
              <div className="font-bold">Chỉ xuất ảnh Đội B</div>
              <div className="text-xs text-pitch-muted font-normal mt-0.5">Khổ dọc 720px (Tối ưu xem trên điện thoại)</div>
            </div>
          </Button>
        </div>
      </Modal>
    </>
  );
};
