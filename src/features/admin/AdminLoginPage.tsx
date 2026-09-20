import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../../api/admin';
import { setAdminToken } from '../../lib/auth';
import { useToast } from '../../components/ui/Toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { Badge } from '../../components/ui/Badge';
import { ApiError } from '../../api/errors';

export const AdminLoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập mật khẩu quản trị.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginAdmin(password.trim());
      setAdminToken(res.token, res.expiresAt);
      toast.success('Đăng nhập quản trị thành công!', 'Xin chào Admin');

      // Redirect to previous intended page or /admin
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.status === 429) {
        setErrorMessage('Bạn đã nhập sai quá nhiều lần! Vui lòng đợi 1 phút trước khi thử lại.');
        toast.error('Quá giới hạn đăng nhập. Vui lòng chờ.', 'Rate Limit');
      } else if (apiErr.code === 'INVALID_CREDENTIALS') {
        setErrorMessage('Mật khẩu quản trị không chính xác.');
        toast.error('Mật khẩu sai. Vui lòng thử lại.');
      } else {
        setErrorMessage(apiErr.message || 'Lỗi kết nối máy chủ.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <Card className="p-6 sm:p-8 backdrop-blur-xl border-pitch-line/80 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <Badge variant="warning" size="sm" className="mx-auto mb-1">
            Khu Vực Quản Trị
          </Badge>
          <div className="w-14 h-14 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Lock className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-display uppercase tracking-wider text-white">
            Đăng Nhập Quản Trị
          </CardTitle>
          <CardDescription className="text-xs text-pitch-muted">
            Nhập mật khẩu quản trị viên để vào bảng quản lý 14 cầu thủ The Media.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Mật khẩu Admin" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                autoFocus
              />
            </Field>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="neon"
              size="md"
              isLoading={isLoading}
              disabled={isLoading || !password.trim()}
              className="w-full gap-2 font-bold mt-2"
            >
              <span>Đăng Nhập Vào Hệ Thống</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminLoginPage;
