"use client";

import { useState } from "react";
import { Bell, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Preferences = {
  blogs: boolean;
  projects: boolean;
  assets: boolean;
};

const defaultPreferences: Preferences = {
  blogs: true,
  projects: true,
  assets: true
};

export default function ManageNotifications() {
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "pending">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const updatePreference = (key: keyof Preferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, preferences })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.status === "pending") {
          setStatus("pending");
          setMessage("Please confirm your email before updating preferences.");
          return;
        }
        throw new Error(data?.error || "Unable to update preferences.");
      }

      setStatus("success");
      setMessage("Preferences updated successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to update preferences.");
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        throw new Error("Unable to send confirmation email.");
      }

      setStatus("pending");
      setMessage("Confirmation email sent. Please check your inbox.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send confirmation email.");
    }
  };

  const handleUnsubscribe = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        throw new Error("Unable to unsubscribe.");
      }

      setStatus("success");
      setMessage("You have been unsubscribed.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to unsubscribe.");
    }
  };

  return (
    <section id="notification-preferences" className="relative py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-mono tracking-[0.3em] text-primary">NOTIFICATIONS</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">Manage your updates</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose which updates you want to receive by email.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Bell className="h-5 w-5" />
              Preferences
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <div className="space-y-3 rounded-xl border border-border/50 bg-secondary/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Blog updates</p>
                    <p className="text-xs text-muted-foreground">New articles and insights.</p>
                  </div>
                  <Switch
                    checked={preferences.blogs}
                    onCheckedChange={(value) => updatePreference("blogs", Boolean(value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Project launches</p>
                    <p className="text-xs text-muted-foreground">Fresh builds and case studies.</p>
                  </div>
                  <Switch
                    checked={preferences.projects}
                    onCheckedChange={(value) => updatePreference("projects", Boolean(value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Asset drops</p>
                    <p className="text-xs text-muted-foreground">New downloads and resources.</p>
                  </div>
                  <Switch
                    checked={preferences.assets}
                    onCheckedChange={(value) => updatePreference("assets", Boolean(value))}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3">
              <Button onClick={() => void handleSave()} disabled={status === "loading"}>
                <MailCheck className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
              <Button variant="outline" onClick={() => void handleResend()} disabled={status === "loading"}>
                Resend Confirmation
              </Button>
              <Button variant="ghost" onClick={() => void handleUnsubscribe()} disabled={status === "loading"}>
                Unsubscribe
              </Button>

              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
