import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-display font-black uppercase text-white mb-3">
        RA NGOÀI BIÊN RỒI ÔNG ƠI! ⚽
      </h1>
      <p className="text-pitch-muted max-w-md mb-8 px-4">
        Đường dẫn bạn tìm kiếm không tồn tại hoặc đã bị đổi tên. Hãy quay lại sân chính để tiếp tục đá nhé!
      </p>
      <Link to="/">
        <Button variant="neon" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Về Trang Chủ
        </Button>
      </Link>
    </div>
  );
};
export default NotFoundPage;
