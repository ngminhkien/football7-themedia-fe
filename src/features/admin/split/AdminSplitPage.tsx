import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  EyeOff,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  useAdminPlayers,
  useAdminWarnings,
  useSplitTeams,
  useUnpublishMatch,
  useUpdatePlayerTier,
} from '../../../api/hooks/useAdmin';
import { useResult } from '../../../api/hooks/useResult';
import { PlayerTier } from '../../../api/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import { WarningsPanel } from '../players/WarningsPanel';
import { TierPanel } from './TierPanel';
import { LockPanel } from './LockPanel';
import { SplitControls } from './SplitControls';
import { PlanCard } from './PlanCard';
import { PlanCompare } from './PlanCompare';
import { PublishDialog } from './PublishDialog';
import { useSplitSession } from './useSplitSession';
import { ShuffleReveal } from '../../../components/fx/ShuffleReveal';
import { ConfirmDialog } from '../players/ConfirmDialog';

export const AdminSplitPage: React.FC = () => {
  const toast = useToast();

  const playersQuery = useAdminPlayers();
  const warningsQuery = useAdminWarnings();
  const resultQuery = useResult();

  const splitMutation = useSplitTeams();
  const unpublishMutation = useUnpublishMatch();
  const tierMutation = useUpdatePlayerTier();

  const {
    plans,
    selectedPlan,
    selectedPlanIndex,
    setSelectedPlanIndex,
    lockedTeamA,
    lockedTeamB,
    togglePlayerLock,
    clearLocks,
    allowIncomplete,
    setAllowIncomplete,
    weights,
    setWeights,
    resetWeights,
    history,
    activeHistoryId,
    selectHistory,
    pushPlans,
  } = useSplitSession();

  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isUnpublishConfirmOpen, setIsUnpublishConfirmOpen] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const players = playersQuery.data || [];
  const warnings = warningsQuery.data?.items || [];
  const publishedResult = resultQuery.data;

  // Analysis of whether splitting is permitted
  const activePlayers = players.filter((p) => p.isActive);
  const hasCriticalError = warnings.some((w) => w.level === 'error');
  const hasUnsubmittedWarn = warnings.some((w) => w.code === 'NOT_ALL_SUBMITTED');

  let canSplit = true;
  let disabledReason: string | undefined;

  if (activePlayers.length !== 14) {
    canSplit = false;
    disabledReason = `Cần chính xác 14 cầu thủ kích hoạt để chia 2 đội sân 7 (hiện có ${activePlayers.length} người).`;
  } else if (hasCriticalError) {
    canSplit = false;
    const err = warnings.find((w) => w.level === 'error');
    disabledReason = err ? err.message : 'Vẫn còn lỗi dữ liệu bắt buộc cần xử lý trước khi chia.';
  } else if (hasUnsubmittedWarn && !allowIncomplete) {
    canSplit = false;
    disabledReason = 'Chưa đủ 14 cầu thủ nộp khảo sát vị trí. Bật công tắc "Vẫn chia dù chưa nộp đủ" để bỏ qua.';
  }

  // Execute Split
  const handlePerformSplit = async (isJitter = false) => {
    if (!canSplit && !isJitter) return;

    setIsShuffling(true);
    try {
      const response = await splitMutation.mutateAsync({
        lockedTeamA,
        lockedTeamB,
        topN: 3,
        jitter: isJitter ? 0.6 : 0,
        seed: Math.floor(Math.random() * 1000000),
        allowIncomplete,
        weights,
      });

      if (response.plans && response.plans.length > 0) {
        pushPlans(response.plans);
        toast.success(`Đã tìm thấy ${response.plans.length} phương án tối ưu nhất.`, isJitter ? 'Đã chia lại (Jitter 0.6)!' : 'Chia đội thành công!');
      } else {
        toast.error('Thuật toán không thể tìm thấy phương án nào thỏa mãn các ràng buộc cứng.', 'Không tìm thấy phương án');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi trong quá trình tính toán chia đội';
      toast.error(msg, 'Thất bại');
    } finally {
      setIsShuffling(false);
    }
  };

  // Handle Unpublish
  const handleConfirmUnpublish = async () => {
    try {
      await unpublishMutation.mutateAsync();
      setIsUnpublishConfirmOpen(false);
      toast.info('Trang kết quả đã quay lại trạng thái chưa công bố.', 'Đã gỡ công khai');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể gỡ kết quả';
      toast.error(msg, 'Lỗi');
    }
  };

  // Handle Tier Change
  const handleTierChange = async (playerId: number, tier: PlayerTier) => {
    try {
      await tierMutation.mutateAsync({ id: playerId, tier });
      toast.success('Đã cập nhật nhóm thực lực thành công.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật nhóm thực lực';
      toast.error(msg, 'Thất bại');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner: Status & Unpublish Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-pitch-panel/90 border border-pitch-line/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide">
              COCKPIT CHIA ĐỘI THE MEDIA
            </h2>
            {publishedResult && (
              <Badge variant="neon" size="sm" className="gap-1 font-bold animate-pulse">
                <Globe className="w-3.5 h-3.5" />
                <span>Đang công khai</span>
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-pitch-muted mt-1">
            Giải bài toán 1.716 tổ hợp tối ưu hóa lực chiến và nguyện vọng né tránh của anh em.
          </p>
        </div>

        {publishedResult && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/result', '_blank')}
              className="text-xs text-accent-neon border-accent-neon/40 hover:bg-accent-neon/10"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Xem công khai
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUnpublishConfirmOpen(true)}
              disabled={unpublishMutation.isPending}
              className="text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300"
            >
              <EyeOff className="w-3.5 h-3.5 mr-1" />
              Gỡ công khai
            </Button>
          </div>
        )}
      </div>

      {/* Warnings & Diagnostics Panel */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase font-mono tracking-wider text-pitch-muted font-bold px-1">
          1. Kiểm tra điều kiện đầu vào
        </h3>
        <WarningsPanel warnings={warnings} players={players} />
      </div>

      {/* Tier Panel */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase font-mono tracking-wider text-pitch-muted font-bold px-1">
          Phân nhóm thực lực cầu thủ
        </h3>
        <TierPanel
          players={players}
          onChangeTier={handleTierChange}
          isLoading={tierMutation.isPending}
        />
      </div>

      {/* Lock Panel */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase font-mono tracking-wider text-pitch-muted font-bold px-1">
          2. Ghim vị trí / đội cố định (Tùy chọn)
        </h3>
        <LockPanel
          players={players}
          lockedTeamA={lockedTeamA}
          lockedTeamB={lockedTeamB}
          onToggleLock={togglePlayerLock}
          onClearLocks={clearLocks}
        />
      </div>

      {/* Split Controls */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase font-mono tracking-wider text-pitch-muted font-bold px-1">
          3. Thực thi thuật toán
        </h3>
        <SplitControls
          onSplit={() => handlePerformSplit(false)}
          onResplit={() => handlePerformSplit(true)}
          isSplitting={splitMutation.isPending || isShuffling}
          hasPlans={plans.length > 0}
          canSplit={canSplit}
          disabledReason={disabledReason}
          allowIncomplete={allowIncomplete}
          onToggleAllowIncomplete={setAllowIncomplete}
          weights={weights}
          onChangeWeights={setWeights}
          onResetWeights={resetWeights}
          history={history}
          activeHistoryId={activeHistoryId}
          onSelectHistory={selectHistory}
        />
      </div>

      {/* Shuffling animation during split */}
      {isShuffling && (
        <ShuffleReveal
          isRevealed={false}
          title="THUẬT TOÁN ĐANG GIẢI 1.716 TỔ HỢP..."
          durationMs={1200}
        >
          <div />
        </ShuffleReveal>
      )}

      {/* Resulting Plans Showcase */}
      {plans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs uppercase font-mono tracking-wider text-accent-neon font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              4. Các phương án chia tối ưu (Top {plans.length})
            </h3>
            <span className="text-xs text-pitch-muted">
              Bấm vào từng card để xem chi tiết đội hình trên sân
            </span>
          </div>

          {/* 3 Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <PlanCard
                key={`plan-${plan.rank}-${index}`}
                plan={plan}
                isSelected={index === selectedPlanIndex}
                onSelect={() => setSelectedPlanIndex(index)}
              />
            ))}
          </div>

          {/* Selected Plan Tactical Detailed View */}
          {selectedPlan && (
            <motion.div
              key={`compare-${selectedPlan.rank}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="mt-6"
            >
              <PlanCompare
                plan={selectedPlan}
                onOpenPublish={() => setIsPublishDialogOpen(true)}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty State when no plans generated yet */}
      {plans.length === 0 && !isShuffling && (
        <div className="p-10 rounded-3xl bg-pitch-panel/50 border border-pitch-line/50 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-accent-neon/10 border border-accent-neon/20 mx-auto flex items-center justify-center text-accent-neon">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-display font-bold text-lg text-white">
            Chưa có phương án nào trong phiên này
          </h4>
          <p className="text-xs text-pitch-muted max-w-md mx-auto">
            Sau khi kiểm tra điều kiện và ghim cầu thủ (nếu có), hãy bấm nút <strong>BẮT ĐẦU CHIA ĐỘI</strong> ở trên để hệ thống tạo 3 phương án tối ưu nhất.
          </p>
        </div>
      )}

      {/* Publish Dialog */}
      <PublishDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        plan={selectedPlan}
        onSuccess={() => {
          resultQuery.refetch();
        }}
      />

      {/* Confirm Unpublish Dialog */}
      <ConfirmDialog
        isOpen={isUnpublishConfirmOpen}
        onClose={() => setIsUnpublishConfirmOpen(false)}
        onConfirm={handleConfirmUnpublish}
        title="Gỡ công khai kết quả trận đấu?"
        description="Trang kết quả (/result) sẽ không còn hiển thị thông tin 2 đội. Thành viên truy cập sẽ nhận được thông báo chưa có kết quả."
        confirmLabel="Xác nhận gỡ"
        cancelLabel="Để lại"
        variant="danger"
        isLoading={unpublishMutation.isPending}
      />
    </div>
  );
};

export default AdminSplitPage;
