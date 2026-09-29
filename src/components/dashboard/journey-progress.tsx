"use client";

import { Compass, Gamepad2, GitFork } from "lucide-react";

interface JourneyProgressProps {
  careersExplored?: number;
  experiencesCompleted?: number;
  pathwaysCompared?: number;
}

export function JourneyProgress({
  careersExplored = 4,
  experiencesCompleted = 2,
  pathwaysCompared = 3,
}: JourneyProgressProps) {
  const STATS = [
    {
      label: "Careers Explored",
      value: careersExplored,
      icon: Compass,
      iconColor: "bg-indigo-50 text-primary",
      description: "Disciplines researched & reviewed",
    },
    {
      label: "Experiences Completed",
      value: experiencesCompleted,
      icon: Gamepad2,
      iconColor: "bg-emerald-50 text-emerald-700",
      description: "Interactive simulations tested",
    },
    {
      label: "Pathways Compared",
      value: pathwaysCompared,
      icon: GitFork,
      iconColor: "bg-sky-50 text-sky-700",
      description: "Education routes & cost scenarios",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Your Journey
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Exploration milestones and completed simulations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-xs hover:border-slate-300 transition-all duration-150"
            >
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${stat.iconColor}`}>
                <Icon className="size-6" />
              </div>

              <div>
                <div className="text-2xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
