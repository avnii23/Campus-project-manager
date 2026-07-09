import { motion } from "motion/react";
import { Check } from "lucide-react";
import { GradientLink } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Student",
    price: "Free",
    period: "forever",
    desc: "Everything you need for one project.",
    features: [
      "1 active project",
      "Up to 5 team members",
      "Kanban, repository, meetings",
      "50 AI generations / month",
      "Community support",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Team",
    price: "$6",
    period: "/ student / month",
    desc: "For serious teams shipping serious projects.",
    features: [
      "Unlimited projects",
      "Up to 20 team members",
      "Unlimited AI generations",
      "Advanced analytics",
      "Version history 90 days",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Campus",
    price: "Custom",
    period: "for institutions",
    desc: "Deploy across your college or university.",
    features: [
      "Everything in Team",
      "SSO & SAML",
      "Advisor & admin roles",
      "Rubric integration",
      "Dedicated success manager",
      "SLA & data residency",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </div>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Free for students. <span className="gradient-text">Fair for teams.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade only if you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "relative rounded-2xl border p-8 transition",
                t.highlight
                  ? "border-primary/50 bg-gradient-to-b from-primary/[0.08] to-transparent shadow-glow"
                  : "border-border bg-surface",
              )}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-bold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>

              <GradientLink
                to="/auth"

                variant={t.highlight ? "primary" : "outline"}
                className="mt-6 w-full"
              >
                {t.cta}
              </GradientLink>

              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
