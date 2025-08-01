import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';
import { SmartForm, SmartFormField } from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import { notification } from '@/lib/notification';
import { useRegisterUserMutation } from '@/redux/api/authApi';

const registerSchema = z
  .object({
    email: z
      .string()
      .email('Please enter a valid email')
      .nonempty('Email is required'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .nonempty('Password is required'),
    passwordConfirmation: z.string().nonempty('Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

type ApiError = {
  data?: {
    errors?: string[];
    error?: string;
  };
  message?: string;
};

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [registerUser] = useRegisterUserMutation();

  const handleRegister = async (data: RegisterFormValues) => {
    try {
      const registerPromise = registerUser({
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      }).unwrap();

      const response = await notification.promise(
        registerPromise,
        {
          loading: 'Creating your account...',
          success: () => {
            onSuccess?.();
            return 'Account created successfully! Please check your email to verify your account.';
          },
          error: (err: unknown) => {
            const apiError = err as ApiError;
            return (
              apiError?.data?.errors?.[0] ||
              apiError?.data?.error ||
              apiError?.message ||
              'Failed to create account'
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

  return (
    <SmartForm
      mode="create"
      mutationFn={handleRegister}
      schema={registerSchema}
      submitText="Create account"
    >
      {(form) => (
        <>
          <div className="mb-6 space-y-2 text-center">
            <h2 className="flex items-center justify-center gap-2 font-semibold text-2xl tracking-tight">
              <UserPlus className="h-5 w-5" />
              Create an account
            </h2>
            <p className="text-muted-foreground text-sm">
              Enter your information to create an account
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

            <div className="grid gap-2">
              <SmartFormField
                form={form}
                label="Password"
                name="password"
                placeholder="••••••••"
                type="password"
              />
            </div>

            <div className="grid gap-2">
              <SmartFormField
                form={form}
                label="Confirm Password"
                name="passwordConfirmation"
                placeholder="••••••••"
                type="password"
              />
            </div>
          </div>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="/login"
            >
              Sign in
            </Link>
          </div>
        </>
      )}
    </SmartForm>
  );
}
