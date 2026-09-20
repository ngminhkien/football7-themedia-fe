import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Shuffle, LogOut, RotateCcw, AlertTriangle, ExternalLink } from 'lucide-react';
import { clearAdminToken } from '../../lib/auth';
import { resetSystem } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Field';
import { useQueryClient } from '@tanstack/react-query';

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [keepScores, setKeepScores] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogout = () => {
    clearAdminToken();
    toast.info('Đã đăng xuất khỏi tài khoản quản trị.');
    navigate('/admin/login');
  };

  const handleReset = async () => {
    if (resetConfirmText.trim() !== 'RESET') {
      toast.warning('Vui lòng gõ đúng chữ "RESET" để xác nhận!');
      return;
    }

    setIsResetting(true);
    try {
      await resetSystem(keepScores);
      toast.success('Hệ thống đã được reset sang tuần thi đấu mới!', 'Reset thành công');
      setIsResetOpen(false);
      setResetConfirmText('');
      // Invalidate all admin and public queries
      queryClient.invalidateQueries();
    } catch {
      toast.error('Không thể reset hệ thống. Vui lòng thử lại.');
    } finally {
      setIsResetting(false);
    }
  };

  const isPlayersTab = location.pathname === '/admin';
  const isSplitTab = location.pathname === '/admin/split';

  return (
    <div className="space-y-6 pb-16">
      {/* Admin Subheader & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pitch-line/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 uppercase">
              Quản Trị Viên
            </span>
            <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-white font-black">
              Bảng Điều Khiển The Media
            </h1>
          </div>
          <p className="text-xs text-pitch-muted mt-1">
            Quản trị danh sách 14 cầu thủ, chấm điểm năng lực, kiểm tra xung đột và phân chia 2 đội bóng.
          </p>
        </div>

        {/* Tab Buttons & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin">
            <Button
              variant={isPlayersTab ? 'neon' : 'secondary'}
              size="sm"
              className="gap-1.5 text-xs font-semibold"
            >
              <Users className="w-4 h-4" />
              <span>Người chơi & Điểm danh</span>
            </Button>
          </Link>

          <Link to="/admin/split">
            <Button
              variant={isSplitTab ? 'neon' : 'secondary'}
              size="sm"
              className="gap-1.5 text-xs font-semibold"
            >
              <Shuffle className="w-4 h-4" />
              <span>Chia đội (Cockpit)</span>
            </Button>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsResetOpen(true)}
            className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 gap-1.5"
            title="Reset dữ liệu cho trận tuần mới"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tuần Mới</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs text-pitch-muted hover:text-white hover:bg-white/5 gap-1.5"
            title="Đăng xuất"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </Button>

          <Link to="/" target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-pitch-muted hover:text-accent-neon"
              title="Mở trang chủ công khai"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Tab Content */}
      <div>{children}</div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        title="Reset Dữ Liệu Cho Tuần Mới"
        description="Thao tác này sẽ xóa toàn bộ phiếu đăng ký và kết quả trận đấu đã chia."
        maxWidth="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsResetOpen(false)}>
              Hủy bỏ
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isResetting}
              disabled={resetConfirmText.trim() !== 'RESET' || isResetting}
              onClick={handleReset}
              className="gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Xác Nhận Reset</span>
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs text-pitch-text">
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 space-y-1">
            <p className="font-semibold flex items-center gap-1.5 text-rose-100">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              Cảnh báo quan trọng:
            </p>
            <ul className="list-disc pl-5 space-y-0.5 text-rose-300/90">
              <li>Xóa toàn bộ submission (vị trí đã chọn, người né, điểm tự chấm) của người chơi.</li>
              <li>Hủy công bố kết quả trận đấu hiện tại (trang /result sẽ trở về trạng thái chưa chia).</li>
              <li>Danh sách tên cầu thủ The Media vẫn được giữ nguyên.</li>
            </ul>
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-pitch-dark/60 border border-pitch-line/50 cursor-pointer">
            <input
              type="checkbox"
              checked={keepScores}
              onChange={(e) => setKeepScores(e.target.checked)}
              className="w-4 h-4 accent-[#E8FF3A] rounded cursor-pointer"
            />
            <span>Giữ lại điểm đánh giá thực lực Admin (AdminScore) của cầu thủ</span>
          </label>

          <div className="space-y-1.5 pt-2">
            <label className="block text-pitch-muted">
              Nhập chữ <strong className="text-rose-400 font-mono">RESET</strong> vào ô dưới đây để xác nhận:
            </label>
            <Input
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              placeholder="Gõ RESET..."
              className="font-mono text-center uppercase tracking-widest text-sm"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
