"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Server,
  Activity,
  Loader2,
  Award,
} from "lucide-react";
import { useExperienceSession } from "@/hooks";
import { ROUTES } from "@/lib/constants";

export function ExperienceWorkspace() {
  const {
    experience,
    sessionId,
    currentScenario,
    outcome,
    result,
    totalScore,
    isLoadingMetadata,
    isStartingSession,
    isSubmittingDecision,
    error,
    startSession,
    startDemoMode,
    submitDecision,
    nextScenario,
    resetSession,
    refetchMetadata,
  } = useExperienceSession("production-incident");

  const [selectedDecisionId, setSelectedDecisionId] = useState<string>("");
  const [rationale, setRationale] = useState<string>("");
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<number>(0);

  // Set default selected option when scenario changes
  React.useEffect(() => {
    if (currentScenario?.decisions && currentScenario.decisions.length > 0) {
      setSelectedDecisionId(currentScenario.decisions[0].id);
      setRationale("");
      setActiveEvidenceTab(0);
    }
  }, [currentScenario?.id]);

  const handleDecisionSubmit = () => {
    if (!selectedDecisionId) return;
    submitDecision(selectedDecisionId, rationale);
  };

  if (isLoadingMetadata) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Initializing Experience Lab environment...</p>
        </div>
      </main>
    );
  }

  if (error && !experience) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="size-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">Experience Simulation Unavailable</h1>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{error}</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => refetchMetadata()}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              <RotateCcw className="size-3.5" /> Retry Connection
            </button>
            <button
              onClick={() => startDemoMode()}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Sparkles className="size-3.5 text-primary" /> Launch Sandbox Mode
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Pre-session Start Screen (Briefing)
  if (!sessionId && !result) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-12 md:px-10">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              HERO SIMULATION LAB · {experience?.category || "TECHNOLOGY"}
            </span>
            <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800">
              Live Production On-Call
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {experience?.title || "Software Engineer: Production Incident Response"}
          </h1>
          <p className="mt-2 text-base font-medium text-slate-600">
            {experience?.tagline ||
              "Triage live telemetry, isolate root causes, and mitigate a critical production incident under pressure."}
          </p>

          <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
            <div>
              <span className="text-xs text-muted-foreground">Assigned Role</span>
              <strong className="mt-1 block text-sm font-semibold text-slate-900">
                {experience?.role_title || "Senior SRE / On-Call Lead"}
              </strong>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Organization</span>
              <strong className="mt-1 block text-sm font-semibold text-slate-900">
                {experience?.organization || "Global CloudCommerce"}
              </strong>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Simulation Scenarios</span>
              <strong className="mt-1 block text-sm font-semibold text-slate-900">
                {experience?.total_scenarios || (experience as any)?.scenarios_count || 3} Escalation Stages
              </strong>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
            <h2 className="text-sm font-bold text-indigo-950">Incident Briefing & Rules of Engagement</h2>
            <p className="text-xs leading-relaxed text-slate-700 md:text-sm">
              {experience?.briefing ||
                experience?.description ||
                "A critical payment microservice anomaly has triggered customer-facing transaction timeouts during peak load. You will analyze telemetry, triage competing hypotheses, and make high-stakes operational engineering decisions."}
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
            <Link href={ROUTES.EXPLORE} className="text-xs font-medium text-slate-600 hover:text-primary">
              ← Return to Career Explorer
            </Link>
            <button
              onClick={() => startSession()}
              disabled={isStartingSession}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
            >
              {isStartingSession ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Initializing Live Sandbox...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Start Experience Lab <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Simulation Finished / Results Screen
  if (result) {
    const finalScore = result.final_score ?? (result as any).total_score ?? totalScore;
    const breakdown = {
      problem_solving:
        result.performance_breakdown?.problem_solving ??
        (result.performance_breakdown as any)?.reasoning_score ??
        90,
      technical_accuracy:
        result.performance_breakdown?.technical_accuracy ??
        (result.performance_breakdown as any)?.technical_score ??
        92,
      collaboration_communication:
        result.performance_breakdown?.collaboration_communication ??
        (result.performance_breakdown as any)?.communication_score ??
        85,
      stress_management:
        result.performance_breakdown?.stress_management ??
        (result.performance_breakdown as any)?.prioritization_score ??
        88,
    };
    const decisionHistory = (result.decision_history ?? (result as any).decisions_log ?? []).map(
      (log: any, idx: number) => ({
        scenario_order: log.scenario_order ?? idx + 1,
        scenario_title: log.scenario_title ?? `Stage ${idx + 1}`,
        selected_option_label: log.selected_option_label ?? String.fromCharCode(65 + (idx % 3)),
        decision_title: log.decision_title ?? "",
        consequence_text: log.consequence_text ?? log.consequence ?? "",
        score_awarded: log.score_awarded ?? log.score_delta ?? 25,
      })
    );
    const reflectionPrompts = (result.reflection_prompts ?? []).map((p: any) =>
      typeof p === "string" ? p : p.prompt ?? ""
    );

    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 md:px-10">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
                Incident Response Completed
              </span>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Simulation Performance Evaluation
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">Session ID: {result.session_id}</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-3">
              <Award className="size-8 text-emerald-600" />
              <div>
                <span className="text-xs font-medium text-emerald-700">Cumulative Score</span>
                <div className="text-2xl font-extrabold text-emerald-900">{finalScore} / 100</div>
              </div>
            </div>
          </div>

          {/* Competency Breakdown Cards */}
          <div className="mt-6">
            <h2 className="text-sm font-bold text-slate-900">Observed Engineering Tendencies</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs text-muted-foreground">Problem Solving</span>
                <div className="mt-1 text-lg font-bold text-slate-900">{breakdown.problem_solving}%</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs text-muted-foreground">Technical Accuracy</span>
                <div className="mt-1 text-lg font-bold text-slate-900">{breakdown.technical_accuracy}%</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs text-muted-foreground">Collaboration</span>
                <div className="mt-1 text-lg font-bold text-slate-900">{breakdown.collaboration_communication}%</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs text-muted-foreground">Stress Management</span>
                <div className="mt-1 text-lg font-bold text-slate-900">{breakdown.stress_management}%</div>
              </div>
            </div>
          </div>

          {/* Decision Timeline Log */}
          <div className="mt-8">
            <h2 className="text-sm font-bold text-slate-900">Incident Triage Decision Log</h2>
            <div className="mt-3 space-y-3">
              {decisionHistory.map((log: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>
                      Stage {log.scenario_order}: {log.scenario_title}
                    </span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800">
                      +{log.score_awarded} pts
                    </span>
                  </div>
                  <p className="mt-1.5 text-slate-700">
                    <strong>Selected Option ({log.selected_option_label}):</strong> {log.decision_title}
                  </p>
                  <p className="mt-1 text-muted-foreground">{log.consequence_text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reflection Prompts for Student & Parent Discussion */}
          {reflectionPrompts.length > 0 && (
            <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/60 p-5">
              <h2 className="text-sm font-bold text-indigo-950">Experiential Reflections & Discussion Points</h2>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-700">
                {reflectionPrompts.map((prompt: string, i: number) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Demo Navigation Flow to What-If */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
            <button
              onClick={() => resetSession()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary"
            >
              <RotateCcw className="size-3.5" /> Re-run Simulation
            </button>
            <Link
              href={`${ROUTES.WHAT_IF}?career=software-engineer`}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-xs transition hover:bg-indigo-700"
            >
              Continue to What-If Career Simulator <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Active Simulation Arena (3-Column Workspace)
  const currentScenarioNumber =
    currentScenario?.sequence_order ?? (currentScenario as any)?.sequence ?? 1;
  const totalScenarios =
    experience?.total_scenarios ?? (experience as any)?.scenarios_count ?? 3;
  const progressPercent = Math.round((currentScenarioNumber / totalScenarios) * 100);

  const situationBrief =
    currentScenario?.situation_brief ??
    (currentScenario as any)?.situation ??
    (currentScenario as any)?.description ??
    "";

  const evidenceItems =
    currentScenario?.evidence_items ?? (currentScenario as any)?.evidence ?? [];
  const decisions = currentScenario?.decisions ?? [];

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-10 py-6 flex flex-col gap-6">
      {/* 1. Header with Live Metric Tracker */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-primary text-xs font-semibold tracking-wide uppercase">
              {experience?.category || "TECHNOLOGY"} · INCIDENT LAB
            </span>
            <span className="text-muted-foreground/40 font-medium hidden sm:inline">|</span>
            <span className="text-xs text-muted-foreground">
              Role: <strong className="text-foreground font-medium">{experience?.role_title || experience?.role}</strong>
            </span>
            <span className="text-muted-foreground/40 font-medium hidden sm:inline">|</span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-xs font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Active Incident
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            {experience?.title}
          </h1>
          <p className="text-xs text-muted-foreground">{experience?.organization}</p>
        </div>

        {/* Progress and Live Score */}
        <div className="flex flex-col gap-2 min-w-[280px] bg-slate-50 p-3.5 rounded-lg border border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              Stage {currentScenarioNumber} of {totalScenarios}
            </span>
            <span className="text-primary font-bold">Score: {totalScore} pts</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-muted-foreground">
            <span>Progress: {progressPercent}%</span>
            <span>Live Telemetry Active</span>
          </div>
        </div>
      </div>

      {/* 2. Error Notification if any */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* 3. 3-Column Professional Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Situation Dossier & Parameters (3 cols) */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Server className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-slate-900">Incident Dossier</h2>
            </div>
            <div className="mt-3 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">Scenario Stage</span>
                <p className="font-semibold text-slate-900">{currentScenario?.title}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Operational Brief</span>
                <p className="mt-1 leading-relaxed text-slate-700">{situationBrief}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <span className="font-semibold text-slate-900">Service SLA:</span>
                <span className="ml-1 text-rose-700 font-bold">Degraded (p99 latency {">"} 4.8s)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Center Column: Decision Arena & Outcome (6 cols) */}
        <section className="lg:col-span-6 flex flex-col gap-5">
          {!outcome ? (
            <div className="bg-white rounded-xl border border-border p-5 shadow-xs flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-border flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary text-white text-xs font-semibold">
                    DECISION POINT
                  </span>
                  <h2 className="text-sm md:text-base font-bold text-foreground">
                    {currentScenario?.title}
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                  Select 1 Strategy
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                {situationBrief}
              </p>

              {/* Decision Options Radio List */}
              <div className="flex flex-col gap-3">
                {decisions.map((decision, idx) => {
                  const isSelected = decision.id === selectedDecisionId;
                  const optionLabel = decision.option_label || String.fromCharCode(65 + idx);

                  return (
                    <div
                      key={decision.id}
                      onClick={() => setSelectedDecisionId(decision.id)}
                      className={`cursor-pointer rounded-xl p-4 transition-all relative ${
                        isSelected
                          ? "border-2 border-primary bg-indigo-50/50 shadow-xs"
                          : "border border-border hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isSelected ? "bg-primary text-white" : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {optionLabel}
                          </span>
                          <h3 className="text-xs md:text-sm font-bold text-slate-900">
                            {decision.title}
                          </h3>
                        </div>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 pl-8">
                        {decision.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Rationale Input */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Engineering Rationale (Optional)
                </label>
                <textarea
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Explain your technical reasoning or diagnostic assumptions..."
                  rows={2}
                  className="w-full rounded-lg border border-input p-2.5 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleDecisionSubmit}
                  disabled={!selectedDecisionId || isSubmittingDecision}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs md:text-sm font-bold text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmittingDecision ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Evaluating with Backend...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" /> Lock & Submit Decision <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Outcome & Consequence Review */
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-emerald-200 p-6 shadow-xs flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  <h2 className="text-sm md:text-base font-bold text-emerald-950">
                    {outcome.outcome_headline || (outcome as any)?.outcome?.title || "Decision Evaluated"}
                  </h2>
                </div>
                {(outcome.performance_delta?.score_delta !== undefined ||
                  (outcome as any)?.performance?.score_delta !== undefined) && (
                  <span className="rounded bg-emerald-100 px-2.5 py-1 text-xs font-extrabold text-emerald-800">
                    +{outcome.performance_delta?.score_delta ?? (outcome as any)?.performance?.score_delta} pts
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                {outcome.consequence_text ||
                  (outcome as any)?.outcome?.consequence ||
                  (outcome as any)?.outcome?.description}
              </p>

              {(outcome.reflection_prompt || (outcome as any)?.outcome?.feedback) && (
                <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 p-3.5 text-xs text-slate-800">
                  <strong className="text-primary font-semibold block mb-1">Mentor Reflection:</strong>
                  {outcome.reflection_prompt || (outcome as any)?.outcome?.feedback}
                </div>
              )}

              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={nextScenario}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs md:text-sm font-bold text-white shadow-xs transition hover:bg-indigo-700"
                >
                  {outcome.is_final_scenario || (outcome as any)?.is_completed
                    ? "View Comprehensive Performance Result"
                    : "Advance to Next Scenario"}{" "}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Right Column: Live Telemetry & Evidence Inspector (3 cols) */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Activity className="size-4 text-primary" />
              <h2 className="text-sm font-bold text-slate-900">Evidence & Telemetry</h2>
            </div>

            {evidenceItems.length > 0 ? (
              <div className="mt-3">
                {/* Evidence tabs */}
                <div className="flex gap-1 overflow-x-auto pb-2 border-b border-slate-100">
                  {evidenceItems.map((item: any, idx: number) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveEvidenceTab(idx)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        activeEvidenceTab === idx
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                {/* Active Evidence Body */}
                {evidenceItems[activeEvidenceTab] && (
                  <div className="mt-3 space-y-2">
                    <span className="text-[11px] font-bold text-primary uppercase">
                      Type: {evidenceItems[activeEvidenceTab].type}
                    </span>
                    <pre className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-tight whitespace-pre-wrap">
                      {evidenceItems[activeEvidenceTab].full_content ||
                        (evidenceItems[activeEvidenceTab] as any).content ||
                        evidenceItems[activeEvidenceTab].preview_text}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">Telemetry stream active.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
