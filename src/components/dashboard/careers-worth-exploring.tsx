"use client";

import Link from "next/link";
import {
  Terminal,
  Scale,
  Rocket,
  Palette,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

interface CareerItem {
  id: string;
  title: string;
  category: string;
  discipline: string;
  description: string;
  skills: string[];
  iconName: "Terminal" | "Scale" | "Rocket" | "Palette";
  href: string;
}

const ICON_MAP = {
  Terminal: { component: Terminal, color: "bg-indigo-50 text-primary" },
  Scale: { component: Scale, color: "bg-sky-50 text-sky-600" },
  Rocket: { component: Rocket, color: "bg-indigo-50 text-primary" },
  Palette: { component: Palette, color: "bg-sky-50 text-sky-600" },
};

interface CareersWorthExploringProps {
  careers?: CareerItem[];
}

const DEFAULT_CAREERS: CareerItem[] = [
  {
    id: "software-engineering",
    title: "Software Engineering",
    category: "Technology · Problem Solving",
    discipline: "Tech",
    description:
      "Build digital systems and solve infrastructure challenges. Design reliable software, write clean code, and collaborate with engineering teams.",
    skills: ["System Architecture", "Algorithmic Logic", "Cloud Infrastructure"],
    iconName: "Terminal",
    href: `${ROUTES.EXPLORE}?career=software-engineer`,
  },
  {
    id: "law",
    title: "Law",
    category: "Reasoning · Communication",
    discipline: "Humanities",
    description:
      "Analyze cases, advise organizations, and defend rights. Structure legal contracts, review precedents, and navigate regulatory frameworks.",
    skills: ["Legal Research", "Strategic Negotiation", "Contract Analysis"],
    iconName: "Scale",
    href: `${ROUTES.EXPLORE}?career=corporate-lawyer`,
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    category: "Strategy · Business",
    discipline: "Business",
    description:
      "Turn ideas into viable, sustainable ventures. Master cash flow planning, customer validation, product-market discovery, and resilient leadership.",
    skills: ["Financial Planning", "Go-To-Market", "Resource Allocation"],
    iconName: "Rocket",
    href: `${ROUTES.EXPLORE}?career=tech-founder`,
  },
  {
    id: "product-design",
    title: "Product Design",
    category: "Creativity · User Experience",
    discipline: "Design",
    description:
      "Translate user needs into intuitive digital solutions. Conduct user empathy research, create interactive prototypes, and establish scalable design systems.",
    skills: ["User Empathy Research", "Interactive Prototyping", "Design Systems"],
    iconName: "Palette",
    href: `${ROUTES.EXPLORE}?career=product-design`,
  },
];

export function CareersWorthExploring({
  careers = DEFAULT_CAREERS,
}: CareersWorthExploringProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Careers Worth Exploring
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Explore different professions and see what the work actually involves.
          </p>
        </div>

        <Link
          href={ROUTES.EXPLORE}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View All Disciplines</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {careers.map((career) => {
          const iconConfig = ICON_MAP[career.iconName] || ICON_MAP.Terminal;
          const Icon = iconConfig.component;

          return (
            <div
              key={career.id}
              className="flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-xs hover:border-slate-300 transition-all duration-200"
            >
              <div>
                {/* Header Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex size-10 items-center justify-center rounded-lg ${iconConfig.color}`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {career.discipline}
                  </span>
                </div>

                <div className="text-[11px] font-medium text-muted-foreground mb-0.5">
                  {career.category}
                </div>

                <h3 className="text-base font-bold text-foreground mb-2">
                  {career.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {career.description}
                </p>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-slate-100 text-foreground text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={career.href}
                className="w-full h-9 rounded-md bg-slate-50 border border-slate-200 hover:border-primary hover:text-primary hover:bg-white text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-150 active:scale-[0.99]"
              >
                <span>Explore Career</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
