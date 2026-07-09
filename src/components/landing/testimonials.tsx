import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "We used to lose entire weekends coordinating on WhatsApp. CampusPM turned our final year project into something we actually enjoyed.",
    name: "Priya Rao",
    role: "CS Senior, IIT Delhi",
    avatar: "PR",
  },
  {
    quote:
      "The AI report generator saved my team 20 hours the week before submission. Genuinely feels like an unfair advantage.",
    name: "Marco Kim",
    role: "Design Student, RISD",
    avatar: "MK",
  },
  {
    quote:
      "Our advisor could finally see what everyone was doing. Contribution scores made grading transparent for the first time.",
    name: "Ade Sofowora",
    role: "MSc Thesis, TU Delft",
    avatar: "AS",
  },
  {
    quote:
      "The viva assistant asked me questions I'd never thought about. Walked into my defense feeling completely prepared.",
    name: "Sara Núñez",
    role: "MBA, IE Business School",
    avatar: "SN",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            Loved by student teams
          </div>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Built for the way <span className="gradient-text">you actually work.</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-surface p-8"
            >
              <div className="mb-4 flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-base leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
