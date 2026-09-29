"use client";

import * as React from "react";
import Link from "next/link";
import {
  Terminal,
  Gavel,
  Palette,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

type DisciplineFilter = "all" | "tech" | "humanities";

const CAREERS = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    discipline: "tech",
    icon: Terminal,
    iconColor: "bg-indigo-50 text-primary",
    badgeLabel: "High Demand · +22%",
    badgeStyle: "bg-emerald-100 text-emerald-800",
    category: "Technology • Problem Solving",
    description:
      "Build digital products and solve real infrastructure challenges. Design fault-tolerant systems, write maintainable code, and collaborate in agile engineering sprints.",
    skills: ["System Architecture", "Algorithmic Logic", "Distributed Cloud"],
    pathwayLabel: "Typical Pathway",
    pathwayValue: "B.S. Computer Science (4 Yrs)",
    payLabel: "Median Early Pay",
    payValue: "$82,000 / yr",
    experienceHref: `${ROUTES.EXPERIENCE}?career=software-engineer`,
  },
  {
    id: "corporate-law",
    title: "Corporate Law",
    discipline: "humanities",
    icon: Gavel,
    iconColor: "bg-sky-50 text-sky-600",
    badgeLabel: "Stable Prestige",
    badgeStyle: "bg-sky-100 text-sky-800",
    category: "Reasoning • Communication",
    description:
      "Analyze cases, advise organizations, and defend rights. Structure contracts, conduct corporate diligence, and navigate regulatory complexities across global markets.",
    skills: ["Legal Research", "Negotiation", "Contract Writing"],
    pathwayLabel: "Typical Pathway",
    pathwayValue: "Undergrad + J.D. (7 Yrs)",
    payLabel: "Median Early Pay",
    payValue: "$115,000 / yr",
    experienceHref: `${ROUTES.EXPERIENCE}?career=corporate-lawyer`,
  },
  {
    id: "product-design",
    title: "Product Design",
    discipline: "tech",
    icon: Palette,
    iconColor: "bg-sky-50 text-sky-600",
    badgeLabel: "High Growth",
    badgeStyle: "bg-emerald-100 text-emerald-800",
    category: "Creativity • User Experience",
    description:
      "Translate human needs into intuitive physical & digital solutions. Conduct user empathy research, prototype interfaces, and establish scalable design systems.",
    skills: ["User Research", "Interactive Prototyping", "Design Strategy"],
    pathwayLabel: "Typical Pathway",
    pathwayValue: "B.Des / HCI Degree (4 Yrs)",
    payLabel: "Median Early Pay",
    payValue: "$76,000 / yr",
    experienceHref: `${ROUTES.EXPERIENCE}?career=product-design`,
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    discipline: "humanities",
    icon: Rocket,
    iconColor: "bg-indigo-50 text-primary",
    badgeLabel: "High Variable",
    badgeStyle: "bg-amber-100 text-amber-800",
    category: "Strategy • Business",
    description:
      "Turn ideas into viable sustainable ventures. Master cash flow planning, customer validation, product-market fit discovery, and resilient leadership.",
    skills: ["Financial Modeling", "Go-To-Market", "Capital Allocation"],
    pathwayLabel: "Typical Pathway",
    pathwayValue: "Flexible / B.B.A. (3-4 Yrs)",
    payLabel: "Income Dynamic",
    payValue: "Performance Variable",
    experienceHref: `${ROUTES.EXPERIENCE}?career=tech-founder`,
  },
];

export function FeaturedCareersSection() {
  const [filter, setFilter] = React.useState<DisciplineFilter>("all");

  const filteredCareers = CAREERS.filter((career) => {
    if (filter === "all") return true;
    return career.discipline === filter;
  });

  return (
    <section id="explore-grid" className="mx-auto max-w-7xl px-6 md:px-10 py-16 border-t border-border">
      {/* Section Header with Discipline Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-semibold text-primary tracking-wider uppercase">
            FEATURED DISCIPLINES
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mt-1">
            Explore Careers in Action
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Preview typical challenges and run a 5-minute interactive test case.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground mr-1 hidden sm:inline-block">
            Filter by discipline:
          </span>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-slate-100 text-foreground hover:bg-slate-200"
            }`}
          >
            All Fields
          </button>
          <button
            type="button"
            onClick={() => setFilter("tech")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === "tech"
                ? "bg-primary text-white shadow-xs"
                : "bg-slate-100 text-foreground hover:bg-slate-200"
            }`}
          >
            Tech
          </button>
          <button
            type="button"
            onClick={() => setFilter("humanities")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === "humanities"
                ? "bg-primary text-white shadow-xs"
                : "bg-slate-100 text-foreground hover:bg-slate-200"
            }`}
          >
            Humanities &amp; Business
          </button>
        </div>
      </div>

      {/* Career Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCareers.map((career) => {
          const Icon = career.icon;

          return (
            <div
              key={career.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-white p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all duration-200"
            >
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex size-12 items-center justify-center rounded-lg ${career.iconColor}`}>
                    <Icon className="size-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${career.badgeStyle}`}>
                    {career.badgeLabel}
                  </span>
                </div>

                {/* Meta */}
                <div className="text-xs text-muted-foreground font-medium mb-1">
                  {career.category}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {career.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {career.description}
                </p>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-slate-100 text-foreground text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Typical Pathway & Salary Box */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs mb-6">
                  <div>
                    <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
                      {career.pathwayLabel}
                    </span>
                    <span className="font-semibold text-foreground">
                      {career.pathwayValue}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
                      {career.payLabel}
                    </span>
                    <span className="font-semibold text-foreground">
                      {career.payValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={career.experienceHref}
                className="w-full h-11 rounded-lg bg-slate-50 border border-slate-300 hover:border-primary hover:text-primary hover:bg-white text-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-colors duration-150 active:scale-[0.99]"
              >
                <span>Experience This Career</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
