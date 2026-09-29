"use client";

import React, { useState } from "react";
import {
  Scale,
  Terminal,
  Palette,
  Stethoscope,
  TrendingUp,
  Bookmark,
  Users,
  Check,
} from "lucide-react";
import { CareerExperienceTrack } from "@/types/experience";

interface CareerSwitcherProps {
  tracks: CareerExperienceTrack[];
  activeTrackId: string;
  onSelectTrack: (trackId: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Scale: <Scale className="h-4 w-4" />,
  Terminal: <Terminal className="h-4 w-4" />,
  Palette: <Palette className="h-4 w-4" />,
  Stethoscope: <Stethoscope className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
};

export function CareerSwitcher({
  tracks,
  activeTrackId,
  onSelectTrack,
}: CareerSwitcherProps) {
  const [saved, setSaved] = useState(false);
  const [coViewOpen, setCoViewOpen] = useState(false);

  const handleSaveSession = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCoView = () => {
    setCoViewOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-border/60">
        {/* Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {tracks.map((track) => {
            const isActive = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => onSelectTrack(track.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-border"
                }`}
              >
                <span className={isActive ? "text-primary-foreground" : "text-sky-600 dark:text-sky-400"}>
                  {(track.iconName && ICON_MAP[track.iconName]) || <Scale className="h-4 w-4" />}
                </span>
                <span>
                  {track.name}{" "}
                  <span className={isActive ? "text-primary-foreground/80 font-normal" : "text-muted-foreground font-normal"}>
                    ({track.sublabel})
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Session Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs md:text-sm font-medium hover:bg-muted/60 transition-colors"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Session Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span>Save Session & Notes</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCoView}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs md:text-sm font-medium transition-colors ${
              coViewOpen
                ? "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"
                : "border-sky-200 dark:border-sky-800 bg-card text-sky-600 dark:text-sky-400 hover:bg-muted/60"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{coViewOpen ? "Co-View Active" : "Counselor/Parent Co-View"}</span>
          </button>
        </div>
      </div>

      {coViewOpen && (
        <div className="p-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg text-xs text-sky-800 dark:text-sky-200 flex items-center justify-between">
          <span>
            <strong>Co-View Link Active:</strong> Counselors and parents with session code <code className="font-mono bg-sky-100 dark:bg-sky-900 px-1 py-0.5 rounded">CQ-LAW-408</code> can observe simulated legal triage in real-time.
          </span>
          <button
            type="button"
            onClick={() => setCoViewOpen(false)}
            className="text-sky-600 hover:text-sky-900 dark:hover:text-sky-100 font-semibold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
