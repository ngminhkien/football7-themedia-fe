import React from 'react';
import { PublicPlayer } from '../../../api/types';
import { AvoidPicker } from '../components/AvoidPicker';

export interface StepAvoidProps {
  players: PublicPlayer[];
  currentPlayerId: number;
  selectedAvoidIds: number[];
  onToggleAvoid: (id: number) => void;
  onClearAvoids: () => void;
}

export const StepAvoid: React.FC<StepAvoidProps> = ({
  players,
  currentPlayerId,
  selectedAvoidIds,
  onToggleAvoid,
  onClearAvoids,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-xl sm:text-2xl font-display uppercase tracking-wider text-white font-bold">
          Ai Bạn Không Muốn Chung Đội?
        </h3>
        <p className="text-xs text-pitch-muted">
          Nếu có va chạm chiến thuật hay kỵ rơ, bạn có thể chọn tối đa 2 người để hệ thống chia khác đội.
        </p>
      </div>

      <AvoidPicker
        players={players}
        currentPlayerId={currentPlayerId}
        selectedAvoidIds={selectedAvoidIds}
        onToggleAvoid={onToggleAvoid}
        onClearAvoids={onClearAvoids}
      />
    </div>
  );
};
