"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Coins,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Scale,
  Loader2,
  CheckCircle2,
  ArrowRightLeft,
  GraduationCap,
  Building2,
  TrendingUp,
} from "lucide-react";
import { useWhatIf, useFundingAnalysis, useCareerComparison } from "@/hooks";
import { ROUTES } from "@/lib/constants";

export function WhatIfWorkspace() {
  const [budget, setBudget] = React.useState<number>(200000);
  const [educationPath, setEducationPath] = React.useState<string>("btech");
  const [location, setLocation] = React.useState<string>("India");
  const [studyAbroad, setStudyAbroad] = React.useState<boolean>(false);

  const { result: whatIfResult, isLoading: isSimulating, error: whatIfError, runSimulation } = useWhatIf("software-engineer");
  const { analysis: fundingResult, isLoading: isAnalyzingFunding, error: fundingError, analyze: runFundingAnalysis } = useFundingAnalysis();

  // Run initial simulation on mount
  React.useEffect(() => {
    runSimulation({
      annual_budget: budget,
      education_path: educationPath,
      location,
      study_abroad: studyAbroad,
    });
  }, []);

  const handleRecalculate = () => {
    runSimulation({
      annual_budget: budget,
      education_path: educationPath,
      location,
      study_abroad: studyAbroad,
    });
  };

  const handleRunFunding = () => {
    runFundingAnalysis({
      career_slug: "software-engineer",
      education_path: educationPath,
      annual_budget: budget,
      currency: "INR",
      location,
      query: `What funding options can help me pursue software engineering in ${location} with an annual budget of ₹${budget.toLocaleString()}?`,
      debug: true,
    });
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-10">
      <header className="max-w-3xl">
        <span className="text-xs font-semibold tracking-wider text-primary">WHAT-IF CAREER SIMULATOR</span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Explore Constraints & Pathways
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Adjust personal and financial constraints to see how pathways adapt in real-time. CareerQuest exposes transparent trade-offs without making prescriptive recommendations.
        </p>
      </header>

      <section className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
        {/* Left: Input Constraints Panel */}
        <aside className="rounded-2xl border border-border bg-white p-6 shadow-xs h-fit space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" /> Scenario Constraints
            </h2>
            <span className="text-xs text-muted-foreground">Software Engineer</span>
          </div>

          {/* Budget Constraint */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Annual Education Budget</label>
              <span className="text-xs font-extrabold text-primary">₹{budget.toLocaleString()} / year</span>
            </div>
            <input
              type="range"
              min={50000}
              max={1500000}
              step={25000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>₹50K</span>
              <span>₹2 Lakh (Demo)</span>
              <span>₹5 Lakh</span>
              <span>₹15 Lakh+</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Quick Budget Presets</span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "₹2 Lakh", val: 200000 },
                { label: "₹3.5 Lakh", val: 350000 },
                { label: "₹5 Lakh", val: 500000 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setBudget(p.val)}
                  className={`rounded-lg py-1.5 text-xs font-medium border transition-colors ${
                    budget === p.val
                      ? "bg-primary text-white border-primary"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Education Pathway Selector */}
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">Target Education Track</label>
            <select
              value={educationPath}
              onChange={(e) => setEducationPath(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs outline-none focus:border-primary"
            >
              <option value="btech">B.Tech / B.E. in Computer Science (4 Years)</option>
              <option value="bsc">B.Sc in Computer Science (3 Years)</option>
              <option value="bootcamp">Accelerated Coding Bootcamp & Apprenticeship</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">Study Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs outline-none focus:border-primary"
            >
              <option value="India">India (Domestic Campuses)</option>
              <option value="Abroad">Global / International (US / UK / Singapore)</option>
            </select>
          </div>

          {/* Study Abroad Checkbox */}
          <label className="flex items-center justify-between rounded-xl border border-border p-3 text-xs cursor-pointer hover:bg-slate-50">
            <div>
              <span className="font-bold text-slate-900 block">Include Global Study Abroad</span>
              <span className="text-[11px] text-muted-foreground">Evaluate international tuition rates</span>
            </div>
            <input
              type="checkbox"
              checked={studyAbroad}
              onChange={(e) => setStudyAbroad(e.target.checked)}
              className="size-4 accent-primary"
            />
          </label>

          <button
            onClick={handleRecalculate}
            disabled={isSimulating}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs md:text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Recalculating Pathways...
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Recalculate What-If Pathway
              </>
            )}
          </button>
        </aside>

        {/* Right: Results Display */}
        <div className="space-y-6">
          {whatIfError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{whatIfError}</span>
            </div>
          )}

          {/* Summary Banner from Backend */}
          {whatIfResult && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Recalculation Summary</span>
              <p className="mt-1.5 text-xs md:text-sm font-medium text-slate-800 leading-relaxed">
                {whatIfResult.summary}
              </p>
            </div>
          )}

          {/* Categorized Pathways */}
          {whatIfResult?.pathways && (
            <div className="space-y-4">
              {/* Requires Funding */}
              {whatIfResult.pathways.requires_funding.length > 0 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
                  <div className="flex items-center gap-2 border-b border-amber-200/60 pb-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <h3 className="text-xs md:text-sm font-bold text-amber-950">
                      Requires Funding Assistance ({whatIfResult.pathways.requires_funding.length})
                    </h3>
                  </div>
                  <div className="mt-3 space-y-3">
                    {whatIfResult.pathways.requires_funding.map((pw) => (
                      <div key={pw.id} className="rounded-xl border border-amber-200 bg-white p-4 shadow-2xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs md:text-sm font-bold text-slate-900">{pw.title}</h4>
                            <p className="mt-1 text-xs text-muted-foreground font-medium">
                              Estimated Cost: {pw.cost_label} · Duration: {pw.estimated_duration_years} Years
                            </p>
                          </div>
                          <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                            Budget Gap Identified
                          </span>
                        </div>

                        {/* Pathway Milestone Nodes */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {pw.nodes.map((n) => (
                            <span key={n.id} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700">
                              {n.data.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available within budget */}
              {whatIfResult.pathways.available.length > 0 && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
                  <div className="flex items-center gap-2 border-b border-emerald-200/60 pb-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <h3 className="text-xs md:text-sm font-bold text-emerald-950">
                      Directly Available within Budget ({whatIfResult.pathways.available.length})
                    </h3>
                  </div>
                  <div className="mt-3 space-y-3">
                    {whatIfResult.pathways.available.map((pw) => (
                      <div key={pw.id} className="rounded-xl border border-emerald-200 bg-white p-4 shadow-2xs">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs md:text-sm font-bold text-slate-900">{pw.title}</h4>
                            <p className="mt-1 text-xs text-muted-foreground font-medium">
                              Estimated Cost: {pw.cost_label} · Duration: {pw.estimated_duration_years} Years
                            </p>
                          </div>
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                            100% Budget Match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected Alternative Pathways */}
              {whatIfResult.pathways.affected.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-3">
                    Alternative Pathway Tracks ({whatIfResult.pathways.affected.length})
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {whatIfResult.pathways.affected.map((pw) => (
                      <div key={pw.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                        <span className="font-bold text-slate-900">{pw.title}</span>
                        <p className="mt-1 text-slate-600 font-medium">Est. Cost: {pw.cost_label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explanation Changes from Backend */}
          {whatIfResult?.changes && whatIfResult.changes.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
              <h3 className="text-xs md:text-sm font-bold text-slate-900">Trade-Off Analysis & Explanations</h3>
              {whatIfResult.changes.map((ch, idx) => (
                <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-2">
                  <p className="text-slate-800 font-medium">{ch.reason}</p>
                  {ch.suggested_actions && ch.suggested_actions.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="font-bold text-primary block mb-1">Recommended Pathway Actions:</span>
                      <ul className="space-y-1 text-slate-600">
                        {ch.suggested_actions.map((act, i) => (
                          <li key={i} className="flex gap-1.5 items-center">
                            <CheckCircle2 className="size-3 text-primary shrink-0" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Funding Analysis Trigger */}
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">PHASE 4 · FUNDING INTELLIGENCE</span>
              <h3 className="mt-1 text-base font-bold text-slate-900">
                Need Funding Support for your Target Degree?
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Run the multi-agent AI validation pipeline to discover scholarships, education loans, and institutional aid.
              </p>
            </div>
            <button
              onClick={handleRunFunding}
              disabled={isAnalyzingFunding}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {isAnalyzingFunding ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Analyzing Funding...
                </>
              ) : (
                <>
                  <Coins className="size-4" /> Analyze Funding Options <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>

          {/* Funding Results Display */}
          {fundingResult && (
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    Validated Funding Pathways
                  </span>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    Grounded Financial Options for {fundingResult.career.title}
                  </h3>
                </div>
                {fundingResult.trace && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    <span>Career Agent ✓</span> · <span>Funding Agent ✓</span> · <span>Validator ✓</span>
                  </div>
                )}
              </div>

              {/* Funding Options List */}
              <div className="space-y-4">
                {fundingResult.options.map((opt) => (
                  <div key={opt.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{opt.name}</span>
                          <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                            {opt.type.replace("_", " ")}
                          </span>
                        </div>
                        <p className="mt-0.5 text-muted-foreground">{opt.provider}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                        {opt.amount}
                      </span>
                    </div>

                    <p className="text-slate-700">
                      <strong>Relevance:</strong> {opt.why_relevant}
                    </p>
                    <p className="text-slate-700">
                      <strong>Eligibility:</strong> {opt.eligibility}
                    </p>

                    {/* Source Verification Badge */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <ShieldCheck className="size-3.5 text-primary" />
                        <span>
                          Source: <strong>{opt.source.name}</strong>{" "}
                          {opt.source.is_mock && <span className="text-amber-700 font-semibold">[Prototype Data]</span>}
                        </span>
                      </span>
                      {opt.source.url && (
                        <a
                          href={opt.source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary font-bold hover:underline inline-flex items-center gap-1"
                        >
                          Verify Source <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-muted-foreground leading-relaxed italic border-t border-slate-100 pt-3">
                {fundingResult.disclaimer}
              </p>

              {/* Next Step in Demo: Decision Matrix CTA */}
              <div className="flex justify-end pt-2">
                <Link
                  href={ROUTES.JOURNEY}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-xs md:text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <Scale className="size-4" /> Compare Careers in Decision Matrix <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export function JourneyWorkspace() {
  const [careerA, setCareerA] = React.useState<string>("software-engineer");
  const [careerB, setCareerB] = React.useState<string>("lawyer");

  const { comparison, isLoading, error, refetch } = useCareerComparison(careerA, careerB);

  const handleSwap = () => {
    setCareerA(careerB);
    setCareerB(careerA);
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-semibold tracking-wider text-primary">DECISION MATRIX</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Side-by-Side Career Trade-Offs
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Compare careers across 12 structured dimensions. CareerQuest does not declare winners or rank careers—we provide transparent factual data so students and parents can evaluate trade-offs together.
          </p>
        </div>
        <Link
          href={ROUTES.WHAT_IF}
          className="inline-flex h-10 items-center gap-2 self-start rounded-lg border border-slate-300 bg-white px-4 text-xs font-bold text-slate-800 hover:bg-slate-50 sm:self-auto"
        >
          <SlidersHorizontal className="size-4" /> Adjust What-If Constraints
        </Link>
      </header>

      {/* Career Selectors Header */}
      <section className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 block mb-1">Career A</label>
            <select
              value={careerA}
              onChange={(e) => setCareerA(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-slate-50 px-3 text-sm font-bold text-slate-900"
            >
              <option value="software-engineer">Software Engineer</option>
              <option value="lawyer">Lawyer</option>
              <option value="medical-doctor">Physician & Medical Doctor</option>
              <option value="startup-founder">Startup Founder / Entrepreneur</option>
            </select>
          </div>

          <button
            onClick={handleSwap}
            title="Swap careers"
            className="flex size-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          >
            <ArrowRightLeft className="size-4" />
          </button>

          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-500 block mb-1">Career B</label>
            <select
              value={careerB}
              onChange={(e) => setCareerB(e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-slate-50 px-3 text-sm font-bold text-slate-900"
            >
              <option value="lawyer">Lawyer</option>
              <option value="software-engineer">Software Engineer</option>
              <option value="medical-doctor">Physician & Medical Doctor</option>
              <option value="startup-founder">Startup Founder / Entrepreneur</option>
            </select>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-12 flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Building side-by-side Decision Matrix...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
          <AlertCircle className="mx-auto size-6 text-red-600" />
          <p className="mt-2 text-xs font-semibold">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
          >
            Retry Comparison
          </button>
        </div>
      )}

      {/* Comparison Table */}
      {!isLoading && !error && comparison && (
        <div className="mt-8 space-y-8">
          {/* Key Trade-Off Summaries */}
          {comparison.trade_offs && comparison.trade_offs.length > 0 && (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Executive Trade-Off Summary
              </span>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {comparison.trade_offs.map((t, idx) => (
                  <div key={idx} className="rounded-xl border border-indigo-100 bg-white p-4 text-xs">
                    <span className="font-bold text-slate-900 block mb-1">{t.label}</span>
                    <p className="text-slate-600 leading-relaxed">{t.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full 12 Dimensions Grid */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border text-slate-500">
                  <th className="pb-4 font-bold w-1/4">Comparison Dimension</th>
                  <th className="pb-4 font-bold w-[37.5%] text-slate-900">
                    {comparison.career_a.title} ({comparison.career_a.category})
                  </th>
                  <th className="pb-4 font-bold w-[37.5%] text-slate-900">
                    {comparison.career_b.title} ({comparison.career_b.category})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparison.dimensions.map((dim) => (
                  <tr key={dim.key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-bold text-slate-900 align-top pr-4">
                      {dim.label}
                    </td>
                    <td className="py-4 text-slate-700 align-top pr-4 text-xs">
                      {dim.career_a.value && (
                        <strong className="block font-semibold text-slate-900 mb-1">
                          {dim.career_a.value}
                        </strong>
                      )}
                      <ul className="space-y-1 text-slate-600">
                        {dim.career_a.details?.slice(0, 4).map((d, i) => (
                          <li key={i} className="flex gap-1.5 items-start">
                            <span className="text-primary font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 text-slate-700 align-top text-xs">
                      {dim.career_b.value && (
                        <strong className="block font-semibold text-slate-900 mb-1">
                          {dim.career_b.value}
                        </strong>
                      )}
                      <ul className="space-y-1 text-slate-600">
                        {dim.career_b.details?.slice(0, 4).map((d, i) => (
                          <li key={i} className="flex gap-1.5 items-start">
                            <span className="text-primary font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Prototype Source Metadata & Standard Disclaimer */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>
                Source: <strong>{comparison.source.name}</strong>{" "}
                {comparison.source.is_mock && <span className="font-bold text-amber-700">[Prototype Dataset]</span>}
              </span>
            </span>
            <p className="text-[11px] italic max-w-xl text-right sm:text-right">
              {comparison.disclaimer}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
