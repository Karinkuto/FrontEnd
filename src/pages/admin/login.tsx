import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/selectors/authSelectors';

export default function AdminLoginPage() {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/admin/tour');
    }
  }, [user, router]);

  const handleSuccess = () => {
    // The useEffect will handle the redirect when the user state updates
    try {
    } catch {}
  };

  return (
    <AuthLayout
      description="Enter your admin credentials to access the dashboard"
      title="Admin Sign In"
    >
      <LoginForm isAdmin={true} onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
