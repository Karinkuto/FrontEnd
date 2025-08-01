import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <AuthLayout
      description="Join thousands of travelers exploring amazing destinations"
      title="Create an account"
    >
      <div className="space-y-6">
        <RegisterForm onSuccess={handleSuccess} />
        <div className="text-center text-muted-foreground text-sm">
          <p>
            Already have an account?{' '}
            <Link
              className="font-medium text-primary hover:underline"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
