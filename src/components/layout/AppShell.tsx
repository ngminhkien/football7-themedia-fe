import React from 'react';
import { ServerStatusBanner } from './ServerStatusBanner';
import { PageHeader } from './PageHeader';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-pitch-dark text-pitch-text flex flex-col selection:bg-accent-neon selection:text-pitch-dark">
      <ServerStatusBanner />
      <PageHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      <footer className="w-full border-t border-pitch-line/50 py-6 text-center text-xs text-pitch-muted">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} SÂN 7 – Nội bộ The Media. Thuật toán chia 2 đội cân bằng.</p>
          <p className="font-mono text-[11px] opacity-70">Sơ đồ 1-1-2-1-2 • Top N Cân Bằng</p>
        </div>
      </footer>
    </div>
  );
};
