import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { Share2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export interface ShareButtonProps {
  cardRef: React.RefObject<HTMLDivElement>;
  matchId: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ cardRef, matchId }) => {
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  const handleShareOrDownload = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);
    try {
      // Ensure all custom fonts (Bebas Neue, Be Vietnam Pro) are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small delay to ensure any layout reflow finishes
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#06251B',
      });

      const fileName = `chia-doi-the-media-tran-${matchId}.png`;

      // Check if native mobile sharing is supported with files
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Kết quả chia đội SÂN 7 – The Media',
            text: 'Đội hình thi đấu trận bóng nội bộ The Media đã được phân chia cân bằng!',
          });
          toast.success('Đã chia sẻ hình ảnh thành công!');
          setIsExporting(false);
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
      toast.success('Đã tải xuống ảnh đội hình sắc nét!', 'Thành công');
    } catch (error) {
      toast.error('Không thể tạo ảnh đội hình. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="neon"
      size="md"
      isLoading={isExporting}
      onClick={handleShareOrDownload}
      className="gap-2 shadow-[0_0_20px_rgba(232,255,58,0.4)]"
    >
      <Share2 className="w-4 h-4" />
      <span>Xuất Ảnh Gửi Zalo / Nhóm</span>
    </Button>
  );
};
