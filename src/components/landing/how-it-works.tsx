import { motion } from "motion/react";

const steps = [
  {
    n: "01",
    title: "Create your project",
    desc: "Spin up a workspace in 30 seconds. Invite your team by email or link.",
  },
  {
    n: "02",
    title: "Plan on the board",
    desc: "Break the project into tasks. Assign owners, deadlines, priorities.",
  },
  {
    n: "03",
    title: "Build together",
    desc: "Upload code and docs to the repository. Meet, take notes, track action items.",
  },
  {
    n: "04",
    title: "Ship with AI",
    desc: "Generate your report, presentation, and viva prep with one click. Submit.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </div>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            From kickoff to <span className="gradient-text">final submission.</span>
          </h2>
        </div>

        <div className="relative mt-20">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/40 to-transparent md:block" />
          <div className="space-y-12 md:space-y-24">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`relative grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-16 ${
                  i % 2 === 1
                    ? "md:[&>*:first-child]:col-start-2 md:[&>*:first-child]:row-start-1"
                    : ""
                }`}
              >
                <div className={i % 2 === 1 ? "md:text-left" : "md:text-right"}>
                  <div className="mb-2 font-display text-6xl font-bold gradient-text opacity-80">
                    {s.n}
                  </div>
                  <h3 className="font-display text-2xl font-bold sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.desc}</p>
                </div>
                <div className="hidden md:block" />
                <div className="absolute left-1/2 top-8 hidden h-4 w-4 -translate-x-1/2 rounded-full gradient-primary shadow-glow md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
