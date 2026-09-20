import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Sparkles, MessageSquare } from 'lucide-react';
import { useResult } from '../../api/hooks/useResult';
import { TeamSheet } from './TeamSheet';
import { BalanceBar } from './BalanceBar';
import { ShareButton } from './ShareButton';
import { ShareCard } from './ShareCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ShuffleReveal } from '../../components/fx/ShuffleReveal';
import { fireTeamSplitConfetti } from '../../components/fx/confetti';
import { formatDate } from '../../lib/format';

const SEEN_MATCH_ID_KEY = 'football7_seen_match_id';

export const ResultPage: React.FC = () => {
  const { data: result, isLoading, isError, refetch } = useResult(true);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const teamARef = useRef<HTMLDivElement>(null);
  const teamBRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (result) {
      const lastSeenId = localStorage.getItem(SEEN_MATCH_ID_KEY);
      if (lastSeenId !== result.matchId.toString()) {
        setShouldAnimate(true);
        localStorage.setItem(SEEN_MATCH_ID_KEY, result.matchId.toString());
      }
    }
  }, [result]);

  const handleReplayAnimation = () => {
    setShouldAnimate(false);
    setTimeout(() => {
      setShouldAnimate(true);
      fireTeamSplitConfetti();
    }, 50);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 py-8">
        <Skeleton className="h-10 w-1/3 mx-auto" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-[480px] w-full rounded-3xl" />
          <Skeleton className="h-[480px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  // If no result published yet (404 or empty data)
  if (!result || isError) {
    return (
      <div className="max-w-md mx-auto py-16 space-y-6 text-center">
        <EmptyState
          icon={Trophy}
          title="Chưa Chia Đội Đâu, Đừng Nóng!"
          description="Ban tổ chức The Media đang thu thập danh sách cầu thủ và chạy thuật toán tối ưu. Kết quả sẽ tự động hiển thị ngay khi công bố."
          actionLabel="Kiểm tra lại ngay"
          onAction={() => refetch()}
        />
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-pitch-muted">
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang khai báo cầu thủ</span>
          </Button>
        </Link>
      </div>
    );
  }

  const { teamA, teamB, matchId, publishedAt } = result;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-pitch-line/60 pb-5">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-white font-black">
                Kết Quả Chia Đội – The Media
              </h1>
              <Badge variant="teamA" size="xs" dot pulseDot>
                Trận #{matchId}
              </Badge>
            </div>
            <p className="text-xs text-pitch-muted font-mono mt-0.5">
              Công bố ngày {formatDate(publishedAt)}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReplayAnimation}
            className="text-xs gap-1.5 text-pitch-muted hover:text-accent-neon"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Xem lại hiệu ứng</span>
          </Button>

          <ShareButton 
            cardRef={shareCardRef} 
            teamARef={teamARef}
            teamBRef={teamBRef}
            matchId={matchId} 
          />
        </div>
      </div>

      {/* Balance Power Comparison Bar */}
      <BalanceBar
        teamAName={teamA.name}
        teamBName={teamB.name}
        teamAScore={teamA.totalScore}
        teamBScore={teamB.totalScore}
      />

      {/* Main Pitch View (Wrap with ShuffleReveal on first view) */}
      <ShuffleReveal isRevealed={shouldAnimate} title="ĐANG BỐC THĂM ĐỘI HÌNH THE MEDIA...">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team A Sheet */}
          <div className="p-4 sm:p-5 rounded-3xl bg-pitch-panel/80 border border-emerald-500/40 shadow-2xl">
            <TeamSheet team={teamA} />
          </div>

          {/* Team B Sheet */}
          <div className="p-4 sm:p-5 rounded-3xl bg-pitch-panel/80 border border-cyan-500/40 shadow-2xl">
            <TeamSheet team={teamB} isTeamB={true} />
          </div>
        </div>
      </ShuffleReveal>

      {/* Humor Notice & Feedback */}
      <div className="p-4 rounded-2xl bg-pitch-panel/50 border border-pitch-line/50 text-center text-xs text-pitch-muted flex items-center justify-center gap-2">
        <MessageSquare className="w-4 h-4 text-accent-neon shrink-0" />
        <span>
          Ai muốn đổi đội hoặc chuyển kèo xin vui lòng liên hệ trực tiếp Admin trước giờ bóng lăn! ⚽
        </span>
      </div>

      {/* Hidden Off-Screen Card for High-Res PNG Capture */}
      <ShareCard 
        result={result} 
        cardRef={shareCardRef} 
        teamARef={teamARef}
        teamBRef={teamBRef}
      />
    </div>
  );
};
export default ResultPage;
