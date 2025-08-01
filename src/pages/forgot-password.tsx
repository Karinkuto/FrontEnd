import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const handleSuccess = () => {
    // Stay on the same page as AuthForm will show success state
    console.log('Password reset email sent');
  };

  return (
    <AuthLayout
      description="We'll help you get back to planning your next adventure"
      title="Reset your password"
    >
      <ForgotPasswordForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
