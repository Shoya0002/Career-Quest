"use client";

import Link from "next/link";
import { Terminal, ArrowRight, Play, Clock, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ContinueExperienceCardProps {
  careerTitle?: string;
  scenarioTitle?: string;
  description?: string;
  progressPercentage?: number;
  estimatedMinutesRemaining?: number;
  href?: string;
}

export function ContinueExperienceCard({
  careerTitle = "Software Engineering",
  scenarioTitle = "Production Incident",
  description = "Continue your interactive experience and see how you handle a real-world engineering scenario.",
  progressPercentage = 72,
  estimatedMinutesRemaining = 4,
  href = "/experience?career=software-engineer",
}: ContinueExperienceCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Continue Exploring
        </h2>
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Simulation
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border-2 border-primary/25 bg-white p-6 sm:p-8 shadow-xs hover:border-primary transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-primary text-xs font-semibold">
                <Terminal className="size-3.5" />
                <span>{careerTitle}</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <Clock className="size-3 text-muted-foreground" />
                <span>~{estimatedMinutesRemaining} mins left</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-medium">
                <Sparkles className="size-3 text-sky-500" />
                <span>AI Council Feedback Ready</span>
              </span>
            </div>

            {/* Scenario Title */}
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {scenarioTitle}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Progress Bar & Metric */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Scenario Progress</span>
                <span className="text-foreground font-bold">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-slate-100" />
            </div>
          </div>

          {/* Action CTA */}
          <div className="shrink-0 pt-2 lg:pt-0">
            <Link
              href={href}
              className={buttonVariants({
                size: "lg",
                className:
                  "w-full sm:w-auto h-11 px-6 rounded-lg bg-primary hover:bg-[#4338CA] text-white font-semibold text-sm shadow-xs transition-all duration-150 active:scale-[0.99] gap-2",
              })}
            >
              <Play className="size-4 fill-white" />
              <span>Continue Experience</span>
              <ArrowRight className="size-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
