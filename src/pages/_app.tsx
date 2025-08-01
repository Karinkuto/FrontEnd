import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AdminLayout } from '@/layout/AdminLayout';
import { RoleLayout } from '@/layout/RoleLayout';
import { store } from '@/redux/store';

// Create a client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Check if the current route is an admin route
  const isAdminRoute =
    router.pathname.startsWith('/admin') &&
    !router.pathname.startsWith('/admin/login') &&
    !router.pathname.startsWith('/admin/forgot-password');

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {isAdminRoute ? (
            <RoleLayout allowedRoles={['admin']} redirectTo="/login">
              <AdminLayout>
                <Component {...pageProps} />
              </AdminLayout>
            </RoleLayout>
          ) : (
            <RoleLayout allowedRoles={['user']} redirectTo="/login">
              <Component {...pageProps} />
            </RoleLayout>
          )}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
