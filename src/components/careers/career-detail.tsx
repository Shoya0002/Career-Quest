"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  GraduationCap,
  ShieldAlert,
  TrendingUp,
  Briefcase,
  Layers,
  Coins,
  Compass,
  MapPin,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useCareer, useCareerPathway } from "@/hooks";
import { ROUTES } from "@/lib/constants";

export function CareerDetail({ slug }: { slug: string }) {
  const { career, isLoading, error, refetch } = useCareer(slug);
  const { pathway, isLoading: isLoadingPathway } = useCareerPathway(slug);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading career profile from backend...</p>
        </div>
      </main>
    );
  }

  if (error || !career) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-800">
          <AlertCircle className="mx-auto size-8 text-red-600" />
          <h1 className="mt-3 text-2xl font-bold">Career Profile Not Found</h1>
          <p className="mt-2 text-sm text-red-600">
            {error || `Unable to locate career profile for '${slug}'.`}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
            <Link
              href={ROUTES.EXPLORE}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Return to Explorer
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.EXPLORE}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to Career Explorer
        </Link>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Category: {career.category}
        </span>
      </div>

      {/* Hero Header + At a Glance Box */}
      <section className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-primary">
            Explore before deciding
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">{career.title}</h1>
          <p className="mt-3 text-lg font-medium text-slate-700">{career.tagline}</p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            {career.overview}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`${ROUTES.EXPERIENCE}?career=${career.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Sparkles className="size-4" /> Experience this career <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`${ROUTES.WHAT_IF}?career=${career.slug}`}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <SlidersHorizontal className="size-4" /> What-If Simulator
            </Link>
          </div>
        </div>

        {/* At a Glance Card */}
        <aside className="rounded-2xl border border-border bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-foreground">At a glance</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div className="flex justify-between gap-3 border-b border-slate-100 pb-3">
              <dt className="text-muted-foreground">Median pay</dt>
              <dd className="text-right font-semibold text-foreground">{career.at_a_glance.median_pay}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-slate-100 pb-3">
              <dt className="text-muted-foreground">Projected growth</dt>
              <dd className="text-right font-semibold text-emerald-700">{career.at_a_glance.projected_growth}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-slate-100 pb-3">
              <dt className="text-muted-foreground">Work-life context</dt>
              <dd className="max-w-[220px] text-right font-medium text-slate-800">{career.at_a_glance.work_life_context}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Operational stress</dt>
              <dd className="max-w-[220px] text-right font-medium text-slate-800">{career.at_a_glance.stress_context}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {/* 3 Core Overview Cards */}
      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <InfoCard
          title="Daily Responsibilities"
          icon={Clock3}
          items={career.responsibilities || []}
        />
        <InfoCard
          title="Technical & Professional Skills"
          icon={GraduationCap}
          items={[
            ...(career.skills?.technical?.map((s) => `${s.skill_name} (Technical · ${s.importance_score}/10)`) || []),
            ...(career.skills?.professional?.map((s) => `${s.skill_name} (Professional · ${s.importance_score}/10)`) || []),
          ]}
        />
        <InfoCard
          title="Practical Considerations"
          icon={ShieldAlert}
          items={[
            ...(career.practical_considerations?.positive_aspects?.map((p) => `[Advantage] ${p}`) || []),
            ...(career.practical_considerations?.challenges?.map((c) => `[Challenge] ${c}`) || []),
          ]}
        />
      </section>

      {/* Career Progression Pathway Timeline */}
      {career.progression && career.progression.length > 0 && (
        <section className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="text-lg font-bold">Career Progression & Seniority Milestones</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {career.progression.map((step, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-xs font-semibold text-primary">Stage 0{idx + 1} · {step.experience_range}</span>
                <h3 className="mt-1 text-sm font-bold text-slate-900">{step.level_title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.typical_role}</p>
                <div className="mt-3 font-semibold text-xs text-emerald-800">{step.salary_range}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Specializations & Domain Opportunities */}
      {career.specializations && career.specializations.length > 0 && (
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2">
              <Layers className="size-5 text-primary" />
              <h2 className="text-lg font-bold">High-Demand Specializations</h2>
            </div>
            <div className="mt-4 space-y-3">
              {career.specializations.map((spec, idx) => (
                <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{spec.title}</span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-primary">{spec.market_demand}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">{spec.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              <h2 className="text-lg font-bold">Industries & Geographic Hubs</h2>
            </div>
            <div className="mt-4 space-y-3">
              {career.opportunities?.industries?.map((ind, idx) => (
                <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs">
                  <span className="font-semibold text-slate-900">{ind.name}</span>
                  <p className="mt-0.5 text-muted-foreground">{ind.description}</p>
                </div>
              ))}
              {career.opportunities?.geographic_options?.map((geo, idx) => (
                <div key={idx} className="rounded-lg border border-sky-100 bg-sky-50 p-3 text-xs">
                  <span className="font-semibold text-sky-900">{geo.name}</span>
                  <p className="mt-0.5 text-sky-700">{geo.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Typical Education Pathway Graph */}
      {pathway && (
        <section className="mt-10 rounded-2xl border border-sky-200 bg-sky-50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sky-950">Typical Education Pathway Graph</h2>
              <p className="mt-1 text-sm text-sky-800">{pathway.description}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-200">
              {pathway.total_duration_years} Years Typical Duration
            </span>
          </div>

          <div className="mt-6 overflow-x-auto pb-2">
            <div className="flex min-w-[700px] items-center gap-3">
              {pathway.nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  <article className="w-52 shrink-0 rounded-xl border border-sky-200 bg-white p-4 shadow-2xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {node.data?.nodeType || "Milestone"}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-slate-900">{node.data?.title}</h3>
                    {node.data?.subtitle && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{node.data.subtitle}</p>
                    )}
                    {node.data?.durationMonths !== undefined && (
                      <p className="mt-3 text-xs font-medium text-slate-600">
                        Duration: {node.data.durationMonths} months
                      </p>
                    )}
                  </article>
                  {index < pathway.nodes.length - 1 && (
                    <div className="h-0.5 w-8 shrink-0 bg-sky-300" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-sky-200 pt-4">
            <span className="text-xs text-sky-800">
              Estimated Investment: <strong>{pathway.total_estimated_cost}</strong> · Breakeven: ~{pathway.expected_breakeven_years} yrs
            </span>
            <Link
              href={`${ROUTES.WHAT_IF}?career=${career.slug}`}
              className="text-xs font-bold text-primary hover:underline"
            >
              Test Budget & Pathway Alternatives in What-If →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function InfoCard({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
}) {
  return (
    <section className="flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-xs">
      <div>
        <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-primary">
          <Icon className="size-5" />
        </div>
        <h2 className="mt-4 font-bold text-slate-900">{title}</h2>
        <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-600">
          {items.slice(0, 6).map((item, idx) => (
            <li key={idx} className="flex gap-2 items-start">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
