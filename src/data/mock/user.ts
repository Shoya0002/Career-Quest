import type { UserProfile } from "@/types";

export const MOCK_USER_PROFILE: UserProfile = {
  id: "user-101",
  email: "alex.student@example.com",
  fullName: "Alex Rivera",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  createdAt: "2026-01-15T08:00:00Z",
  academics: {
    currentGradeLevel: "high_school_senior",
    gpa: 3.82,
    strongSubjects: ["AP Computer Science", "Calculus BC", "English Literature", "Physics"],
    standardizedScores: {
      sat: 1460,
    },
  },
  finances: {
    availableCollegeFundUsd: 40000,
    maxAcceptableLoanDebtUsd: 30000,
    eligibleForNeedBasedAid: true,
    priorityForEarlyEarnings: "medium",
  },
  interests: {
    topInterests: ["Software Systems", "Artificial Intelligence", "Legal Tech", "Entrepreneurship"],
    preferredIndustries: ["technology", "business_finance"],
    preferredWorkEnvironment: "hybrid",
    targetEducationLevel: "bachelor",
  },
  savedCareerIds: ["software-engineer", "tech-founder"],
  completedSimulationIds: ["sim-swe-incident"],
  activePathwayId: "pathway-swe-traditional",
};
