import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import {
  DashboardHeader,
  ContinueExperienceCard,
  JourneyProgress,
  CareersWorthExploring,
  PathwayPreview,
} from "@/components/dashboard";
import { MOCK_DASHBOARD_DATA } from "@/data/mock";

export const metadata: Metadata = {
  title: "Dashboard | CareerQuest",
  description:
    "Explore careers, experience realistic simulations, and track your decision pathways.",
};

export default function DashboardPage() {
  const {
    greeting,
    continueExperience,
    journeyStats,
    careersWorthExploring,
    pathwayPreview,
  } = MOCK_DASHBOARD_DATA;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-foreground font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* 1. Top Navigation */}
      <Navbar />

      {/* Main Dashboard Canvas */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 md:px-10 py-10 space-y-10">
        {/* 2. Welcome Section */}
        <DashboardHeader
          heading={greeting.heading}
          subheading={greeting.subheading}
          supportingText={greeting.supportingText}
          ctaText={greeting.ctaText}
          ctaHref={greeting.ctaHref}
        />

        {/* 3. Continue Exploring (Active Interactive Simulation) */}
        <ContinueExperienceCard
          careerTitle={continueExperience.careerTitle}
          scenarioTitle={continueExperience.scenarioTitle}
          description={continueExperience.description}
          progressPercentage={continueExperience.progressPercentage}
          estimatedMinutesRemaining={continueExperience.estimatedMinutesRemaining}
          href={continueExperience.href}
        />

        {/* 4. Careers Worth Exploring */}
        <CareersWorthExploring careers={careersWorthExploring} />

        {/* 5. Your Journey (Lightweight Progress Stats) */}
        <JourneyProgress
          careersExplored={journeyStats.careersExplored}
          experiencesCompleted={journeyStats.experiencesCompleted}
          pathwaysCompared={journeyStats.pathwaysCompared}
        />

        {/* 6. Pathway Discovery */}
        <PathwayPreview
          title={pathwayPreview.title}
          subtitle={pathwayPreview.subtitle}
          ctaText={pathwayPreview.ctaText}
          ctaHref={pathwayPreview.ctaHref}
          branches={pathwayPreview.branches}
        />
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
