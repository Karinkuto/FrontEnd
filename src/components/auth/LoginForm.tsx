import { AlertCircle, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';
import { SmartForm, SmartFormField } from '@/components/smart-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { notification } from '@/lib/notification';
import {
  useLoginAdminMutation,
  useLoginUserMutation,
} from '@/redux/api/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { loginSuccess } from '@/redux/slices/authSlice';

const loginSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .nonempty('Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type ApiError = {
  data?: {
    errors?: string[];
    error?: string;
  };
  message?: string;
};

interface LoginFormProps {
  onSuccess?: () => void;
  isAdmin?: boolean;
}

export function LoginForm({ onSuccess, isAdmin = false }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const [loginUser] = useLoginUserMutation();
  const [loginAdmin] = useLoginAdminMutation();

  const handleLogin = async (data: LoginFormValues) => {
    try {
      const loginPromise = isAdmin
        ? loginAdmin(data).unwrap()
        : loginUser(data).unwrap();

      const response = await notification.promise(
        loginPromise,
        {
          loading: 'Signing in...',
          success: (response) => {
            dispatch(
              loginSuccess({
                user: response.data,
                userType: isAdmin ? 'admin' : 'user',
              })
            );
            onSuccess?.();
            return 'Welcome back';
          },
          error: (err: unknown) => {
            const apiError = err as ApiError;
            return (
              apiError?.data?.errors?.[0] ||
              apiError?.data?.error ||
              apiError?.message ||
              'An error occurred during login'
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
      mutationFn={handleLogin}
      schema={loginSchema}
      submitText={`Sign in as ${isAdmin ? 'Admin' : 'User'}`}
    >
      {(form) => (
        <>
          <div className="mb-6 space-y-2 text-center">
            <h2 className="flex items-center justify-center gap-2 font-semibold text-2xl tracking-tight">
              <LogIn className="h-5 w-5" />
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Please enter your credentials to continue
            </p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <SmartFormField
                form={form}
                label="Email"
                name="email"
                placeholder="Enter your email"
                type="email"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <span>Password</span>
                <Link
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                  href={isAdmin ? '/admin/forgot-password' : '/forgot-password'}
                >
                  Forgot your password?
                </Link>
              </div>
              <SmartFormField
                form={form}
                name="password"
                placeholder="Enter your password"
                type="password"
              />
            </div>
          </div>

          {!isAdmin && (
            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link className="underline underline-offset-4" href="/register">
                Sign up
              </Link>
            </div>
          )}
        </>
      )}
    </SmartForm>
  );
}
