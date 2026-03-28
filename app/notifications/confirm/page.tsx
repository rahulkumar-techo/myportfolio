import Link from "next/link";
import { confirmEmailSubscriber } from "@/repositories/notification-repository";

export const dynamic = "force-dynamic";

type ConfirmPageProps = {
  searchParams?: { token?: string };
};

export default async function ConfirmNotificationPage({ searchParams }: ConfirmPageProps) {
  const token = searchParams?.token ?? "";

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card rounded-2xl p-8 max-w-lg text-center">
          <h1 className="text-2xl font-bold text-foreground">Missing confirmation token</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please use the confirmation link from your email.
          </p>
          <Link href="/" className="mt-4 inline-block text-primary">
            Return to home
          </Link>
        </div>
      </main>
    );
  }

  const confirmed = await confirmEmailSubscriber(token);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card rounded-2xl p-8 max-w-lg text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {confirmed ? "Subscription confirmed" : "Confirmation link expired"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {confirmed
            ? "You will now receive updates when new blogs, projects, and assets go live."
            : "Please request a new confirmation email from the notifications prompt."}
        </p>
        <Link href="/" className="mt-4 inline-block text-primary">
          Return to home
        </Link>
      </div>
    </main>
  );
}
