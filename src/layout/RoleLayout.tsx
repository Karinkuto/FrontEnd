import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '@/components/ui/Loader';
import { notification } from '@/lib/notification';
import type { RootState } from '@/redux/store';

interface RoleLayoutProps {
  children: React.ReactNode;
  allowedRoles?: Array<'user' | 'admin'>;
  redirectTo?: string;
}

export function RoleLayout({
  children,
  allowedRoles = ['user', 'admin'],
  redirectTo = '/login',
}: RoleLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, userType } = useSelector(
    (state: RootState) => state.auth
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip initial render and only run when auth state changes
    if (isLoading) {
      setIsLoading(false);
      return;
    }

    // Allow unauthenticated access to public paths
    const publicPaths = [
      '/login',
      '/register',
      '/forgot-password',
      '/admin/login',
      '/admin/forgot-password',
    ];
    if (publicPaths.some((path) => router.pathname === path)) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // If user type is not in allowed roles, redirect
    if (userType && !allowedRoles.includes(userType)) {
      notification.warning(
        `Access Denied: You don't have permission to view this page.`
      );
      router.push(redirectTo);
      return;
    }

    // If on root path, redirect based on user type
    if (router.pathname === '/' && userType) {
      const defaultPaths = {
        admin: '/admin/tour',
        user: '/tour',
      };
      router.push(defaultPaths[userType] || redirectTo);
    }
  }, [isAuthenticated, userType, router, isLoading, allowedRoles, redirectTo]);

  // Show loading state while checking auth
  if (
    isLoading ||
    !(
      isAuthenticated ||
      [
        '/login',
        '/register',
        '/forgot-password',
        '/admin/login',
        '/admin/forgot-password',
      ].some((path) => router.pathname === path)
    )
  ) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader center size={32} />
      </div>
    );
  }

  return <>{children}</>;
}
