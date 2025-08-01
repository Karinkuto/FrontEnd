import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import type { RootState } from '@/redux/store';

// Helper function to extract name from email (e.g., 'john.doe@example.com' -> 'John Doe')
const getNameFromEmail = (email: string): string => {
  if (!email) return 'User';

  try {
    // Extract the part before @ and split by dots
    const [namePart] = email.split('@');
    const nameParts = namePart.split('.');

    // Capitalize each part and join with space
    return nameParts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  } catch (e) {
    console.warn('Could not parse name from email:', e);
    return 'User';
  }
};

// Helper function to get initials from name or email
const getInitials = (name?: string, email?: string) => {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  if (email) {
    const nameFromEmail = getNameFromEmail(email);
    return nameFromEmail
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return 'U';
};

export default function UserButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state: RootState) => state.auth);
  const { user } = authState;

  // Get user data with fallbacks
  const userEmail = user?.email || 'No email';
  const userRole = authState.userType
    ? authState.userType.charAt(0).toUpperCase() + authState.userType.slice(1)
    : 'User'; // Capitalize first letter

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-2.5 shadow-sm transition-all duration-200 ease-out hover:border-primary/30 hover:bg-accent/30">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate font-medium text-foreground/90 text-sm">
              {userEmail}
            </span>
            <Badge
              className="h-5 w-fit border border-border/30 bg-primary/10 px-2 py-0.5 font-medium text-[11px] text-primary/90"
              variant="secondary"
            >
              {userRole}
            </Badge>
          </div>
          <ChevronDown className="size-4 text-muted-foreground transition-all duration-300 ease-out group-hover:text-foreground/90 group-data-[state=open]:rotate-180" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="truncate text-muted-foreground text-xs leading-none">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
