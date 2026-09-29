import { Navbar, Footer } from "@/components/layout";
import {
  HeroSection,
  GuidedTrajectory,
  HowItWorksSection,
  FeaturedCareersSection,
  ParentTrustSection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-foreground font-sans selection:bg-sky-100 selection:text-sky-900">
      <Navbar />

      <main className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Visual Pathway Schematic: The Guided Trajectory */}
        <GuidedTrajectory />

        {/* Section 2: How CareerQuest Works */}
        <HowItWorksSection />

        {/* Section 3: Featured Careers Grid */}
        <FeaturedCareersSection />

        {/* Section 4: Parent-Student Partnership */}
        <ParentTrustSection />
      </main>

      <Footer />
    </div>
  );
}
