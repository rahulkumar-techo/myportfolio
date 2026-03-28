"use client";

import { useEffect, useState } from "react";
import { Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseMessaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

const DISMISS_KEY = "notifPromptDismissed";
const EMAIL_KEY = "notifEmailSubscribed";
const PUSH_KEY = "notifPushEnabled";

function getLocalFlag(key: string) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(key) === "true";
}

function setLocalFlag(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value ? "true" : "false");
}

export default function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pushStatus, setPushStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dismissed = getLocalFlag(DISMISS_KEY);
    const emailSubscribed = getLocalFlag(EMAIL_KEY);
    const pushEnabled = getLocalFlag(PUSH_KEY);

    if (!dismissed && !emailSubscribed && !pushEnabled) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setLocalFlag(DISMISS_KEY, true);
    setIsVisible(false);
  };

  const handleEmailSubscribe = async () => {
    if (!email.trim()) {
      setError("Please enter a valid email.");
      return;
    }

    setEmailStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Unable to subscribe right now.");
      }

      setEmailStatus("success");
      setLocalFlag(EMAIL_KEY, true);
      setIsVisible(false);
    } catch (err) {
      setEmailStatus("error");
      setError(err instanceof Error ? err.message : "Subscription failed.");
    }
  };

  const handleEnablePush = async () => {
    setPushStatus("loading");
    setError(null);

    try {
      if (!("Notification" in window)) {
        throw new Error("Browser notifications are not supported.");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notifications are blocked in your browser settings.");
      }

      const messaging = await getFirebaseMessaging();
      if (!messaging) {
        throw new Error("Messaging is not supported in this browser.");
      }

      if (!("serviceWorker" in navigator)) {
        throw new Error("Service workers are not supported.");
      }

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        throw new Error("Notification key is not configured.");
      }

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration
      });

      if (!token) {
        throw new Error("Unable to get notification token.");
      }

      const res = await fetch("/api/notifications/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      if (!res.ok) {
        throw new Error("Unable to enable notifications.");
      }

      setPushStatus("success");
      setLocalFlag(PUSH_KEY, true);
      setIsVisible(false);
    } catch (err) {
      setPushStatus("error");
      setError(err instanceof Error ? err.message : "Unable to enable notifications.");
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-sm">
      <div className="glass-card rounded-2xl border border-white/10 p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-full bg-primary/15 p-2 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Stay in the loop</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get notified when new blogs, projects, or assets are published.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Button
            className="w-full"
            onClick={() => void handleEnablePush()}
            disabled={pushStatus === "loading"}
          >
            <Bell className="mr-2 h-4 w-4" />
            Enable Browser Notifications
          </Button>

          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="Email for updates"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => void handleEmailSubscribe()}
              disabled={emailStatus === "loading"}
            >
              <Mail className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              No thanks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
