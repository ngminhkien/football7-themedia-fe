import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, X, Check, Copy, ExternalLink } from 'lucide-react';
import { SplitPlan } from '../../../api/types';
import { usePublishMatch } from '../../../api/hooks/useAdmin';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { fireTeamSplitConfetti } from '../../../components/fx/confetti';

export interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SplitPlan | null;
  onSuccess?: () => void;
}

export const PublishDialog: React.FC<PublishDialogProps> = ({
  isOpen,
  onClose,
  plan,
  onSuccess,
}) => {
  const toast = useToast();
  const publishMutation = usePublishMatch();

  const [teamAName, setTeamAName] = useState('');
  const [teamBName, setTeamBName] = useState('');
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (plan) {
      setTeamAName(plan.teamA.name || 'Đội Vàng The Media');
      setTeamBName(plan.teamB.name || 'Đội Xanh The Media');
      setPublishedSuccess(false);
      setCopied(false);
    }
  }, [plan, isOpen]);

  if (!isOpen || !plan) return null;

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    try {
      await publishMutation.mutateAsync({
        matchId: plan.matchId,
        names: {
          teamAName: teamAName.trim() || 'Đội Vàng',
          teamBName: teamBName.trim() || 'Đội Xanh',
        },
      });

      fireTeamSplitConfetti();
      setPublishedSuccess(true);
      toast.success('Đội hình trận đấu đã được phát hành công khai.', 'Công bố thành công!');
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Không thể công bố kết quả trận đấu';
      toast.error(errorMsg, 'Lỗi công bố');
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/result`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.info('Link trang kết quả đã lưu vào bộ nhớ tạm.', 'Đã sao chép link');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg p-6 rounded-3xl bg-pitch-panel border border-pitch-line/80 shadow-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-pitch-muted hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!publishedSuccess ? (
            <form onSubmit={handlePublish} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-accent-neon mb-1">
                  <Send className="w-5 h-5" />
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                    Công Bố Phương Án #{plan.rank}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-pitch-muted">
                  Đặt tên cho 2 đội trước khi đưa lên trang xem công khai của Nội bộ The Media.
                </p>
              </div>

              {/* Team Name Inputs */}
              <div className="space-y-3 p-4 rounded-2xl bg-pitch-dark/80 border border-pitch-line/60">
                <div>
                  <label className="block text-xs font-semibold text-emerald-400 mb-1">
                    Tên Đội A (Vàng)
                  </label>
                  <input
                    value={teamAName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamAName(e.target.value)}
                    placeholder="Ví dụ: FC The Media Vàng"
                    required
                    className="w-full h-10 px-3 rounded-xl bg-pitch-dark/50 border border-pitch-line/50 text-white placeholder:text-pitch-muted focus:outline-none focus:border-emerald-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cyan-400 mb-1">
                    Tên Đội B (Xanh)
                  </label>
                  <input
                    value={teamBName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeamBName(e.target.value)}
                    placeholder="Ví dụ: FC The Media Xanh"
                    required
                    className="w-full h-10 px-3 rounded-xl bg-pitch-dark/50 border border-pitch-line/50 text-white placeholder:text-pitch-muted focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-accent-neon/10 border border-accent-neon/30 text-xs text-accent-neon">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Bảo mật:</strong> Trang kết quả công khai chỉ hiển thị tên cầu thủ, vị trí và tổng điểm cân bằng của 2 đội. Điểm cá nhân và danh sách né sẽ được giấu tuyệt đối.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={publishMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="neon"
                  disabled={publishMutation.isPending || !teamAName.trim() || !teamBName.trim()}
                  className="shadow-[0_0_20px_rgba(232,255,58,0.3)] font-bold"
                >
                  {publishMutation.isPending ? 'Đang phát hành...' : 'Xác Nhận & Công Bố'}
                </Button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-display font-black text-2xl text-white">
                  ĐÃ CÔNG BỐ KẾT QUẢ!
                </h3>
                <p className="text-xs sm:text-sm text-pitch-muted mt-1.5 max-w-sm mx-auto">
                  Trận đấu giữa <strong>{teamAName}</strong> và <strong>{teamBName}</strong> đã xuất hiện trên trang kết quả công khai.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto"
                >
                  {copied ? <Check className="w-4 h-4 mr-1.5 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1.5" />}
                  {copied ? 'Đã sao chép' : 'Sao chép link'}
                </Button>

                <Button
                  variant="neon"
                  onClick={() => window.open('/result', '_blank')}
                  className="w-full sm:w-auto shadow-[0_0_15px_rgba(232,255,58,0.3)] font-bold"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  Mở trang kết quả
                </Button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-pitch-muted hover:text-white underline"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
