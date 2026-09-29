"use client";

import React from "react";
import { Scale, GraduationCap } from "lucide-react";
import { DecisionConsequence } from "@/types/experience";

interface ConsequencePanelProps {
  consequence: DecisionConsequence;
}

export function ConsequencePanel({ consequence }: ConsequencePanelProps) {
  const getBadgeStyle = (variant: DecisionConsequence["rulingVariant"]) => {
    switch (variant) {
      case "success":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800";
      case "danger":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800";
      case "info":
      default:
        return "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-sky-200 dark:border-sky-900/60 p-5 shadow-sm relative overflow-hidden flex flex-col gap-4">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-sky-600 dark:bg-sky-500" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs md:text-sm font-bold text-foreground">
            {consequence.headline}
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 text-[11px] font-semibold">
          Live Simulation Result
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Bench Ruling Box */}
        <div className="bg-muted/40 dark:bg-muted/20 p-3.5 rounded-lg border border-border flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs md:text-sm font-semibold text-foreground">
              Live Courtroom Reaction & Bench Ruling
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${getBadgeStyle(consequence.rulingVariant)}`}>
              {consequence.rulingBadge}
            </span>
          </div>

          <p className="text-xs text-foreground leading-relaxed">
            {consequence.description}
          </p>
        </div>

        {/* Professional Reality Takeaway */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
          <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
              Professional Reality Lesson
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {consequence.realityLesson}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
