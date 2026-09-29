import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { ExperienceWorkspace } from "@/components/experience";

export const metadata: Metadata = {
  title: "Experience Lab | CareerQuest",
  description:
    "Experience realistic profession simulations, evidence triage, tactical legal strategy, and authentic work observations.",
};

export default function ExperiencePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <ExperienceWorkspace />

      <Footer />
    </div>
  );
}
