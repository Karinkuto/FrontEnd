import { CheckCircle, Shield } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';
import { SmartForm, SmartFormField } from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import { notification } from '@/lib/notification';
import { useRequestPasswordResetMutation } from '@/redux/api/authApi';

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email').nonempty('Email is required'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type ApiError = {
  data?: {
    errors?: string[];
    error?: string;
  };
  message?: string;
};

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  isAdmin?: boolean;
}

export function ForgotPasswordForm({
  onSuccess,
  isAdmin = false,
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [requestPasswordReset] = useRequestPasswordResetMutation();

  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    try {
      const resetPromise = requestPasswordReset({ email: data.email }).unwrap();

      const response = await notification.promise(
        resetPromise,
        {
          loading: 'Sending reset instructions...',
          success: () => {
            setSuccess(true);
            onSuccess?.();
            return 'Password reset instructions have been sent to your email.';
          },
          error: (err: unknown) => {
            const apiError = err as ApiError;
            return (
              apiError?.data?.errors?.[0] ||
              apiError?.data?.error ||
              apiError?.message ||
              'Failed to send reset email'
            );
          },
        },
        { duration: 10_000 }
      );

      return response;
    } catch (error) {
      // Error is already handled by the notification.promise
      return null;
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="font-semibold text-2xl tracking-tight">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm">
            We've sent you a link to reset your password.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
            <p className="text-sm">
              If an account exists with this email, you'll receive a password
              reset link shortly.
            </p>
          </div>
          <div className="text-center">
            <Button onClick={() => setSuccess(false)} variant="link">
              Try a different email
            </Button>
          </div>
          <div className="text-center text-sm">
            <Button
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                onSuccess?.();
                router.push(isAdmin ? '/admin/login' : '/login');
              }}
              variant="link"
            >
              Remember your password? Sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <SmartForm
        mode="create"
        mutationFn={handleForgotPassword}
        schema={forgotPasswordSchema}
        submitText="Send reset link"
      >
        {(form) => (
          <>
            <div className="mb-6 space-y-2 text-center">
              <div className="flex justify-center">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-semibold text-2xl tracking-tight">
                {isAdmin ? 'Admin ' : ''}Forgot your password?
              </h2>
              <p className="text-muted-foreground text-sm">
                Enter your {isAdmin ? 'admin ' : ''}email and we'll send you a
                link to reset your password.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <SmartFormField
                  form={form}
                  label="Email"
                  name="email"
                  placeholder="m@example.com"
                  type="email"
                />
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              <Button
                onClick={() => {
                  onSuccess?.();
                  router.push(isAdmin ? '/admin/login' : '/login');
                }}
                type="button"
                variant="link"
              >
                Back to login
              </Button>
            </div>
          </>
        )}
      </SmartForm>
    </div>
  );
}
