import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MailCheck } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [{ title: "Verify email — CampusPM" }, { name: "robots", content: "noindex" }],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [status, setStatus] = useState<"pending" | "verified" | "waiting">("pending");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    // Supabase auto-signs-in via the recovery/verification link — session appears here.
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setStatus(data.user?.email_confirmed_at ? "verified" : "waiting");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user?.email_confirmed_at) setStatus("verified");
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthShell
      title={status === "verified" ? "Email verified" : "Verify your email"}
      subtitle={
        status === "verified"
          ? "You're all set — jump into your workspace."
          : "Click the link we sent to confirm your email address."
      }
    >
      <div className="rounded-2xl border border-border bg-surface/60 p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full gradient-primary shadow-glow">
          {status === "verified" ? (
            <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
          ) : status === "pending" ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
          ) : (
            <MailCheck className="h-6 w-6 text-primary-foreground" />
          )}
        </div>
        {status === "verified" ? (
          <Button className="mt-6 w-full" onClick={() => navigate({ to: "/app" })}>
            Enter workspace
          </Button>
        ) : (
          <>
            <p className="mt-4 text-sm text-muted-foreground">
              Didn't get the email? Check your spam folder, or try signing in again to resend it.
            </p>
            <Link
              to="/auth"
              search={{ mode: "signin" }}
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold transition hover:bg-surface-2"
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </AuthShell>
  );
}
