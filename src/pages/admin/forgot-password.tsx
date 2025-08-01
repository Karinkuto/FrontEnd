import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function AdminForgotPasswordPage() {
  const handleSuccess = () => {
    console.log('Admin password reset email sent');
  };

  return (
    <AuthLayout
      description="Enter your admin email to receive a password reset link"
      title="Admin Password Reset"
    >
      <ForgotPasswordForm isAdmin={true} onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
