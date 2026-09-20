import React from 'react';
import { PublicResult } from '../../api/types';
import { TeamSheet } from './TeamSheet';
import { formatDate } from '../../lib/format';

export interface ShareCardProps {
  result: PublicResult;
  cardRef: React.RefObject<HTMLDivElement>;
}

export const ShareCard: React.FC<ShareCardProps> = ({ result, cardRef }) => {
  const { teamA, teamB, publishedAt, matchId } = result;

  return (
    <div
      ref={cardRef}
      className="fixed -left-[9999px] top-0 pointer-events-none w-[1080px] p-10 bg-[#06251B] text-[#F4FFF8] font-sans overflow-hidden border-8 border-[#0E5A3F]"
    >
      {/* Background Stadium Turf Gradients */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#E8FF3A_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Header Banner */}
      <div className="relative z-10 flex items-center justify-between border-b-2 border-white/20 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0E5A3F] border-2 border-[#E8FF3A] flex items-center justify-center text-[#E8FF3A] shadow-xl">
            <span className="font-display font-black text-3xl">7</span>
          </div>
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-wider text-white">
              THE MEDIA – SÂN 7 NỘI BỘ
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

      {/* Two Teams Grids Side by Side */}
      <div className="relative z-10 grid grid-cols-2 gap-8 mb-8">
        <div className="p-4 rounded-3xl bg-[#0E5A3F]/30 border border-emerald-500/40">
          <TeamSheet team={teamA} />
        </div>
        <div className="p-4 rounded-3xl bg-[#0E5A3F]/30 border border-cyan-500/40">
          <TeamSheet team={teamB} isTeamB={true} />
        </div>
      </div>

      {/* Footer Banner */}
      <div className="relative z-10 flex items-center justify-between border-t-2 border-white/20 pt-6 text-sm text-[#9FC7B4]">
        <p className="font-display uppercase tracking-wider text-white text-lg">
          Sơ đồ thi đấu: 1-1-2-1-2 • Hệ thống tự động cân bằng thực lực
        </p>
        <p className="font-mono text-xs">
          Ứng dụng chia đội bóng đá nội bộ The Media
        </p>
      </div>
    </div>
  );
};
