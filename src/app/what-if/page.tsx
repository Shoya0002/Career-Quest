import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { WhatIfWorkspace } from "@/components/journey";

export const metadata: Metadata = {
  title: "What-If Simulator | CareerQuest",
  description: "Test budget, academic scores, and timeline constraints on career feasibility.",
};

export default function WhatIfPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <WhatIfWorkspace />

      <Footer />
    </div>
  );
}
