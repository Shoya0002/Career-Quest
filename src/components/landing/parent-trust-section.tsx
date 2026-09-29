"use client";

import Link from "next/link";
import {
  Users,
  Eye,
  Wallet,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export function ParentTrustSection() {
  return (
    <section id="parent-partnership" className="mx-auto max-w-7xl px-6 md:px-10 py-16">
      <div className="rounded-2xl border border-[#BAE6FD] bg-gradient-to-r from-white via-white to-[#F0F9FF] p-8 md:p-12 shadow-xs">
        {/* Header Content */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold mb-3">
            <Users className="size-4" />
            <span>Parent-Student Partnership</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for Students and Parents Together
          </h2>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Career conversations at the dining table can be fraught with anxiety.
            We bridge the generational gap with factual clarity, grounded
            educational expenses, and realistic timeline expectations.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-border">
          {/* Pillar 1 */}
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
              <Eye className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                No Algorithmic Black Boxes
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every career recommendation links openly to verifiable industry data
                sources and labor market statistics.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
              <Wallet className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                Clear Financial Estimates
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Transparent college fee calculators including living expenditures and
                realistic financial aid metrics.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Clock className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">
                Realistic Education Timelines
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete visibility into entrance examinations, internship
                horizons, licensing requirements, and postgraduate durations.
              </p>
            </div>
          </div>
        </div>

        {/* Counselor Guidance Callout Box */}
        <div className="mt-8 rounded-lg bg-[#F0F9FF] border border-[#BAE6FD] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <Sparkles className="size-4" />
            </div>
            <span className="text-xs sm:text-sm text-foreground">
              <strong className="font-semibold">Counselor Guided Note:</strong>{" "}
              Export structured discussion templates for parent-student decision
              reviews directly from the portal.
            </span>
          </div>

          <Link
            href={ROUTES.JOURNEY}
            className="text-sky-700 hover:text-sky-800 text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1 self-start sm:self-auto shrink-0"
          >
            <span>View Decision Matrix</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
