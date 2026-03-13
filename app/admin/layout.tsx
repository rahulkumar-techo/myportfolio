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
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, status, user } = useAuth();
  const { settings } = useAdminSettings();

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
    <div className="h-dvh flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full shrink-0 glass-card border-r border-border/50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent" />
                <div className="absolute inset-0.5 rounded-lg bg-background flex items-center justify-center">
                  <span className="text-primary font-bold text-lg font-mono">A</span>
                </div>
              </div>
              <div>
                <span className="text-foreground font-semibold block">
                  {settings?.adminPanelTitle || 'Admin Panel'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {settings?.siteTitle || 'Portfolio Manager'}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto admin-scroll">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname!.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ${isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                    }`}
                >
                  {isActive && (
                    <span className="absolute left-0 w-1 h-8 bg-primary rounded-r" />
                  )}
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {status === 'loading' ? 'Loading...' : user?.name || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'No session email'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/">
                  <LogOut className="w-4 h-4" />
                  Back to Site
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => void logout()}
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-card border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="hidden sm:inline">Welcome back, </span>
                <span className="text-primary">{user?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 admin-scroll">
          <div className="max-w-7xl mx-auto">
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
