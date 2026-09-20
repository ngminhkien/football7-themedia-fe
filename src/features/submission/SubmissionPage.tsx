import React, { useReducer, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { usePlayers } from '../../api/hooks/usePlayers';
import { useSettings } from '../../api/hooks/useSettings';
import { submitPlayer } from '../../api/players';
import { useToast } from '../../components/ui/Toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ProgressPitch } from './components/ProgressPitch';
import { ClosedNotice } from './components/ClosedNotice';
import { StepName } from './steps/StepName';
import { StepPositions } from './steps/StepPositions';
import { StepAvoid } from './steps/StepAvoid';
import { StepScore } from './steps/StepScore';
import { StepDone } from './steps/StepDone';
import {
  initialWizardState,
  wizardReducer,
} from './wizardReducer';
import {
  saveSubmissionDraft,
  saveSubmittedRecord,
  saveLastPlayerId,
} from './draftStorage';
import { ApiError } from '../../api/errors';

export const SubmissionPage: React.FC = () => {
  const toast = useToast();
  const { data: players, isLoading: isPlayersLoading, error: playersError, refetch: refetchPlayers } = usePlayers();
  const { data: settings, isLoading: isSettingsLoading } = useSettings();

  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);

  // Auto save draft whenever player data changes
  useEffect(() => {
    if (state.playerId) {
      saveSubmissionDraft({
        playerId: state.playerId,
        positions: state.positions,
        preferredPosition: state.preferredPosition || undefined,
        avoidIds: state.avoidIds,
        selfScore: state.selfScore,
      });
      saveLastPlayerId(state.playerId);
    }
  }, [state.playerId, state.positions, state.preferredPosition, state.avoidIds, state.selfScore]);

  // Validation rules for current step
  const isCurrentStepValid = (): boolean => {
    switch (state.currentStep) {
      case 1:
        return state.playerId !== null;
      case 2:
        return state.positions.length >= 1 && state.preferredPosition !== null;
      case 3:
        return state.avoidIds.length <= 2;
      case 4:
        return state.selfScore >= 1 && state.selfScore <= 10;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      if (state.currentStep === 1) toast.warning('Vui lòng chọn tên của bạn');
      else if (state.currentStep === 2) toast.warning('Vui lòng chọn ít nhất 1 vị trí và chọn vị trí sở trường');
      return;
    }
    dispatch({ type: 'NEXT_STEP' });
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleSubmit = async () => {
    if (!state.playerId || !state.preferredPosition) return;

    dispatch({ type: 'SUBMIT_START' });
    try {
      await submitPlayer(state.playerId, {
        positions: state.positions,
        preferredPosition: state.preferredPosition,
        avoidIds: state.avoidIds,
        selfScore: state.selfScore,
      });

      saveSubmittedRecord({
        playerId: state.playerId,
        positions: state.positions,
        preferredPosition: state.preferredPosition,
        avoidIds: state.avoidIds,
        selfScore: state.selfScore,
      });

      dispatch({ type: 'SUBMIT_SUCCESS' });
      toast.success('Đã gửi thông tin khai báo thành công!', 'Sân 7 The Media');
      refetchPlayers();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      const msg = apiErr.message || 'Không thể gửi thông tin. Vui lòng thử lại.';
      dispatch({ type: 'SUBMIT_ERROR', payload: msg });
      toast.error(msg, 'Lỗi nộp phiếu');
    }
  };

  // Keyboard navigation: Enter to advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && state.currentStep < 5 && isCurrentStepValid()) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          if (state.currentStep === 4) {
            handleSubmit();
          } else {
            handleNext();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentStep, state.playerId, state.positions, state.preferredPosition, state.avoidIds, state.selfScore]);

  // Loading state
  if (isPlayersLoading || isSettingsLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-6">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-40 w-full" />
        </Card>
      </div>
    );
  }

  // If registration is closed
  if (settings && !settings.registrationOpen) {
    return (
      <div className="py-8">
        <ClosedNotice />
      </div>
    );
  }

  // Error state
  if (playersError) {
    return (
      <div className="max-w-md mx-auto py-12">
        <ErrorState
          title="Không thể tải danh sách cầu thủ"
          message="Vui lòng kiểm tra lại kết nối máy chủ backend."
          onRetry={() => refetchPlayers()}
        />
      </div>
    );
  }

  // Empty state
  if (!players || players.length === 0) {
    return (
      <div className="max-w-md mx-auto py-12">
        <EmptyState
          title="Chưa có danh sách cầu thủ"
          description="Admin chưa thêm ai vào đội The Media, gọi ổng đi!"
          actionLabel="Tải lại trang"
          onAction={() => refetchPlayers()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Progress Pitch Stepper */}
      <ProgressPitch currentStep={state.currentStep} />

      {/* Wizard Content Card with Slide Animation */}
      <Card className="p-4 sm:p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {state.currentStep === 1 && (
              <StepName
                players={players}
                selectedPlayerId={state.playerId}
                onSelectPlayer={(p) => {
                  dispatch({ type: 'SELECT_PLAYER', payload: { id: p.id, name: p.name } });
                  dispatch({ type: 'NEXT_STEP' });
                }}
              />
            )}

            {state.currentStep === 2 && (
              <StepPositions
                positions={state.positions}
                preferredPosition={state.preferredPosition}
                onSetPositions={(pos, pref) =>
                  dispatch({ type: 'SET_POSITIONS', payload: { positions: pos, preferredPosition: pref } })
                }
                onSetPreferred={(pos) =>
                  dispatch({ type: 'SET_PREFERRED_POSITION', payload: pos })
                }
              />
            )}

            {state.currentStep === 3 && state.playerId && (
              <StepAvoid
                players={players}
                currentPlayerId={state.playerId}
                selectedAvoidIds={state.avoidIds}
                onToggleAvoid={(id) => dispatch({ type: 'TOGGLE_AVOID', payload: id })}
                onClearAvoids={() => dispatch({ type: 'CLEAR_AVOIDS' })}
              />
            )}

            {state.currentStep === 4 && (
              <StepScore
                score={state.selfScore}
                onChangeScore={(score) => dispatch({ type: 'SET_SELF_SCORE', payload: score })}
              />
            )}

            {state.currentStep === 5 && state.playerId && state.preferredPosition && (
              <StepDone
                playerId={state.playerId}
                playerName={state.playerName}
                positions={state.positions}
                preferredPosition={state.preferredPosition}
                selfScore={state.selfScore}
                onEditAgain={() => dispatch({ type: 'GO_TO_STEP', payload: 2 })}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Sticky Bottom Actions Bar (Steps 1 - 4) */}
      {state.currentStep < 5 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-4 bg-pitch-dark/95 border-t border-pitch-line/80 backdrop-blur-xl shadow-2xl">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            {/* Back Button */}
            {state.currentStep > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handlePrev}
                className="gap-2 text-xs sm:text-sm text-pitch-muted hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </Button>
            ) : (
              <div />
            )}

            {/* Next or Submit Button */}
            {state.currentStep < 4 ? (
              <Button
                type="button"
                variant="neon"
                size="md"
                disabled={!isCurrentStepValid()}
                onClick={handleNext}
                className="gap-2 text-xs sm:text-sm font-bold min-w-[130px]"
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="neon"
                size="md"
                isLoading={state.isSubmitting}
                disabled={!isCurrentStepValid() || state.isSubmitting}
                onClick={handleSubmit}
                className="gap-2 text-xs sm:text-sm font-bold min-w-[140px] shadow-[0_0_20px_rgba(232,255,58,0.5)]"
              >
                <Send className="w-4 h-4" />
                <span>Nộp Phiếu Ngay</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SubmissionPage;
