import React from 'react';
import { AdminLayout } from '../features/admin/AdminLayout';
import { AdminSplitPage as AdminSplitFeature } from '../features/admin/split/AdminSplitPage';

export const AdminSplitPage: React.FC = () => {
  return (
    <AdminLayout>
      <AdminSplitFeature />
    </AdminLayout>
  );
};

export default AdminSplitPage;
