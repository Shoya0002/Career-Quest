import type { Pathway, DecisionMatrixRow, WhatIfSimulationResult } from "@/types";

export const MOCK_PATHWAYS: Pathway[] = [
  {
    id: "pathway-swe-traditional",
    careerId: "software-engineer",
    title: "Traditional B.S. Computer Science",
    description: "4-year university degree followed by structured summer internships into a full-time entry role.",
    totalDurationYears: 4,
    totalEstimatedCost: 95000,
    expectedBreakEvenYears: 2.5,
    difficultyScore: 7,
    tags: ["Accredited", "Comprehensive", "High Placement"],
    nodes: [
      {
        id: "node-1",
        position: { x: 50, y: 150 },
        data: {
          title: "B.S. in Computer Science",
          subtitle: "Core Foundations & Theory",
          durationMonths: 48,
          estimatedCost: 90000,
          avgCompletionRatePercent: 82,
          nodeType: "education",
          isUnlocked: true,
          requiredGpa: 3.2,
        },
      },
      {
        id: "node-2",
        position: { x: 350, y: 100 },
        data: {
          title: "Software Engineering Internship",
          subtitle: "Junior Year Industry Experience",
          durationMonths: 3,
          estimatedCost: 0,
          avgCompletionRatePercent: 94,
          nodeType: "internship",
          isUnlocked: false,
        },
      },
      {
        id: "node-3",
        position: { x: 650, y: 150 },
        data: {
          title: "Associate Software Engineer",
          subtitle: "Full-Time Entry Role ($90k+)",
          durationMonths: 24,
          estimatedCost: 0,
          avgCompletionRatePercent: 98,
          nodeType: "entry_role",
          isUnlocked: false,
        },
      },
      {
        id: "node-4",
        position: { x: 950, y: 150 },
        data: {
          title: "Mid-Level Software Engineer",
          subtitle: "Independent Feature Ownership ($130k+)",
          durationMonths: 36,
          estimatedCost: 0,
          avgCompletionRatePercent: 90,
          nodeType: "mid_role",
          isUnlocked: false,
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "node-1",
        target: "node-2",
        label: "Year 3 Milestone",
        animated: true,
      },
      {
        id: "e2-3",
        source: "node-2",
        target: "node-3",
        label: "Return Offer",
      },
      {
        id: "e3-4",
        source: "node-3",
        target: "node-4",
        label: "Promotion (2-3 yrs)",
      },
    ],
  },
];

export const MOCK_DECISION_MATRIX: DecisionMatrixRow[] = [
  {
    careerId: "software-engineer",
    careerName: "Software Engineer",
    academicMatchScore: 92,
    interestScore: 88,
    financialScore: 90,
    simulationExperienceScore: 85,
    marketStabilityScore: 94,
    compositeScore: 90,
  },
  {
    careerId: "corporate-lawyer",
    careerName: "Corporate Lawyer",
    academicMatchScore: 85,
    interestScore: 78,
    financialScore: 68,
    simulationExperienceScore: 72,
    marketStabilityScore: 88,
    compositeScore: 78,
  },
  {
    careerId: "tech-founder",
    careerName: "Tech Founder",
    academicMatchScore: 70,
    interestScore: 95,
    financialScore: 45,
    simulationExperienceScore: 80,
    marketStabilityScore: 50,
    compositeScore: 68,
  },
];

export const MOCK_WHAT_IF_RESULT: WhatIfSimulationResult = {
  viablePathways: MOCK_PATHWAYS,
  recommendedPathwayId: "pathway-swe-traditional",
  tradeOffAnalysis: [
    {
      dimension: "Total Tuition & Upfront Debt",
      standardPathwayValue: "$95,000",
      adjustedPathwayValue: "$24,000",
      differenceFormatted: "-$71,000 Saved",
      favorableTo: "adjusted",
    },
    {
      dimension: "Time to First Full-Time Income",
      standardPathwayValue: "4.0 Years",
      adjustedPathwayValue: "2.0 Years",
      differenceFormatted: "2.0 Years Faster",
      favorableTo: "adjusted",
    },
    {
      dimension: "Tier-1 Tech Company Placement Rate",
      standardPathwayValue: "34%",
      adjustedPathwayValue: "18%",
      differenceFormatted: "-16% Lower",
      favorableTo: "standard",
    },
  ],
  agentSummaryAdvice:
    "The Financial Agent endorses the community college + university transfer route, preserving $71,000 in upfront capital while reaching a similar midpoint salary within 3.5 years.",
};
