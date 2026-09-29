"use client";

import Link from "next/link";
import {
  School,
  Compass,
  Gamepad2,
  Scale,
  CheckCircle,
  Flag,
  TrendingUp,
  Timer,
  CreditCard,
  CheckCircle2,
  Info,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

const TRAJECTORY_STEPS = [
  {
    stepNumber: "01",
    title: "Student",
    icon: School,
    description: "Class 10+ students evaluating streams, foundational interests, and aspirations.",
    tagIcon: Flag,
    tagLabel: "Starting Baseline",
    tagColor: "text-[#0369A1]",
    isHighlighted: false,
  },
  {
    stepNumber: "02",
    title: "Explore",
    icon: Compass,
    description: "Discover roles, dynamic sector growth, and structured educational routes.",
    tagIcon: TrendingUp,
    tagLabel: "Real Data Only",
    tagColor: "text-primary",
    isHighlighted: false,
  },
  {
    stepNumber: "03",
    title: "Experience",
    icon: Gamepad2,
    badge: "Interactive Core",
    description: "Realistic 5-min workplace day-in-the-life tasks before committing years.",
    tagIcon: Timer,
    tagLabel: "5-Min Mini Runs",
    tagColor: "text-emerald-700",
    isHighlighted: true,
  },
  {
    stepNumber: "04",
    title: "Compare",
    icon: Scale,
    description: "Evaluate tuition costs, college duration, prerequisites, and ROI balance.",
    tagIcon: CreditCard,
    tagLabel: "Clear Finances",
    tagColor: "text-[#0369A1]",
    isHighlighted: false,
  },
  {
    stepNumber: "05",
    title: "Decide",
    icon: CheckCircle,
    description: "Informed, confident next steps with aligned family agreements and counselors.",
    tagIcon: CheckCircle2,
    tagLabel: "Informed Action",
    tagColor: "text-emerald-700",
    isHighlighted: false,
  },
];

export function GuidedTrajectory() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-10 pb-16">
      <div className="rounded-xl border border-border bg-white p-6 md:p-8 shadow-xs">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-sky-600 tracking-wider uppercase">
              THE GUIDED TRAJECTORY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              Continuous Decision Clarity, From High School to Career
            </h2>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <SlidersHorizontal className="size-3.5" />
            <span>Step-by-step Framework</span>
          </div>
        </div>

        {/* 5-Node Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {TRAJECTORY_STEPS.map((step) => {
            const Icon = step.icon;
            const TagIcon = step.tagIcon;

            return (
              <div
                key={step.stepNumber}
                className={`relative flex flex-col justify-between rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                  step.isHighlighted
                    ? "border-2 border-primary bg-white shadow-xs ring-2 ring-primary/10"
                    : "border border-border bg-slate-50/70 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`flex size-8 items-center justify-center rounded-lg text-xs font-bold ${
                        step.isHighlighted
                          ? "bg-primary text-white"
                          : "bg-slate-200/80 text-foreground"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <Icon
                      className={`size-5 ${
                        step.isHighlighted ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  {step.badge && (
                    <div className="mb-1.5 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {step.badge}
                    </div>
                  )}

                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t border-border flex items-center gap-1 text-[11px] font-medium ${step.tagColor}`}
                >
                  <TagIcon className="size-3.5 shrink-0" />
                  <span>{step.tagLabel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Node Connector Footnote */}
        <div className="mt-6 pt-4 border-t border-border flex flex-col md:flex-row md:items-center justify-between text-xs text-muted-foreground gap-2">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-primary shrink-0" />
            <span>
              No aptitude quiz lockouts: Students can freely preview multiple career paths simultaneously.
            </span>
          </div>

          <Link
            href={ROUTES.EXPERIENCE}
            className="text-primary hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
          >
            <span>Try a sample mini-simulation</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
