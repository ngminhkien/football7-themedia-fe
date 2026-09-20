import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { updateAdminSettings } from '../../../api/admin';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';

export interface RegistrationToggleProps {
  isOpen: boolean;
}

export const RegistrationToggle: React.FC<RegistrationToggleProps> = ({ isOpen }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (targetState: boolean) => {
    if (!targetState && isOpen) {
      // Prompt confirmation before closing
      setIsConfirmModalOpen(true);
      return;
    }
    await executeToggle(targetState);
  };

  const executeToggle = async (targetState: boolean) => {
    setIsUpdating(true);
    try {
      await updateAdminSettings(targetState);
      toast.success(
        targetState ? 'Đã mở cổng đăng ký thi đấu!' : 'Đã khóa cổng đăng ký thi đấu!',
        'Cài đặt trận đấu'
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      setIsConfirmModalOpen(false);
    } catch {
      toast.error('Không thể thay đổi trạng thái đăng ký.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-pitch-panel/80 border border-pitch-line/80 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isOpen ? (
              <Unlock className="w-4 h-4 text-accent-neon" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400" />
            )}
            <h4 className="text-sm font-semibold text-white">
              Cổng Khai Báo Vị Trí: {isOpen ? 'ĐANG MỞ' : 'ĐÃ KHÓA'}
            </h4>
          </div>
          <p className="text-xs text-pitch-muted">
            {isOpen
              ? 'Cầu thủ có thể truy cập trang chủ / để nộp hoặc chỉnh sửa vị trí.'
              : 'Người chơi truy cập / sẽ thấy thông báo sân đã chốt sổ, không thể nộp phiếu mới.'}
          </p>
        </div>

        {/* Big Toggle Switch Button */}
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => handleToggle(!isOpen)}
          className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isOpen ? 'bg-accent-neon shadow-[0_0_15px_rgba(232,255,58,0.5)]' : 'bg-pitch-dark border-pitch-line'
          }`}
          aria-label="Đổi trạng thái mở/đóng cổng khai báo"
        >
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-pitch-dark shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center text-xs font-bold ${
              isOpen ? 'translate-x-8 text-accent-neon' : 'translate-x-0 text-pitch-muted'
            }`}
          >
            {isOpen ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Confirmation Modal when Closing */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Khóa Cổng Khai Báo?"
        description="Khi khóa, cầu thủ sẽ không thể nộp hoặc chỉnh sửa phiếu đăng ký được nữa."
        maxWidth="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="neon"
              size="sm"
              isLoading={isUpdating}
              onClick={() => executeToggle(false)}
            >
              Xác Nhận Khóa Sân
            </Button>
          </>
        }
      >
        <p className="text-xs text-pitch-muted">
          Bạn nên khóa cổng khai báo sau khi đã thu thập đủ 14 cầu thủ hoặc đến giờ chốt sổ để tiến hành bốc thăm chia đội.
        </p>
      </Modal>
    </>
  );
};
