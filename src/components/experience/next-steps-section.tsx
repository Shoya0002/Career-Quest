"use client";

import React from "react";
import Link from "next/link";
import { Terminal, Palette } from "lucide-react";
import { ComplementaryLab } from "@/types/experience";

interface NextStepsSectionProps {
  pathwayCta: {
    label: string;
    href: string;
  };
  complementaryLabs: ComplementaryLab[];
  onSelectLab?: (labId: string) => void;
}

export function NextStepsSection({
  pathwayCta,
  complementaryLabs,
  onSelectLab,
}: NextStepsSectionProps) {
  const getLabIcon = (iconName: string) => {
    switch (iconName) {
      case "Terminal":
        return <Terminal className="h-5 w-5" />;
      case "Palette":
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  return (
    <section className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col gap-5 mb-4">
      {/* Header & Primary Pathway CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Stage Complete
          </span>
          <h2 className="text-lg md:text-xl font-bold text-foreground mt-0.5">
            Experience Complete: Next Step Exploration
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare how this legal workflow connects with academic pathways and alternative analytical disciplines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={pathwayCta.href}
            className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs md:text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm inline-flex items-center gap-2 active:scale-[0.99]"
          >
            <span>{pathwayCta.label}</span>
          </Link>
        </div>
      </div>

      {/* Complementary Career Lab Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
        {complementaryLabs.map((lab) => (
          <div
            key={lab.id}
            className="p-4 rounded-xl border border-border hover:border-primary/40 bg-muted/30 dark:bg-muted/10 hover:bg-muted/50 transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
              {getLabIcon(lab.icon)}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xs md:text-sm font-semibold text-foreground">
                {lab.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lab.description}
              </p>
              {onSelectLab ? (
                <button
                  type="button"
                  onClick={() => onSelectLab(lab.id === "lab-swe" ? "software-engineering" : "product-design")}
                  className="text-primary text-xs font-semibold hover:underline mt-1 inline-flex items-center gap-1 self-start"
                >
                  {lab.ctaText}
                </button>
              ) : (
                <Link
                  href={lab.href || "#"}
                  className="text-primary text-xs font-semibold hover:underline mt-1 inline-flex items-center gap-1 self-start"
                >
                  {lab.ctaText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
