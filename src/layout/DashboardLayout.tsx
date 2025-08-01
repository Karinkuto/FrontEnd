import { GalleryVerticalEnd, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import UserButton from '@/components/dashboard/user-button';
import { ModeToggle } from '@/components/mode-toggle';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';

// Define the shape of a single navigation item
export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon; // Using LucideIcon type for icons from lucide-react
  children?: NavItem[]; // For nested sub-menu items
}

// Define the shape of a navigation group
export interface NavGroup {
  label?: string; // Optional label for the group (e.g., "General", "Admin")
  roles?: string[]; // Optional array of roles for this group to be visible
  items: NavItem[]; // The actual navigation items within this group
}

// Define the props for the DashboardLayout component
interface DashboardLayoutProps {
  navData: NavGroup[]; // Array of navigation groups
  children: React.ReactNode;
  // TODO: Add a prop for current user roles to filter navData
  // currentUserRoles: string[];
}

export function DashboardLayout({ navData, children }: DashboardLayoutProps) {
  const router = useRouter();

  // Function to determine if a nav item is active
  const isActive = (href: string) => {
    // For exact match
    if (router.pathname === href) {
      return true;
    }
    if (href !== '/' && router.pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  // Placeholder for user role checking (to be implemented by the user based on actual user roles)
  const userHasRole = (roles?: string[]) => {
    if (!roles || roles.length === 0) {
      return true; // If no roles specified, it's visible to everyone
    }
    // TODO: Replace this with actual role checking logic, e.g.,
    // return roles.some(role => currentUserRoles.includes(role));
    return true; // For now, always return true for MVP
  };

  // Helper to flatten navData for breadcrumb lookup
  function findBreadcrumbTrail(pathname: string) {
    const segments = pathname.split('/').filter(Boolean);
    const trail = [];
    const navGroups = navData;
    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      let found = null;
      for (const group of navGroups) {
        for (const item of group.items) {
          if (item.href === currentPath) {
            found = { title: item.title, href: item.href };
            break;
          }
          if (item.children) {
            for (const sub of item.children) {
              if (sub.href === currentPath) {
                found = { title: sub.title, href: sub.href };
                break;
              }
            }
          }
        }
        if (found) break;
      }
      if (found) {
        trail.push(found);
      } else {
        // fallback to capitalized segment
        trail.push({
          title: segments[i][0].toUpperCase() + segments[i].slice(1),
          href: currentPath,
        });
      }
    }
    return trail;
  }

  const breadcrumbTrail = findBreadcrumbTrail(router.pathname);

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
          '--sidebar-width-mobile': '18rem',
          '--sidebar-width-icon': '3rem',
        } as React.CSSProperties
      }
    >
      <Sidebar className="px-4" collapsible="offcanvas" variant="inset">
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <Link
              className="flex items-center gap-2 font-bold text-foreground text-xl"
              href="/"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="size-5" />
              </div>
              <span>Guzo Quest</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="mt-4">
          {navData.map(
            (group, groupIndex) =>
              userHasRole(group.roles) && (
                <React.Fragment key={group.label || `group-${groupIndex}`}>
                  <SidebarGroup>
                    {group.label && (
                      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    )}
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {group.items.map((item) => (
                          <React.Fragment key={item.title}>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                asChild
                                isActive={isActive(item.href)}
                                variant={'outline'}
                              >
                                <Link href={item.href}>
                                  {item.icon && <item.icon />}
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            {item.children && item.children.length > 0 && (
                              <SidebarMenuSub>
                                {item.children.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isActive(subItem.href)}
                                    >
                                      <Link href={subItem.href}>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            )}
                          </React.Fragment>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                  {groupIndex < navData.length - 1 && <SidebarSeparator />}
                </React.Fragment>
              )
          )}
        </SidebarContent>
        <SidebarFooter>
          <UserButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4">
        <div className="mb-4 flex w-full items-center gap-4">
          <SidebarTrigger />
          <div className="min-w-0 flex-1">
            <Breadcrumb>
              <BreadcrumbList>
                {router.pathname === '/admin' ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Admin</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbTrail
                      .filter((item) => item.href !== '/admin')
                      .map((item, idx, arr) => (
                        <React.Fragment key={item.href}>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            {idx === arr.length - 1 ? (
                              <BreadcrumbPage>{item.title}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink href={item.href}>
                                {item.title}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      ))}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </div>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
