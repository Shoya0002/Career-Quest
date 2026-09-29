"use client";

import React from "react";
import { FolderGit2, CheckCircle2, Lightbulb, Landmark } from "lucide-react";
import { CaseDossier } from "@/types/experience";

interface CaseDossierCardProps {
  dossier: CaseDossier;
}

export function CaseDossierCard({ dossier }: CaseDossierCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Client Dossier Card */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <FolderGit2 className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Client Brief & Dossier</h2>
        </div>

        <div className="flex flex-col gap-3">
          {/* Litigants */}
          {dossier.litigants && dossier.litigants.length > 0 && (
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                Litigants
              </span>
              <div className="p-2.5 mt-1 rounded-lg bg-muted/40 dark:bg-muted/20 border border-border">
                {dossier.litigants.map((litigant, index) => (
                  <React.Fragment key={litigant.name}>
                    {index > 0 && <div className="my-1.5 border-t border-border" />}
                    <p className="text-xs font-semibold text-foreground">{litigant.name}</p>
                    <p className="text-[11px] text-muted-foreground">{litigant.role}</p>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Incident Summary */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Incident Summary
            </span>
            <p className="mt-1 text-xs text-foreground leading-relaxed bg-muted/40 dark:bg-muted/20 p-2.5 rounded-lg border border-border">
              {dossier.incidentSummary}
            </p>
          </div>

          {/* Core Legal Objective */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Core Legal Objective
            </span>
            <div className="mt-1 p-2.5 rounded-lg bg-muted/40 dark:bg-muted/20 border border-border flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground leading-relaxed">
                {dossier.coreObjective}
              </p>
            </div>
          </div>

          {/* Procedural Constraints & Risk */}
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Procedural Constraints & Risk
            </span>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {dossier.proceduralConstraints}
            </p>
          </div>
        </div>

        {/* Real-world Trade-Off Callout */}
        <div className="rounded-lg p-3 bg-sky-50 dark:bg-sky-950/40 border-l-4 border-sky-600 dark:border-sky-400 flex flex-col gap-1">
          <span className="text-xs font-semibold text-sky-800 dark:text-sky-300 flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            Litigation Trade-Off Note
          </span>
          <p className="text-[11px] text-sky-900/80 dark:text-sky-200 leading-relaxed">
            {dossier.tradeoffNote}
          </p>
        </div>
      </div>

      {/* Presiding Judge Profile Card */}
      {dossier.judge && (
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
            <Landmark className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground">{dossier.judge.name}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              {dossier.judge.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
