"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Search, SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";
import { useCareers, useDebounce } from "@/hooks";
import { ROUTES } from "@/lib/constants";

const categoryOptions = [
  { value: "all", label: "All fields" },
  { value: "Technology", label: "Technology" },
  { value: "Law & Public Policy", label: "Law & Policy" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance & Economics", label: "Finance" },
  { value: "Engineering", label: "Engineering" },
  { value: "Design & Creative Media", label: "Creative Media" },
  { value: "Science & Research", label: "Science & Research" },
  { value: "Entrepreneurship & Innovation", label: "Entrepreneurship" },
];

export function CareerExplorer() {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");

  const debouncedQuery = useDebounce(query, 300);

  const { careers, isLoading, error, refetch } = useCareers({
    search: debouncedQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 md:px-10">
        <header className="max-w-2xl">
          <span className="text-xs font-semibold tracking-wider text-primary">CAREER EXPLORER</span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Explore careers in action.</h1>
          <p className="mt-3 text-muted-foreground">
            Compare the day-to-day work, education routes, and practical trade-offs before you commit to a direction.
          </p>
        </header>

        {/* Search & Filters */}
        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-white p-4 md:flex-row md:items-center">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search careers, skills, or fields (e.g. Software Engineer)"
              className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
            {categoryOptions.map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedCategory(item.value)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === item.value
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading verified careers catalog...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
            <div className="flex items-center justify-center gap-2 font-semibold">
              <AlertCircle className="size-5" />
              <span>Failed to load careers catalog</span>
            </div>
            <p className="mt-1 text-xs text-red-600">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Career Grid */}
        {!isLoading && !error && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {careers.map((career) => (
              <article
                key={career.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-white p-6 shadow-xs transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-indigo-50 text-primary">
                      <BriefcaseBusiness className="size-5" />
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      {career.at_a_glance?.projected_growth || "High Growth"}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-medium text-muted-foreground">
                    {career.category} {career.key_skills?.length > 0 ? `· ${career.key_skills.slice(0, 2).join(" · ")}` : ""}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{career.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{career.tagline}</p>

                  {/* Skills badges */}
                  {career.key_skills && career.key_skills.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {career.key_skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* At a glance box */}
                  <div className="mt-5 grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
                    <span className="text-muted-foreground">
                      Work-Life Dynamics
                      <strong className="mt-1 block line-clamp-1 font-semibold text-foreground">
                        {career.at_a_glance?.work_life_context || "Flexible"}
                      </strong>
                    </span>
                    <span className="text-right text-muted-foreground">
                      Median Pay
                      <strong className="mt-1 block line-clamp-1 font-semibold text-foreground">
                        {career.at_a_glance?.median_pay || "Competitive"}
                      </strong>
                    </span>
                  </div>
                </div>

                <Link
                  href={`${ROUTES.CAREER}/${career.slug}`}
                  className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  Explore this career <ArrowRight className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Empty Search State */}
        {!isLoading && !error && careers.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No careers match that search query. Try broadening your keywords or selecting another category.
          </div>
        )}
      </main>
    </div>
  );
}
