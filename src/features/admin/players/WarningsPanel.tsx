import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldCheck } from 'lucide-react';
import { Warning, AdminPlayer } from '../../../api/types';
import { Badge } from '../../../components/ui/Badge';

export interface WarningsPanelProps {
  warnings: Warning[];
  players?: AdminPlayer[];
  onSelectPlayer?: (id: number) => void;
}

export const WarningsPanel: React.FC<WarningsPanelProps> = ({
  warnings,
  players = [],
  onSelectPlayer,
}) => {
  const playerMap = new Map(players.map((p) => [p.id, p.name]));

  const errors = warnings.filter((w) => w.level === 'error');
  const warns = warnings.filter((w) => w.level === 'warn');
  const infos = warnings.filter((w) => w.level === 'info');

  if (warnings.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <p className="font-semibold text-white">Đội hình hoàn hảo! Không có xung đột hoặc cảnh báo nào.</p>
          <p className="text-emerald-300/80 mt-0.5">
            Đủ 14 cầu thủ active, vị trí trải đều và các yêu cầu né nhau đều có thể thỏa mãn trọn vẹn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Critical Errors First */}
      {errors.map((w, idx) => (
        <div
          key={`err-${idx}`}
          className="flex items-start gap-3 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/70 text-rose-200 text-xs shadow-lg shadow-rose-950/30"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-rose-300 font-mono text-[10px] bg-rose-900/80 px-1.5 py-0.5 rounded">
                LỖI BẮT BUỘC: {w.code}
              </span>
            </div>
            <p className="font-medium text-rose-100 mt-1 leading-snug">{w.message}</p>
            {w.playerIds && w.playerIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] text-rose-300/80">Liên quan:</span>
                {w.playerIds.map((pid) => (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => onSelectPlayer?.(pid)}
                    className="px-2 py-0.5 rounded bg-rose-900/90 text-rose-200 hover:bg-rose-800 text-[11px] font-semibold border border-rose-500/40 transition-colors"
                  >
                    {playerMap.get(pid) || `ID #${pid}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Warnings */}
      {warns.map((w, idx) => (
        <div
          key={`warn-${idx}`}
          className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-bold text-amber-400 font-mono text-[10px] uppercase">
              CẢNH BÁO: {w.code}
            </span>
            <p className="text-amber-100/90 mt-0.5 leading-snug">{w.message}</p>
            {w.playerIds && w.playerIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {w.playerIds.map((pid) => (
                  <Badge key={pid} variant="warning" size="xs">
                    {playerMap.get(pid) || `#${pid}`}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Info notices */}
      {infos.map((w, idx) => (
        <div
          key={`info-${idx}`}
          className="flex items-start gap-3 p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 text-xs"
        >
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="font-bold text-cyan-400 font-mono text-[10px] uppercase">
              LƯU Ý: {w.code}
            </span>
            <p className="text-cyan-100/90 mt-0.5">{w.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
