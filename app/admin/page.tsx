'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  FolderOpen,
  Cpu,
  Briefcase,
  MessageSquare,
  Mail,
  Eye,
  Clock,
  Settings,
  Loader2,
  LogOut,
  Shield,
  Trash2,
  UserCheck,
  UserX,
  Users,
  HardDrive
} from 'lucide-react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import { useSkills } from '@/hooks/useSkills';
import { useExperience } from '@/hooks/useExperience';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useMessages } from '@/hooks/useMessages';
import { useAdminSettings } from '@/hooks/useSettings';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useAuth } from '@/hooks/useAuth';
import type { AnalyticsUser } from '@/lib/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

const statStyles = {
  projects: 'text-primary bg-primary/15',
  skills: 'text-accent bg-accent/15',
  experience: 'text-green-500 bg-green-500/15',
  testimonials: 'text-yellow-500 bg-yellow-500/15'
} as const;

export default function AdminDashboard() {
  const { logout, user: currentUser } = useAuth();
  const [userPage, setUserPage] = useState(1);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [userActionError, setUserActionError] = useState<string | null>(null);
  const { projects, isLoading: projectsLoading } = useProjects();
  const { skills, isLoading: skillsLoading } = useSkills();
  const { experiences, isLoading: experienceLoading } = useExperience();
  const { testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const { messages, isLoading: messagesLoading } = useMessages();
  const { settings } = useAdminSettings();
  const { analytics, isLoading: analyticsLoading, setUserBlocked, deleteUser } = useAdminAnalytics();

  const isLoading =
    projectsLoading || skillsLoading || experienceLoading || testimonialsLoading || messagesLoading || analyticsLoading;

  const stats = [
    { key: 'projects', label: 'Total Projects', value: projects.length, icon: FolderKanban, href: '/admin/projects' },
    { key: 'skills', label: 'Skills', value: skills.length, icon: Cpu, href: '/admin/skills' },
    { key: 'experience', label: 'Experience', value: experiences.length, icon: Briefcase, href: '/admin/experience' },
    { key: 'testimonials', label: 'Testimonials', value: testimonials.length, icon: MessageSquare, href: '/admin/testimonials' },
  ] as const;

  const quickActions = [
    { label: 'Manage Projects', icon: FolderKanban, href: '/admin/projects' },
    { label: 'Manage Skills', icon: Cpu, href: '/admin/skills' },
    { label: 'Manage Experience', icon: Briefcase, href: '/admin/experience' },
    { label: 'Open Assets', icon: FolderOpen, href: '/admin/assets' },
    { label: 'Open Settings', icon: Settings, href: '/admin/settings' },
  ];

  const latestMessages = messages.slice(0, 3);
  const featuredProjects = projects.filter((project: any) => project.featured).slice(0, 3);
  const usersPerPage = 6;
  const totalUserPages = Math.max(1, Math.ceil((analytics?.users.length ?? 0) / usersPerPage));
  const paginatedUsers = useMemo(
    () => (analytics?.users ?? []).slice((userPage - 1) * usersPerPage, userPage * usersPerPage),
    [analytics?.users, userPage]
  );
  const storageUsage = analytics?.storage;

  useEffect(() => {
    if (userPage > totalUserPages) {
      setUserPage(totalUserPages);
    }
  }, [totalUserPages, userPage]);

  const handleUserBlockToggle = async (user: AnalyticsUser) => {
    setActionUserId(user.id);
    setUserActionError(null);

    try {
      await setUserBlocked(user.id, !user.blocked);
    } catch (error: any) {
      setUserActionError(error?.response?.data?.error || 'Unable to update the user status right now.');
    } finally {
      setActionUserId(null);
    }
  };

  const handleUserDelete = async (user: AnalyticsUser) => {
    setActionUserId(user.id);
    setUserActionError(null);

    try {
      await deleteUser(user.id);
    } catch (error: any) {
      setUserActionError(error?.response?.data?.error || 'Unable to delete the user right now.');
    } finally {
      setActionUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground mb-2"
            >
              {settings?.adminPanelTitle || 'Dashboard'}
            </motion.h1>
            <p className="text-muted-foreground">
              {settings?.siteTagline || 'Manage your portfolio data, branding, and public profile from one place.'}
            </p>
          </div>

          <Button variant="outline" onClick={() => void logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Link href={stat.href}>
              <div className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statStyles[stat.key]}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Eye className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-xl p-6"
        >
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">User Analytics</h2>
              <p className="text-sm text-muted-foreground">User growth over the last 7 days and currently active accounts.</p>
            </div>
            <div className="rounded-lg bg-primary/10 px-3 py-2 text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Active Now</p>
              <p className="text-xl font-semibold text-foreground">{analytics?.totals.activeNow ?? 0}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                Total Users
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.totals.users ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                Admins
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.totals.admins ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                Members
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.totals.members ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 md:col-span-3">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <UserX className="h-4 w-4 text-primary" />
                Blocked Users
              </div>
              <p className="text-3xl font-bold text-foreground">{analytics?.totals.blocked ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 md:col-span-3">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <HardDrive className="h-4 w-4 text-primary" />
                Storage Usage
              </div>
              <p className="text-3xl font-bold text-foreground">
                {storageUsage ? `${storageUsage.used.toFixed(2)} / ${storageUsage.total} MB` : '—'}
              </p>
              <p className="text-xs text-muted-foreground">
                {storageUsage ? `${storageUsage.remaining.toFixed(2)} MB remaining` : ''}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">User Growth</h3>
              <span className="text-xs text-muted-foreground">Cumulative users by day</span>
            </div>
            <div className="h-72 rounded-2xl border border-border/50 bg-secondary/20 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.growth ?? []}>
                  <defs>
                    <linearGradient id="userGrowthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="label" stroke="rgba(148,163,184,0.8)" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} stroke="rgba(148,163,184,0.8)" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: '1px solid rgba(148,163,184,0.2)',
                      background: 'rgba(15,23,42,0.92)',
                      color: '#f8fafc'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalUsers"
                    name="Users"
                    stroke="#22c55e"
                    strokeWidth={3}
                    fill="url(#userGrowthFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {(analytics?.activeUsers ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No user activity recorded in the last 24 hours.</p>
            ) : (
              analytics?.activeUsers.slice(0, 5).map((activeUser) => (
                <div key={activeUser.id} className="rounded-xl bg-secondary/30 p-3">
                  <p className="font-medium text-foreground">{activeUser.name}</p>
                  <p className="text-sm text-muted-foreground">{activeUser.email}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{activeUser.role}</span>
                    <span>{activeUser.lastLoginProvider || 'credentials'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Registered Users</h2>
            <p className="text-sm text-muted-foreground">View all registered accounts and manage access.</p>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            {analytics?.users.length ?? 0} registered users
          </div>
        </div>

        {userActionError ? <p className="mb-4 text-sm text-destructive">{userActionError}</p> : null}

        <div className="space-y-3">
          {paginatedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registered users found.</p>
          ) : (
            paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-secondary/20 p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{user.role}</span>
                    {user.blocked ? (
                      <span className="rounded-full bg-destructive/10 px-2 py-1 text-xs text-destructive">Blocked</span>
                    ) : (
                      <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-500">Active</span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionUserId === user.id || currentUser?.id === user.id}
                    onClick={() => void handleUserBlockToggle(user)}
                  >
                    {actionUserId === user.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : user.blocked ? (
                      <UserCheck className="mr-2 h-4 w-4" />
                    ) : (
                      <UserX className="mr-2 h-4 w-4" />
                    )}
                    {user.blocked ? 'Unblock' : 'Block'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={actionUserId === user.id || currentUser?.id === user.id}
                    onClick={() => void handleUserDelete(user)}
                  >
                    {actionUserId === user.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalUserPages > 1 ? (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setUserPage((page) => Math.max(1, page - 1));
                  }}
                  className={userPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalUserPages }, (_, index) => index + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={userPage === page}
                    onClick={(event) => {
                      event.preventDefault();
                      setUserPage(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    setUserPage((page) => Math.min(totalUserPages, page + 1));
                  }}
                  className={userPage === totalUserPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </div>
                <span className="text-foreground">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Latest Messages
            </h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/messages">
                <Mail className="w-4 h-4 mr-2" />
                View Inbox
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {latestMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages received yet.</p>
            ) : (
              latestMessages.map((message: any) => (
                <div key={message.id} className="rounded-lg bg-secondary/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{message.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {message.name} • {message.email}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {message.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Featured Projects</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/projects">View All</Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No featured projects configured yet.</p>
          ) : (
            featuredProjects.map((project: any) => (
              <div key={project.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <h3 className="font-medium text-foreground mb-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.techStack.slice(0, 3).map((tech: string) => (
                    <span key={tech} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
