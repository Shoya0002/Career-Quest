"use client";

import { Compass, Brain, PiggyBank, Check } from "lucide-react";

const PHASES = [
  {
    phase: "Phase 01",
    title: "Explore",
    icon: Compass,
    iconBg: "bg-indigo-50 text-primary",
    badgeColor: "text-muted-foreground",
    cardBorder: "border-border hover:border-slate-300",
    description:
      "Discover careers, realistic salary context, and practical education pathways without bias or commercial sponsor agendas.",
    checklist: [
      "Salary progression by experience level",
      "Undergrad & graduate degree roadmaps",
      "Realistic 10-year job demand projections",
    ],
  },
  {
    phase: "Phase 02",
    title: "Experience",
    icon: Brain,
    iconBg: "bg-sky-50 text-sky-700",
    badgeColor: "text-sky-700",
    cardBorder: "border-2 border-primary/30 hover:border-primary shadow-xs",
    description:
      "Try realistic 5-minute workplace simulations before committing years of degree study and financial resources.",
    checklist: [
      "Scenario-based real problem solving",
      "Authentic tools & professional context",
      "Zero fear of incorrect answers or grades",
    ],
  },
  {
    phase: "Phase 03",
    title: "Decide",
    icon: PiggyBank,
    iconBg: "bg-indigo-50 text-primary",
    badgeColor: "text-muted-foreground",
    cardBorder: "border-border hover:border-slate-300",
    description:
      "Compare options, understand parent financial constraints, and review balanced pathway trade-offs as a family unit.",
    checklist: [
      "Transparent college cost matrices",
      "Side-by-side career comparison tables",
      "Shared parent-student roadmap export",
    ],
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 md:px-10 py-16 border-t border-border">
      <div className="max-w-2xl mb-12">
        <span className="text-xs font-semibold text-primary tracking-wider uppercase">
          A METHODICAL APPROACH
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mt-1">
          How CareerQuest Works
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Structured guidance rooted in empirical industry data, designed to remove
          guesswork from higher-education investment decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PHASES.map((phase) => {
          const Icon = phase.icon;
          return (
            <div
              key={phase.phase}
              className={`flex flex-col justify-between rounded-xl bg-white p-6 md:p-8 shadow-xs transition-all duration-200 ${phase.cardBorder}`}
            >
              <div>
                <div className={`flex size-12 items-center justify-center rounded-lg ${phase.iconBg} mb-6`}>
                  <Icon className="size-6" />
                </div>

                <div className={`text-xs font-bold tracking-wider uppercase mb-1 ${phase.badgeColor}`}>
                  {phase.phase}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {phase.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {phase.description}
                </p>
              </div>

              <ul className="mt-6 pt-6 border-t border-border space-y-2.5 text-xs text-muted-foreground">
                {phase.checklist.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                      <Check className="size-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
