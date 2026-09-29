"use client";

import React from "react";
import { Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import { ExperienceStage, DecisionOption } from "@/types/experience";

interface DecisionArenaProps {
  stage: ExperienceStage;
  selectedOptionId: string;
  onSelectOption: (optionId: string) => void;
  studentRationale: string;
  onChangeRationale: (val: string) => void;
  onResetRationale: () => void;
  onSubmitDecision: () => void;
}

export function DecisionArena({
  stage,
  selectedOptionId,
  onSelectOption,
  studentRationale,
  onChangeRationale,
  onResetRationale,
  onSubmitDecision,
}: DecisionArenaProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col gap-5">
      {/* Investigation Task Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-semibold tracking-wide">
            {stage.taskBadge}
          </span>
          <h2 className="text-sm md:text-base font-semibold text-foreground">
            {stage.taskTitle}
          </h2>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
          {stage.taskConstraint}
        </span>
      </div>

      <p className="text-xs md:text-sm text-foreground leading-relaxed">
        {stage.taskContext}
      </p>

      {/* Interactive Decision Options */}
      <div className="flex flex-col gap-3.5">
        {stage.decisionOptions.map((option: DecisionOption) => {
          const isSelected = option.id === selectedOptionId;
          return (
            <div
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`cursor-pointer rounded-xl p-4 transition-all relative ${
                isSelected
                  ? "border-2 border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                  : "border border-border hover:border-primary/40 bg-card hover:bg-muted/30"
              }`}
            >
              {option.isRecommended && (
                <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded bg-primary text-primary-foreground text-[11px] font-semibold tracking-wide shadow-xs">
                  RECOMMENDED PROCEEDING CHOICE
                </div>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="legal_strategy"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => onSelectOption(option.id)}
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border"
                />

                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span
                      className={`text-xs md:text-sm font-bold ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {option.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        isSelected
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {option.tag}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    <strong className="text-foreground font-semibold">Tactical Trade-off: </strong>
                    {option.tradeoff}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-[11px] flex-wrap">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {option.proLabel}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      {option.conLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Reflection & Rationale Arena */}
      <div className="pt-4 border-t border-border flex flex-col gap-2">
        <label
          htmlFor="student-rationale"
          className="text-xs md:text-sm font-semibold text-foreground flex items-center justify-between flex-wrap gap-2"
        >
          <span>Junior Associate Tactical Rationale</span>
          <span className="text-xs text-muted-foreground font-normal">
            Synthesize legal strategy before court
          </span>
        </label>
        <p className="text-xs text-muted-foreground">
          Explain why prioritizing your chosen exhibit over safe procedural filings aligns with your client&apos;s core goal of an immediate injunction.
        </p>

        <div className="relative">
          <textarea
            id="student-rationale"
            rows={3}
            value={studentRationale}
            onChange={(e) => onChangeRationale(e.target.value)}
            placeholder={stage.studentRationalePlaceholder}
            className="w-full rounded-lg border border-border bg-muted/30 dark:bg-muted/10 p-3 text-xs md:text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
          />
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[11px] text-muted-foreground bg-background/90 backdrop-blur-xs px-2 py-0.5 rounded border border-border">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>{stage.aiSyntaxCheckStatus}</span>
          </div>
        </div>
      </div>

      {/* Action Submission Row */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={onResetRationale}
          className="text-muted-foreground hover:text-foreground text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Re-examine Full Case Notes</span>
        </button>

        <button
          type="button"
          onClick={onSubmitDecision}
          className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-semibold transition-all shadow-sm flex items-center gap-2 active:scale-[0.99]"
        >
          <span>Submit Tactical Decision & Observe Consequence</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
