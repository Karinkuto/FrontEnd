import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Link
            className="flex items-center gap-2 font-bold text-gray-900 text-xl"
            href="/"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-5" />
            </div>
            Guzo Quest
          </Link>
          <p className="text-center text-muted-foreground text-sm">
            {description}
          </p>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
