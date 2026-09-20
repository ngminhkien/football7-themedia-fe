import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useHealth } from '../../api/hooks/useHealth';

export const ServerStatusBanner: React.FC = () => {
  const { isOnline, isLoading, refetch } = useHealth();

  if (isOnline) {
    return null; // Don't block screen when backend is healthy
  }

  return (
    <div className="bg-rose-950/90 border-b border-rose-500/50 text-rose-200 px-4 py-2 text-xs flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 text-rose-400 shrink-0 animate-pulse" />
        <span>
          <strong className="font-semibold text-rose-100">Mất kết nối máy chủ!</strong> Không thể kết nối với Backend API. Vui lòng kiểm tra xem backend đã chạy ở cổng 5000 chưa.
        </span>
      </div>
      <button
        onClick={() => refetch()}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-800 text-rose-100 font-medium transition-colors shrink-0 disabled:opacity-50"
      >
        <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        Thử lại
      </button>
    </div>
  );
};
