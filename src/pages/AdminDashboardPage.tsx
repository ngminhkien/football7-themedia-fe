import React from 'react';
import { AdminLayout } from '../features/admin/AdminLayout';
import { AdminPlayersPage } from '../features/admin/players/AdminPlayersPage';

export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <AdminPlayersPage />
    </AdminLayout>
  );
};
export default AdminDashboardPage;
