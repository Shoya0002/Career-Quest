import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { JourneyWorkspace } from "@/components/journey";

export const metadata: Metadata = {
  title: "Career Journey & Decision Matrix | CareerQuest",
  description: "Visualize career roadmaps, education nodes, and multi-dimensional decision matrices.",
};

export default function JourneyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <JourneyWorkspace />

      <Footer />
    </div>
  );
}
