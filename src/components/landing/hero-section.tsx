"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-10 pt-16 pb-12">
      <div className="mx-auto max-w-3xl text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold border border-[#BAE6FD] mb-6">
          <span className="size-2 rounded-full bg-[#0EA5E9] animate-pulse" />
          <span>Career Exploration Reimagined for Students &amp; Parents</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-foreground leading-[1.15]">
          Don&apos;t just choose a career.{" "}
          <span className="text-primary">Experience it first.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Explore careers, experience what they are really like through guided
          mini-simulations, and understand the real education pathways that get you
          there.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ROUTES.EXPLORE}
            className={buttonVariants({
              size: "lg",
              className:
                "w-full sm:w-auto h-11 px-6 rounded-lg bg-primary hover:bg-[#4338CA] text-white font-semibold text-sm shadow-xs transition-all duration-150 active:scale-[0.99] gap-2",
            })}
          >
            <span>Start Exploring</span>
            <ArrowRight className="size-4" />
          </Link>

          <a
            href="#how-it-works"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "w-full sm:w-auto h-11 px-6 rounded-lg bg-white border-border hover:bg-slate-50 hover:border-slate-300 text-foreground font-semibold text-sm transition-all duration-150 active:scale-[0.99] gap-2",
            })}
          >
            <PlayCircle className="size-4 text-muted-foreground" />
            <span>How It Works</span>
          </a>
        </div>

        {/* Metric micro-strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>120+ Curated Pathways</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Zero Algorithmic Bias</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Designed with Counselors</span>
          </div>
        </div>
      </div>
    </section>
  );
}
