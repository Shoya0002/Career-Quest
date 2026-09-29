import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { ExperienceLab } from "@/components/simulation";

export const metadata: Metadata = {
  title: "Experience Lab | CareerQuest",
  description: "Experience realistic career simulations and AI agent council debates.",
};

export default function ExperiencePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <ExperienceLab />

      <Footer />
    </div>
  );
}
