import React, { useState, useEffect } from 'react';
import { updateAdminPlayer } from '../../../api/admin';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Field, Input } from '../../../components/ui/Field';
import { AdminPlayer } from '../../../api/types';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import { ApiError } from '../../../api/errors';

export interface EditPlayerDialogProps {
  player: AdminPlayer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPlayerDialog: React.FC<EditPlayerDialogProps> = ({
  player,
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (player) {
      setName(player.name);
      setIsActive(player.isActive);
    }
  }, [player]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player || !name.trim()) return;

    setIsLoading(true);
    try {
      await updateAdminPlayer(player.id, {
        name: name.trim(),
        isActive,
      });
      toast.success('Cập nhật thông tin cầu thủ thành công!');
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPlayers });
      queryClient.invalidateQueries({ queryKey: queryKeys.warnings });
      onClose();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === 'NAME_TAKEN') {
        toast.error('Tên này đã tồn tại trong danh sách!');
      } else {
        toast.error(apiErr.message || 'Không thể cập nhật cầu thủ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!player) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Chỉnh Sửa: ${player.name}`}
      description="Cập nhật tên hoặc bật/tắt trạng thái thi đấu của cầu thủ."
      maxWidth="sm"
    >
      <form onSubmit={handleUpdate} className="space-y-4">
        <Field label="Tên cầu thủ" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên cầu thủ..."
          />
        </Field>

        <label className="flex items-center gap-2.5 p-3 rounded-xl bg-pitch-dark/70 border border-pitch-line/50 cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-[#E8FF3A] rounded cursor-pointer"
          />
          <div>
            <span className="font-semibold text-white">Đang hoạt động (Active)</span>
            <p className="text-pitch-muted text-[11px]">
              Nếu tắt, cầu thủ sẽ không tham gia vào danh sách chia đội tuần này.
            </p>
          </div>
        </label>

        <div className="flex justify-end gap-2 pt-4 border-t border-pitch-line/50">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="neon" size="sm" isLoading={isLoading} disabled={!name.trim() || isLoading}>
            Lưu Thay Đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
};
