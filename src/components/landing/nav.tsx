import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GradientLink } from "@/components/ui/gradient-button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl border border-transparent px-4 py-2.5 transition-all",
            scrolled && "glass-strong border-border shadow-[0_10px_40px_-20px_oklch(0_0_0/0.6)]",
          )}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary shadow-glow">
              <span className="font-display text-lg font-bold text-primary-foreground">C</span>
            </div>
            <span className="font-display text-lg font-bold tracking-tight">CampusPM</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {signedIn ? (
              <GradientLink to="/app" size="sm">
                Open app
              </GradientLink>
            ) : (
              <>
                <GradientLink to="/auth" variant="ghost" size="sm">
                  Sign in
                </GradientLink>
                <GradientLink to="/auth" size="sm">
                  Get started
                </GradientLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
