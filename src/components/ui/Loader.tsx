import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: number | string;
  className?: string;
  center?: boolean;
}

export function Loader({
  size = 32,
  className = '',
  center = false,
}: LoaderProps) {
  const loader = (
    <Loader2
      aria-label="Loading"
      className={cn(
        'animate-spin text-primary',
        typeof size === 'number'
          ? `h-[${size}px] w-[${size}px]`
          : `h-[${size}] w-[${size}]`,
        className
      )}
    />
  );
  if (center) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {loader}
      </div>
    );
  }
  return loader;
}
