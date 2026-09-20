import React from 'react';
import { ScoreSlider } from '../components/ScoreSlider';

export interface StepScoreProps {
  score: number;
  onChangeScore: (score: number) => void;
}

export const StepScore: React.FC<StepScoreProps> = ({ score, onChangeScore }) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-xl sm:text-2xl font-display uppercase tracking-wider text-white font-bold">
          Tự Đánh Giá Thực Lực Của Bạn
        </h3>
        <p className="text-xs text-pitch-muted">
          Kéo thước đo chân thật theo phong độ hiện tại để thuật toán chia 2 đội cân kèo nhất.
        </p>
      </div>

      <ScoreSlider value={score} onChange={onChangeScore} />
    </div>
  );
};
