"use client";

import React, { useState } from "react";
import { MessageSquare, Check, Sparkles } from "lucide-react";
import { BehavioralSignal, ParentDialoguePrompt } from "@/types/experience";

interface ObservedTendenciesSectionProps {
  signals: BehavioralSignal[];
  parentDialogue: ParentDialoguePrompt;
}

export function ObservedTendenciesSection({
  signals,
  parentDialogue,
}: ObservedTendenciesSectionProps) {
  const [portalSent, setPortalSent] = useState(false);

  const handleSendToParentPortal = () => {
    setPortalSent(true);
    setTimeout(() => setPortalSent(false), 3000);
  };

  const getMeterColor = (scheme: BehavioralSignal["colorScheme"]) => {
    switch (scheme) {
      case "tertiary":
      case "emerald":
        return {
          text: "text-emerald-600 dark:text-emerald-400",
          bar: "bg-emerald-600 dark:bg-emerald-500",
        };
      case "primary":
        return {
          text: "text-primary dark:text-primary",
          bar: "bg-primary",
        };
      case "secondary":
      default:
        return {
          text: "text-sky-600 dark:text-sky-400",
          bar: "bg-sky-600 dark:bg-sky-500",
        };
    }
  };

  return (
    <section className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col gap-6 mt-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-xs font-semibold tracking-wide uppercase">
            Real Work Observation · No Gamified Badges
          </span>
          <h2 className="text-lg md:text-xl font-bold text-foreground mt-1.5">
            Observed Professional Working Tendencies
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Synthesized from Alex&apos;s document triage, time allocation, and tactical risk selection during this simulation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
            Data verified by simulated case benchmarks
          </span>
        </div>
      </div>

      {/* Behavioral Signal Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {signals.map((signal) => {
          const colors = getMeterColor(signal.colorScheme);
          return (
            <div
              key={signal.id}
              className="flex flex-col gap-2 p-4 rounded-xl bg-muted/30 dark:bg-muted/10 border border-border"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {signal.title}
                </span>
                <span className={`text-xs font-bold ${colors.text}`}>
                  {signal.level}
                </span>
              </div>

              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${colors.bar}`}
                  style={{ width: `${signal.percentage}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {signal.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Parent & Student Discussion Prompt (AI Insight Callout Box) */}
      <div className="p-5 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 flex flex-col md:flex-row items-start gap-4">
        <div className="p-2.5 rounded-lg bg-sky-600 dark:bg-sky-500 text-white shrink-0 mt-0.5 shadow-xs">
          <MessageSquare className="h-5 w-5" />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs md:text-sm font-semibold text-foreground">
              {parentDialogue.title}
            </h3>
            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-[11px] font-medium">
              {parentDialogue.subtitle}
            </span>
          </div>

          <p className="text-xs md:text-sm text-foreground leading-relaxed italic">
            {parentDialogue.quote}
          </p>

          <div className="flex items-center gap-3 pt-2 text-xs text-sky-700 dark:text-sky-300 font-medium flex-wrap">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              {parentDialogue.guideLabel}
            </span>
            <span>•</span>
            <button
              type="button"
              onClick={handleSendToParentPortal}
              className="underline hover:text-primary font-semibold transition-colors inline-flex items-center gap-1"
            >
              {portalSent ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Prompt Sent to Parent Portal!</span>
                </>
              ) : (
                parentDialogue.shareCtaText
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
