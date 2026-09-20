import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Trophy, UserCheck, Layers } from 'lucide-react';
import { useHealth } from '../../api/hooks/useHealth';
import { useSettings } from '../../api/hooks/useSettings';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';
import { getAdminToken } from '../../lib/auth';

export const PageHeader: React.FC = () => {
  const location = useLocation();
  const { isOnline } = useHealth();
  const { data: settings } = useSettings();
  const isAdminLoggedIn = !!getAdminToken();

  const navItems = [
    { label: 'Đăng ký', path: '/', icon: UserCheck },
    { label: 'Kết quả', path: '/result', icon: Trophy },
    { label: 'Admin', path: isAdminLoggedIn ? '/admin' : '/admin/login', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pitch-line/80 bg-pitch-dark/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-pitch-panel border border-accent-neon/50 flex items-center justify-center text-accent-neon shadow-[0_0_12px_rgba(232,255,58,0.25)] group-hover:scale-105 transition-transform">
            <span className="font-display font-black text-xl leading-none">7</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-wider text-white leading-none group-hover:text-accent-neon transition-colors">
              THE MEDIA
            </span>
            <span className="text-[10px] text-pitch-muted uppercase tracking-widest font-mono">
              SÂN 7 NỘI BỘ
            </span>
          </div>
        </Link>

        {/* Center / Status */}
        <div className="hidden md:flex items-center gap-2">
          {settings && (
            <Badge
              variant={settings.registrationOpen ? 'neon' : 'warning'}
              size="xs"
              dot
              pulseDot={settings.registrationOpen}
            >
              {settings.registrationOpen ? 'Mở khai báo vị trí' : 'Đã khoá khai báo'}
            </Badge>
          )}

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pitch-panel border border-pitch-line/50 text-[10px] font-mono text-pitch-muted">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                isOnline ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
              )}
            />
            <span>{isOnline ? 'API Connected' : 'Offline'}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all',
                  isActive
                    ? 'bg-accent-neon/15 text-accent-neon border border-accent-neon/40 shadow-[0_0_10px_rgba(232,255,58,0.15)]'
                    : 'text-pitch-muted hover:text-pitch-text hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Dev UI Playground link */}
          <Link
            to="/dev/ui"
            title="Design System Showcase"
            className={cn(
              'p-1.5 rounded-xl text-pitch-muted hover:text-accent-neon hover:bg-white/5 transition-colors',
              location.pathname === '/dev/ui' && 'text-accent-neon bg-accent-neon/10'
            )}
          >
            <Layers className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
};
