import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding";

export const metadata: Metadata = {
  title: "Profile setup | CareerQuest",
  description: "Set up a flexible CareerQuest exploration profile.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
