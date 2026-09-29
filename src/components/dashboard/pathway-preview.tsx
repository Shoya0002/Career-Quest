"use client";

import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  Briefcase,
  ArrowRight,
  GitBranch,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

interface BranchStep {
  id: string;
  category: "education" | "skills" | "career";
  stepLabel: string;
  title: string;
  subtitle: string;
}

const DEFAULT_BRANCHES: BranchStep[] = [
  {
    id: "step-1",
    category: "education",
    stepLabel: "01. Education Foundation",
    title: "B.S. in Computer Science or STEM",
    subtitle: "Core analytical & quantitative coursework (4 Yrs)",
  },
  {
    id: "step-2",
    category: "skills",
    stepLabel: "02. Core Capabilities",
    title: "Distributed Systems & Cloud",
    subtitle: "Full-stack development, algorithms, system design",
  },
  {
    id: "step-3",
    category: "career",
    stepLabel: "03. Career Outcome",
    title: "Senior Software Architect / Tech Lead",
    subtitle: "High-impact technical leadership ($130k–$195k+)",
  },
];

const STEP_ICONS = {
  education: { component: GraduationCap, color: "bg-indigo-50 text-primary" },
  skills: { component: Sparkles, color: "bg-sky-50 text-sky-700" },
  career: { component: Briefcase, color: "bg-emerald-50 text-emerald-700" },
};

interface PathwayPreviewProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  branches?: BranchStep[];
}

export function PathwayPreview({
  title = "Explore Your Possible Paths",
  subtitle = "See how education choices, skills and different decisions can lead to different career outcomes.",
  ctaText = "View Career Map",
  ctaHref = ROUTES.JOURNEY,
  branches = DEFAULT_BRANCHES,
}: PathwayPreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-sky-600 tracking-wider uppercase flex items-center gap-1.5">
              <GitBranch className="size-3.5" />
              <span>Interactive Decision Route</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            {subtitle}
          </p>
        </div>

        <Link
          href={ctaHref}
          className={buttonVariants({
            variant: "outline",
            size: "lg",
            className:
              "h-10 px-5 rounded-lg border-border hover:bg-slate-50 hover:border-slate-300 text-foreground text-xs font-semibold shrink-0 gap-2",
          })}
        >
          <span>{ctaText}</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Visual Branching Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        {branches.map((step, idx) => {
          const iconConfig = STEP_ICONS[step.category] || STEP_ICONS.education;
          const Icon = iconConfig.component;
          const isLast = idx === branches.length - 1;

          return (
            <div
              key={step.id}
              className="relative flex flex-col justify-between rounded-lg border border-border bg-slate-50/60 p-4 transition-all duration-150 hover:bg-white hover:border-slate-300 hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex size-9 items-center justify-center rounded-lg ${iconConfig.color}`}>
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {step.stepLabel}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.subtitle}
                </p>
              </div>

              {!isLast && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 items-center justify-center rounded-full bg-white border border-border text-muted-foreground shadow-xs">
                  <ArrowRight className="size-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
