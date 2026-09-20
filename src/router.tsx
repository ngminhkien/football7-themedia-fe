import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Spinner } from './components/ui/Spinner';
import { isAuthenticated } from './lib/auth';

// Lazy-loaded pages
const SubmissionPage = lazy(() => import('./pages/SubmissionPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminSplitPage = lazy(() => import('./pages/AdminSplitPage'));
const DevUiPage = lazy(() => import('./pages/DevUiPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Route guard for Admin pages
export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Page loading fallback
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center py-28">
    <Spinner size="lg" label="Đang tải trang..." />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <AppShell>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<SubmissionPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboardPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/split"
            element={
              <RequireAdmin>
                <AdminSplitPage />
              </RequireAdmin>
            }
          />
          <Route path="/dev/ui" element={<DevUiPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
};
