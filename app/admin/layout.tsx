'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  Briefcase,
  MessageSquare,
  Mail,
  Settings,
  FolderOpen,
  LogOut,
  Menu,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { useAdminSettings } from '@/hooks/useSettings';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/admin/skills', icon: Cpu, label: 'Skills' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
  { href: '/admin/messages', icon: Mail, label: 'Messages' },
  { href: '/admin/assets', icon: FolderOpen, label: 'Assets' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

type AdminSidebarProps = {
  pathname: string | null;
  panelTitle: string;
  siteTitle: string;
  userName: string;
  userEmail: string;
  isLoading: boolean;
  onLogout: () => void;
  closeOnNavigate?: boolean;
};

function AdminSidebar({
  pathname,
  panelTitle,
  siteTitle,
  userName,
  userEmail,
  isLoading,
  onLogout,
  closeOnNavigate = false,
}: AdminSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 p-6">
        {closeOnNavigate ? (
          <SheetClose asChild>
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent" />
                <div className="absolute inset-0.5 flex items-center justify-center rounded-lg bg-background">
                  <span className="font-mono text-lg font-bold text-primary">A</span>
                </div>
              </div>
              <div>
                <span className="block font-semibold text-foreground">{panelTitle}</span>
                <span className="text-xs text-muted-foreground">{siteTitle}</span>
              </div>
            </Link>
          </SheetClose>
        ) : (
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent" />
              <div className="absolute inset-0.5 flex items-center justify-center rounded-lg bg-background">
                <span className="font-mono text-lg font-bold text-primary">A</span>
              </div>
            </div>
            <div>
              <span className="block font-semibold text-foreground">{panelTitle}</span>
              <span className="text-xs text-muted-foreground">{siteTitle}</span>
            </div>
          </Link>
        )}
      </div>

      <nav className="admin-scroll flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          const navLink = (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`relative flex items-center gap-3 rounded-lg px-4 py-3 transition-colors duration-150 ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
              }`}
            >
              {isActive ? <span className="absolute left-0 h-8 w-1 rounded-r bg-primary" /> : null}
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );

          return closeOnNavigate ? (
            <SheetClose key={item.href} asChild>
              {navLink}
            </SheetClose>
          ) : navLink;
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {isLoading ? 'Loading...' : userName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <div className="space-y-2">
          {closeOnNavigate ? (
            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/">
                  <LogOut className="h-4 w-4" />
                  Back to Site
                </Link>
              </Button>
            </SheetClose>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/">
                <LogOut className="h-4 w-4" />
                Back to Site
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => void onLogout()}
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, status, user } = useAuth();
  const { settings } = useAdminSettings();
  const panelTitle = settings?.adminPanelTitle || 'Admin Panel';
  const siteTitle = settings?.siteTitle || 'Portfolio Manager';
  const userName = user?.name || 'Admin';
  const userEmail = user?.email || 'No session email';

  useEffect(() => {
    if (pathname === '/admin/login' || pathname === '/admin/register') {
      return;
    }
    document.body.classList.add('admin-body-lock');
    return () => {
      document.body.classList.remove('admin-body-lock');
    };
  }, [pathname]);

  // Login page doesn't need the admin layout
  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="hidden h-full w-64 shrink-0 border-r border-border/50 glass-card md:block">
        <AdminSidebar
          pathname={pathname}
          panelTitle={panelTitle}
          siteTitle={siteTitle}
          userName={userName}
          userEmail={userEmail}
          isLoading={status === 'loading'}
          onLogout={logout}
        />
      </aside>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 border-b border-border/50 px-4 py-4 glass-card sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Open navigation menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[86vw] max-w-xs p-0">
                  <SheetTitle className="sr-only">{panelTitle}</SheetTitle>
                  <SheetDescription className="sr-only">
                    Admin navigation and account actions.
                  </SheetDescription>
                  <AdminSidebar
                    pathname={pathname}
                    panelTitle={panelTitle}
                    siteTitle={siteTitle}
                    userName={userName}
                    userEmail={userEmail}
                    isLoading={status === 'loading'}
                    onLogout={logout}
                    closeOnNavigate={true}
                  />
                </SheetContent>
              </Sheet>
              <Link href="/admin" className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">{panelTitle}</span>
                <span className="block truncate text-xs text-muted-foreground">{siteTitle}</span>
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="hidden sm:inline">Welcome back, </span>
              <span className="text-primary">{userName}</span>
            </div>
            <div className="hidden md:block text-xs text-muted-foreground">
              {userEmail}
            </div>
          </div>
        </header>

        <main className="admin-scroll flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutContent>{children}</AdminLayoutContent>
  );
}
