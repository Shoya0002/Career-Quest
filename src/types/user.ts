/**
 * CareerQuest - Student & User Profile Models
 */

import { EducationLevel, IndustryType } from "./career";

export interface AcademicRecord {
  currentGradeLevel: "high_school_freshman" | "high_school_senior" | "undergraduate" | "graduate" | "other";
  gpa: number; // e.g. 3.8
  strongSubjects: string[];
  standardizedScores?: {
    sat?: number;
    act?: number;
  };
}

export interface FinancialProfile {
  availableCollegeFundUsd: number;
  maxAcceptableLoanDebtUsd: number;
  eligibleForNeedBasedAid: boolean;
  priorityForEarlyEarnings: "low" | "medium" | "high";
}

export interface InterestProfile {
  topInterests: string[];
  preferredIndustries: IndustryType[];
  preferredWorkEnvironment: "remote" | "hybrid" | "in_person" | "field_work";
  targetEducationLevel: EducationLevel;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  academics: AcademicRecord;
  finances: FinancialProfile;
  interests: InterestProfile;
  savedCareerIds: string[];
  completedSimulationIds: string[];
  activePathwayId?: string;
}
