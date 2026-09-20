import React, { useState } from 'react';
import { UserPlus, RefreshCw } from 'lucide-react';
import { useAdminPlayers, useWarnings } from '../../../api/hooks/useAdmin';
import { useSettings } from '../../../api/hooks/useSettings';
import { deleteAdminPlayer } from '../../../api/admin';
import { useToast } from '../../../components/ui/Toast';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../api/queryKeys';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorState } from '../../../components/ui/ErrorState';
import { SubmissionProgress } from './SubmissionProgress';
import { RegistrationToggle } from './RegistrationToggle';
import { WarningsPanel } from './WarningsPanel';
import { AvoidGraph } from './AvoidGraph';
import { PlayersTable } from './PlayersTable';
import { AddPlayerDialog } from './AddPlayerDialog';
import { EditPlayerDialog } from './EditPlayerDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { AdminPlayer } from '../../../api/types';

export const AdminPlayersPage: React.FC = () => {
  const { data: players, isLoading: isPlayersLoading, error: playersError, refetch: refetchPlayers } = useAdminPlayers();
  const { data: warningsData, isLoading: isWarningsLoading, refetch: refetchWarnings } = useWarnings();
  const { data: settings } = useSettings();

  const toast = useToast();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<AdminPlayer | null>(null);
  const [deletingPlayer, setDeletingPlayer] = useState<AdminPlayer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deletingPlayer) return;
    setIsDeleting(true);
    try {
      await deleteAdminPlayer(deletingPlayer.id);
      toast.success(`Đã xóa cầu thủ "${deletingPlayer.name}" thành công!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.adminPlayers });
      queryClient.invalidateQueries({ queryKey: queryKeys.warnings });
      setDeletingPlayer(null);
    } catch {
      toast.error('Không thể xóa cầu thủ.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPlayersLoading || isWarningsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  if (playersError || !players) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorState
          title="Không thể tải dữ liệu quản trị"
          message="Vui lòng kiểm tra lại quyền truy cập hoặc kết nối backend."
          onRetry={() => {
            refetchPlayers();
            refetchWarnings();
          }}
        />
      </div>
    );
  }

  const warnings = warningsData?.items || [];

  return (
    <div className="space-y-6">
      {/* Top Controls: Add Player & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="neon"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="gap-2 text-xs font-bold"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Cầu Thủ Mới</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refetchPlayers();
              refetchWarnings();
              toast.info('Đã làm mới dữ liệu!');
            }}
            className="text-xs text-pitch-muted hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
        </div>

        <span className="text-xs text-pitch-muted font-mono">
          Hiện có: <strong className="text-white">{players.filter((p) => p.isActive).length}/14</strong> cầu thủ active
        </span>
      </div>

      {/* Warnings Panel */}
      <WarningsPanel warnings={warnings} players={players} />

      {/* Progress & Registration Toggle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubmissionProgress players={players} />
        <RegistrationToggle isOpen={settings?.registrationOpen ?? true} />
      </div>

      {/* Avoid Graph */}
      <AvoidGraph players={players} />

      {/* Main Players Table with Inline Scoring */}
      <div className="space-y-3">
        <h3 className="text-lg font-display uppercase tracking-wider text-white font-bold">
          Danh Sách & Bảng Điểm Thực Lực
        </h3>
        <PlayersTable
          players={players}
          onEditPlayer={(p) => setEditingPlayer(p)}
          onDeletePlayer={(p) => setDeletingPlayer(p)}
        />
      </div>

      {/* Dialogs */}
      <AddPlayerDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      <EditPlayerDialog
        player={editingPlayer}
        isOpen={editingPlayer !== null}
        onClose={() => setEditingPlayer(null)}
      />

      <ConfirmDialog
        isOpen={deletingPlayer !== null}
        onClose={() => setDeletingPlayer(null)}
        onConfirm={handleDeleteConfirm}
        title="Xóa Cầu Thủ?"
        description={`Bạn có chắc chắn muốn xóa "${deletingPlayer?.name}" khỏi danh sách? Mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn.`}
        confirmLabel="Xóa Cầu Thủ"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
