"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

interface DashboardHeaderProps {
  heading?: string;
  subheading?: string;
  supportingText?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function DashboardHeader({
  heading = "Good afternoon.",
  subheading = "Let's explore what comes next.",
  supportingText = "Discover careers, experience different professions, and understand the paths that can lead you there.",
  ctaText = "Explore Careers",
  ctaHref = ROUTES.EXPLORE,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-border">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="flex size-6 items-center justify-center rounded-md bg-indigo-50 text-primary">
            <Compass className="size-3.5" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Student Exploration Hub
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {heading}{" "}
          <span className="text-primary font-bold block sm:inline">
            {subheading}
          </span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          {supportingText}
        </p>
      </div>

      <div className="self-start sm:self-center shrink-0">
        <Link
          href={ctaHref}
          className={buttonVariants({
            size: "lg",
            className:
              "h-11 px-5 rounded-lg bg-primary hover:bg-[#4338CA] text-white font-semibold text-sm shadow-xs transition-all duration-150 active:scale-[0.99] gap-2",
          })}
        >
          <span>{ctaText}</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
