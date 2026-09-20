import React from 'react';
import { PublicResult, PublicTeam } from '../../api/types';
import { TeamSheet } from './TeamSheet';
import { formatDate } from '../../lib/format';

export interface ShareCardProps {
  result: PublicResult;
  cardRef: React.RefObject<HTMLDivElement>;
  teamARef: React.RefObject<HTMLDivElement>;
  teamBRef: React.RefObject<HTMLDivElement>;
}

export const ShareCard: React.FC<ShareCardProps> = ({ result, cardRef, teamARef, teamBRef }) => {
  const { teamA, teamB, publishedAt, matchId } = result;

  // Reusable Header Component
  const ShareHeader = ({ title = "THE MEDIA – SÂN 7 NỘI BỘ" }) => (
    <div className="relative z-10 flex items-center justify-between border-b-2 border-white/20 pb-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#0E5A3F] border-2 border-[#E8FF3A] flex items-center justify-center text-[#E8FF3A] shadow-xl">
          <span className="font-display font-black text-3xl">7</span>
        </div>
        <div>
          <h1 className="font-display font-black text-4xl uppercase tracking-wider text-white">
            {title}
          </h1>
          <p className="text-sm text-[#9FC7B4] font-mono mt-0.5">
            KẾT QUẢ PHÂN CHIA ĐỘI HÌNH • TRẬN ĐẤU #{matchId}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#E8FF3A] text-[#06251B] font-bold text-sm tracking-wide shadow">
          ĐÃ CÔNG BỐ
        </span>
        <p className="text-xs text-[#9FC7B4] font-mono mt-2">
          Ngày đá: {formatDate(publishedAt)}
        </p>
      </div>
    </div>
  );

  // Reusable Footer Component
  const ShareFooter = () => (
    <div className="relative z-10 flex items-center justify-between border-t-2 border-white/20 pt-6 text-sm text-[#9FC7B4]">
      <p className="font-display uppercase tracking-wider text-white text-lg">
        Sơ đồ thi đấu: 1-1-2-1-2 • Cân bằng thực lực tự động
      </p>
      <p className="font-mono text-xs">
        Ứng dụng chia đội nội bộ The Media
      </p>
    </div>
  );

  // Helper for single team card
  const renderSingleTeamCard = (ref: React.RefObject<HTMLDivElement>, team: PublicTeam, isTeamB: boolean) => (
    <div
      ref={ref}
      className="w-[720px] p-10 bg-[#06251B] text-[#F4FFF8] font-sans overflow-hidden border-8 border-[#0E5A3F] relative"
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#E8FF3A_1px,transparent_1px)] [background-size:24px_24px]" />
      <ShareHeader title={team.name.toUpperCase()} />
      <div className={`relative z-10 p-6 rounded-3xl mb-8 border shadow-2xl ${isTeamB ? 'bg-[#0E5A3F]/30 border-cyan-500/40' : 'bg-[#0E5A3F]/30 border-emerald-500/40'}`}>
        <TeamSheet team={team} isTeamB={isTeamB} />
      </div>
      <ShareFooter />
    </div>
  );

  return (
    <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none -z-50 opacity-0">
      
      {/* 1. Both Teams Card (1080px wide) */}
      <div
        ref={cardRef}
        className="w-[1080px] p-10 bg-[#06251B] text-[#F4FFF8] font-sans overflow-hidden border-8 border-[#0E5A3F] relative"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#E8FF3A_1px,transparent_1px)] [background-size:24px_24px]" />
        <ShareHeader />
        <div className="relative z-10 grid grid-cols-2 gap-8 mb-8">
          <div className="p-4 rounded-3xl bg-[#0E5A3F]/30 border border-emerald-500/40 shadow-2xl">
            <TeamSheet team={teamA} />
          </div>
          <div className="p-4 rounded-3xl bg-[#0E5A3F]/30 border border-cyan-500/40 shadow-2xl">
            <TeamSheet team={teamB} isTeamB={true} />
          </div>
        </div>
        <ShareFooter />
      </div>

      {/* 2. Team A Only Card (720px wide) */}
      {renderSingleTeamCard(teamARef, teamA, false)}

      {/* 3. Team B Only Card (720px wide) */}
      {renderSingleTeamCard(teamBRef, teamB, true)}

    </div>
  );
};
