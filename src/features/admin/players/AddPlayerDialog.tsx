import React, { useState } from 'react';
import { createAdminPlayer } from '../../../api/admin';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Field, Input } from '../../../components/ui/Field';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import { ApiError } from '../../../api/errors';

export interface AddPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPlayerDialog: React.FC<AddPlayerDialogProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Vui lòng nhập tên cầu thủ');
      return;
    }

    setIsLoading(true);
    try {
      await createAdminPlayer(name.trim());
      toast.success(`Đã thêm cầu thủ "${name.trim()}" thành công!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPlayers });
      queryClient.invalidateQueries({ queryKey: queryKeys.warnings });
      setName('');
      onClose();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.code === 'NAME_TAKEN') {
        toast.error('Tên cầu thủ này đã tồn tại trong danh sách! Vui lòng thêm biệt danh phân biệt.');
      } else {
        toast.error(apiErr.message || 'Không thể thêm cầu thủ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm Cầu Thủ Mới"
      description="Thêm thành viên mới vào danh sách đội bóng The Media."
      maxWidth="sm"
    >
      <form onSubmit={handleAdd} className="space-y-4">
        <Field label="Họ và tên hoặc biệt danh" required hint="Ví dụ: Hoàng Đức, Hùng Đen, Văn Hậu...">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên..."
            autoFocus
          />
        </Field>

        <div className="flex justify-end gap-2 pt-4 border-t border-pitch-line/50">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="neon" size="sm" isLoading={isLoading} disabled={!name.trim() || isLoading}>
            Thêm Ngay
          </Button>
        </div>
      </form>
    </Modal>
  );
};
