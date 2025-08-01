import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import type { RootState } from '@/redux/store';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, userType } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSuccess = () => {
    // This will be called after successful login
    if (userType === 'admin') {
      router.push('/admin/tour');
    } else {
      router.push('/tour');
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      handleSuccess();
    }
  }, [isAuthenticated, userType]);

  return (
    <AuthLayout
      description="Enter your email and password to access your account"
      title="Sign in to your account"
    >
      <div className="space-y-6">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </AuthLayout>
  );
}
