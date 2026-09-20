import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, RefreshCw, EyeOff } from 'lucide-react';
import { Position } from '../../api/types';
import { cn } from '../../lib/cn';
import { BallAvatar } from './BallAvatar';
import { Badge } from '../ui/Badge';
import { POSITION_NAMES } from '../../lib/constants';

export interface PlayerCardProps {
  id: number;
  name: string;
  jerseyNumber?: number | null;
  avatarUrl?: string | null;
  primaryPosition?: Position | null;
  secondaryPosition?: Position | null;
  hasSubmitted?: boolean;
  score?: number | null; // Admin only
  avoidances?: { id: number; name: string }[]; // Admin only
  notes?: string | null;
  isAdmin?: boolean;
  teamVariant?: 'teamA' | 'teamB' | 'neon' | 'neutral';
  className?: string;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  id: _id,
  name,
  jerseyNumber,
  avatarUrl,
  primaryPosition,
  secondaryPosition,
  hasSubmitted = false,
  score,
  avoidances = [],
  notes,
  isAdmin = false,
  teamVariant = 'neon',
  className,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // 3D tilt state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const borderColor = {
    teamA: 'from-emerald-500 via-emerald-300 to-emerald-700',
    teamB: 'from-cyan-500 via-sky-300 to-cyan-700',
    neon: 'from-accent-neon via-yellow-200 to-emerald-400',
    neutral: 'from-pitch-line via-slate-600 to-pitch-line',
  }[teamVariant];

  return (
    <div
      className={cn('perspective-1000 w-64 h-96 cursor-pointer select-none', className)}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="relative w-full h-full rounded-2xl transition-shadow duration-300"
      >
        {/* FRONT OF CARD */}
        <div
          className={cn(
            'absolute inset-0 w-full h-full rounded-2xl p-[2px] bg-gradient-to-b shadow-2xl backface-hidden',
            borderColor
          )}
        >
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0A2E22] via-[#06251B] to-[#03140E] p-5 flex flex-col justify-between overflow-hidden">
            {/* Holographic Gloss Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

            {/* Top Bar: Rating & Position */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex flex-col items-center">
                {isAdmin && score != null ? (
                  <span className="text-3xl font-display font-black text-accent-neon leading-none tracking-tighter">
                    {score.toFixed(1)}
                  </span>
                ) : (
                  <span className="text-2xl font-display font-black text-white/80 leading-none">
                    #{jerseyNumber ?? '--'}
                  </span>
                )}
                <span className="text-sm font-bold text-accent-neon font-display tracking-widest mt-0.5">
                  {primaryPosition ?? '??'}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1">
                {hasSubmitted ? (
                  <Badge variant="neon" size="xs" dot pulseDot>
                    Sẵn sàng
                  </Badge>
                ) : (
                  <Badge variant="warning" size="xs">
                    Chưa nộp
                  </Badge>
                )}
                {isAdmin && avoidances.length > 0 && (
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                    <EyeOff className="w-2.5 h-2.5" />
                    {avoidances.length} né
                  </span>
                )}
              </div>
            </div>

            {/* Center: Large Avatar / Visual */}
            <div className="my-auto flex flex-col items-center justify-center relative z-10">
              <BallAvatar
                name={name}
                avatarUrl={avatarUrl}
                jerseyNumber={jerseyNumber}
                teamVariant={teamVariant}
                size="xl"
                className="shadow-[0_0_25px_rgba(232,255,58,0.2)] mb-3"
              />
              <h3 className="font-display text-2xl uppercase tracking-wider text-white text-center font-black truncate max-w-[200px]">
                {name}
              </h3>
              {primaryPosition && (
                <p className="text-xs text-accent-neon/80 font-medium">
                  {POSITION_NAMES[primaryPosition]}
                </p>
              )}
            </div>

            {/* Bottom: Secondary position & Click hint */}
            <div className="relative z-10 pt-3 border-t border-pitch-line/50 flex items-center justify-between text-xs text-pitch-muted">
              {secondaryPosition ? (
                <span>
                  Phụ: <strong className="text-pitch-text">{secondaryPosition}</strong>
                </span>
              ) : (
                <span>Thuần 1 vị trí</span>
              )}
              <span className="text-[10px] text-accent-neon/60 flex items-center gap-1">
                <RefreshCw className="w-2.5 h-2.5" />
                Lật thẻ
              </span>
            </div>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div
          style={{ transform: 'rotateY(180deg)' }}
          className={cn(
            'absolute inset-0 w-full h-full rounded-2xl p-[2px] bg-gradient-to-b shadow-2xl backface-hidden',
            borderColor
          )}
        >
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#0A2E22] via-[#06251B] to-[#03140E] p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-pitch-line/50">
                <h4 className="font-display text-lg uppercase text-white font-bold">{name}</h4>
                <span className="text-xs text-accent-neon font-mono">THÔNG TIN</span>
              </div>

              {/* Position details */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-pitch-line/30">
                  <span className="text-pitch-muted">Vị trí chính:</span>
                  <span className="font-bold text-accent-neon">
                    {primaryPosition ? `${primaryPosition} (${POSITION_NAMES[primaryPosition]})` : 'Chưa chọn'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-pitch-line/30">
                  <span className="text-pitch-muted">Vị trí phụ:</span>
                  <span className="font-bold text-cyan-400">
                    {secondaryPosition ? `${secondaryPosition} (${POSITION_NAMES[secondaryPosition]})` : 'Không có'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-pitch-line/30">
                  <span className="text-pitch-muted">Số áo:</span>
                  <span className="font-mono text-pitch-text">{jerseyNumber ?? 'Chưa đăng ký'}</span>
                </div>

                {/* Admin-only sensitive sections */}
                {isAdmin && (
                  <div className="mt-4 pt-2 border-t border-accent-neon/20">
                    <p className="text-[11px] font-bold text-accent-neon uppercase mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Dữ liệu Admin
                    </p>
                    <div className="flex justify-between py-1 border-b border-pitch-line/30">
                      <span className="text-pitch-muted">Điểm đánh giá:</span>
                      <span className="font-mono font-bold text-accent-neon">{score?.toFixed(1) ?? 'Chưa chấm'}</span>
                    </div>

                    <div className="mt-2">
                      <span className="text-pitch-muted block mb-1">Danh sách né:</span>
                      {avoidances.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {avoidances.map((a) => (
                            <span
                              key={a.id}
                              className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[10px]"
                            >
                              ✕ {a.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-pitch-muted italic text-[11px]">Không né ai</span>
                      )}
                    </div>
                  </div>
                )}

                {notes && (
                  <div className="mt-3">
                    <span className="text-pitch-muted block mb-1">Ghi chú:</span>
                    <p className="p-2 rounded bg-black/30 border border-pitch-line/40 text-pitch-text text-[11px]">
                      {notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-pitch-muted flex items-center justify-center gap-1">
                <RefreshCw className="w-2.5 h-2.5" />
                Nhấp để lật lại
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
