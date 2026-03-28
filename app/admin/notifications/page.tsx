'use client';

import { Bell, Mail, Smartphone, Loader2 } from 'lucide-react';
import { useNotificationsAdmin } from '@/hooks/useNotificationsAdmin';

function truncateToken(token: string) {
  if (!token) return '';
  if (token.length <= 18) return token;
  return `${token.slice(0, 10)}...${token.slice(-6)}`;
}

export default function AdminNotificationsPage() {
  const { subscribers, tokens, isLoading } = useNotificationsAdmin();

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Manage subscribers and push tokens for portfolio updates.
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary">
            {subscribers.length} email subscribers • {tokens.length} push tokens
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-foreground">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Email Subscribers</h2>
          </div>
          {subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No email subscribers yet.</p>
          ) : (
            <div className="space-y-3">
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="rounded-xl border border-border/50 bg-secondary/20 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{subscriber.name || subscriber.email}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        subscriber.status === 'subscribed'
                          ? 'bg-green-500/10 text-green-500'
                          : subscriber.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      {subscriber.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {subscriber.preferences.blogs ? <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">Blogs</span> : null}
                    {subscriber.preferences.projects ? <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">Projects</span> : null}
                    {subscriber.preferences.assets ? <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">Assets</span> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center gap-2 text-foreground">
            <Smartphone className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Push Tokens</h2>
          </div>
          {tokens.length === 0 ? (
            <p className="text-sm text-muted-foreground">No push tokens registered yet.</p>
          ) : (
            <div className="space-y-3">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="rounded-xl border border-border/50 bg-secondary/20 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <p className="font-medium text-foreground">{truncateToken(token.token)}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {token.userAgent ? token.userAgent.slice(0, 80) : 'Unknown device'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {token.preferences.blogs ? <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">Blogs</span> : null}
                    {token.preferences.projects ? <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">Projects</span> : null}
                    {token.preferences.assets ? <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">Assets</span> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
