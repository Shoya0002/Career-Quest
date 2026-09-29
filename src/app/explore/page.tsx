import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { CareerExplorer } from "@/components/careers";

export const metadata: Metadata = {
  title: "Explore Careers | CareerQuest",
  description: "Explore diverse careers, salaries, educational requirements, and growth projections.",
};

export default function ExplorePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <CareerExplorer />

      <Footer />
    </div>
  );
}
