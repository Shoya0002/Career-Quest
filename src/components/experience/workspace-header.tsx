"use client";

import React from "react";
import { Clock } from "lucide-react";
import { CaseDossier, ExperienceStage } from "@/types/experience";

interface WorkspaceHeaderProps {
  careerCategory: string;
  dossier: CaseDossier;
  currentStage: ExperienceStage;
}

export function WorkspaceHeader({
  careerCategory,
  dossier,
  currentStage,
}: WorkspaceHeaderProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      {/* Left Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            CAREER EXPERIENCE LAB · {careerCategory}
          </span>
          <span className="text-muted-foreground/40 font-medium hidden sm:inline">|</span>
          <span className="text-xs text-muted-foreground">
            Role: <strong className="text-foreground font-medium">{dossier.role}</strong>
          </span>
          <span className="text-muted-foreground/40 font-medium hidden sm:inline">|</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 text-xs font-medium flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {dossier.urgencyNotice}
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {dossier.title}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          {dossier.court}
        </p>
      </div>

      {/* Right Stepper Progress Display */}
      <div className="flex flex-col gap-2 min-w-[280px] bg-muted/40 dark:bg-muted/20 p-3.5 rounded-lg border border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">{currentStage.stageTitle}</span>
          <span className="text-primary font-bold">{currentStage.progressPercent}% Complete</span>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${currentStage.progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-muted-foreground gap-1">
          {currentStage.stagesList.map((stg) => (
            <span
              key={stg.number}
              className={
                stg.status === "active"
                  ? "text-primary font-semibold"
                  : stg.status === "done"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }
            >
              {stg.title} {stg.status === "done" ? "(Done)" : stg.status === "active" ? "(Active)" : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
