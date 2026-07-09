import { Link } from "@tanstack/react-router";
import { GradientLink } from "@/components/ui/gradient-button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/[0.12] via-transparent to-transparent p-12 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 gradient-mesh opacity-60" />
          <div className="relative">
            <h2 className="font-display text-4xl font-bold sm:text-5xl">
              Your next project deserves <br className="hidden sm:block" />
              <span className="gradient-text">a better workspace.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Free for students. Set up in 30 seconds. Ship on time.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <GradientLink to="/auth" size="lg">
                Start free
                <ArrowRight className="h-4 w-4" />
              </GradientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-black/40 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary">
                <span className="font-display text-lg font-bold text-primary-foreground">C</span>
              </div>
              <span className="font-display text-lg font-bold">CampusPM</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The all-in-one workspace for student teams.
            </p>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Roadmap", "Changelog"] },
            { title: "Resources", links: ["Docs", "Templates", "Blog", "Community"] },
            { title: "Company", links: ["About", "Privacy", "Terms", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="mb-3 text-sm font-semibold">{col.title}</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="transition hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} CampusPM. All rights reserved.</div>
          <div>Made for students, by students.</div>
        </div>
      </div>
    </footer>
  );
}
