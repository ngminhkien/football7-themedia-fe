import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export const ClosedNotice: React.FC = () => {
  return (
    <Card className="max-w-md mx-auto text-center border-amber-500/40 bg-amber-950/20 backdrop-blur-xl">
      <CardHeader>
        <Badge variant="warning" size="sm" className="mx-auto mb-2">
          Cổng Đăng Ký Đã Khóa
        </Badge>
        <CardTitle className="text-2xl font-display uppercase tracking-wider text-amber-300">
          Sân Đã Chốt Sổ Rồi!
        </CardTitle>
        <CardDescription className="text-pitch-muted">
          Ban tổ chức The Media đã khóa form đăng ký để chốt danh sách chia 2 đội hình thi đấu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <Lock className="w-8 h-8" />
        </div>
        <p className="text-xs text-pitch-muted leading-relaxed">
          Bạn có thể chuyển sang trang xem kết quả chia đội để theo dõi danh sách đội hình thi đấu chính thức.
        </p>
        <Link to="/result" className="block">
          <Button variant="neon" className="w-full gap-2">
            <span>Xem Kết Quả Chia Đội</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
