import type React from 'react';
import { adminNavData } from '@/nav-data/admin-nav';
import { DashboardLayout } from './DashboardLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <DashboardLayout navData={adminNavData}>{children}</DashboardLayout>;
}
