import {
  CareerExperienceTrack,
  CareerExperienceData,
} from "@/types/experience";

export const CAREER_EXPERIENCE_TRACKS: CareerExperienceTrack[] = [
  {
    id: "law",
    name: "Law",
    sublabel: "Case Investigation",
    iconName: "Scale",
  },
  {
    id: "software-engineering",
    name: "Software Engineering",
    sublabel: "System Incident",
    iconName: "Terminal",
  },
  {
    id: "product-design",
    name: "Product Design",
    sublabel: "User Friction",
    iconName: "Palette",
  },
  {
    id: "medicine",
    name: "Medicine",
    sublabel: "Clinical Case",
    iconName: "Stethoscope",
  },
  {
    id: "finance",
    name: "Finance",
    sublabel: "M&A Due Diligence",
    iconName: "TrendingUp",
  },
];

export const LAW_EXPERIENCE_DATA: CareerExperienceData = {
  id: "case-408-law",
  careerCategory: "LAW",
  dossier: {
    caseNumber: "#408",
    title: "Case File #408: The Premature Contract Termination & IP Breach",
    court: "Apex Robotics Inc. v. Nova Dynamics Corp. · District Court for Northern California (Civil Division)",
    role: "Junior Legal Associate",
    urgencyNotice: "Preliminary Injunction Hearing in 45 Mins",
    litigants: [
      {
        name: "Apex Robotics Inc.",
        role: "Autonomous perception sensor vendor (Your Client)",
      },
      {
        name: "Nova Dynamics Corp.",
        role: "Tier-1 logistics and drone hardware manufacturer",
      },
    ],
    incidentSummary:
      "Nova Dynamics terminated their 3-year autonomous perception licensing agreement 14 months early, formally claiming Apex suffered fatal delivery failure on Milestone 3. Exactly 3 weeks later, Nova deployed an identical proprietary navigation software build on test rigs.",
    coreObjective:
      "Establish prima facie bad-faith contract breach before Judge Henderson to secure an immediate emergency discovery freeze and preserve code repos.",
    proceduralConstraints:
      "Nova cites contract Clause 8.2 (Immediate Material Default). Submitting an unverified trade-secret claim risks immediate Rule 11 court sanctions and dismisses Apex's emergency injunction.",
    tradeoffNote:
      "In civil litigation, filing broad accusations without corroborating audit logs risks losing judicial credibility before substantive arguments are even heard.",
    judge: {
      name: "Hon. Sarah Henderson",
      notes:
        "Known for strict procedural adherence; highly skeptical of speculative trade secret allegations without hard logs.",
    },
  },
  currentStage: {
    stageNumber: 2,
    totalStages: 4,
    stageTitle: "Stage 2 of 4: Evidence & Testimony Triage",
    progressPercent: 45,
    stagesList: [
      { number: 1, title: "1. Client Intake", status: "done" },
      { number: 2, title: "2. Evidence", status: "active" },
      { number: 3, title: "3. Motion Filing", status: "upcoming" },
      { number: 4, title: "4. Ruling", status: "upcoming" },
    ],
    taskBadge: "ACTION REQUIRED",
    taskTitle: "Step 2: Prioritizing Your Primary Evidence for the Injunction Motion",
    taskConstraint: "Single Key Anchor",
    taskContext:
      "Nova Dynamics filed a motion to dismiss claiming Apex missed Milestone 3 deliverables. You have 3 critical exhibits in your file, but procedural rules for this emergency morning docket limit your initial filing to ONE primary evidentiary anchor. Choose the tactical pathway you will present to Judge Henderson.",
    decisionOptions: [
      {
        id: "option_a",
        code: "Exhibit B-1",
        title: "Exhibit B-1: Timestamped Git Commits & Jira Delivery Logs",
        tag: "Technical Validation",
        isRecommended: false,
        tradeoff:
          "Rock-solid proof of Milestone 3 code delivery before the contractual deadline. However, dense technical jargon may necessitate expert witness testimony which Nova's counsel is aggressively delaying.",
        proLabel: "High objective clarity",
        conLabel: "Moderate legal complexity delay",
        consequence: {
          headline: "Consequence Analysis: What Happened Because You Submitted Exhibit B-1",
          rulingBadge: "Hearing Continued (4-Day Delay)",
          rulingVariant: "warning",
          description:
            "Judge Henderson acknowledged the technical timestamps but ordered a 4-day technical evidentiary referee review because Nova's counsel contested the Git cryptographic signatures. Nova used this 4-day window to ship test hardware to international partners.",
          realityLesson:
            "Procedurally airtight technical evidence can be blunted by savvy opposing counsel weaponizing judicial unfamiliarity with software systems.",
        },
      },
      {
        id: "option_b",
        code: "Exhibit D-4",
        title: "Exhibit D-4: Leaked Slack Excerpt from Nova VP of Engineering",
        tag: "Bad-Faith Intent Anchor",
        isRecommended: true,
        tradeoff:
          "Devastating, unassailable proof that Nova planned their in-house fork 2 months prior and manufactured artificial milestone delays. However, evidentiary admissibility could be vigorously challenged under Rule 408 / corporate privilege.",
        proLabel: "Decisive narrative impact",
        conLabel: "High procedural dispute risk",
        consequence: {
          headline: "Consequence Analysis: What Happened Because You Submitted Exhibit D-4",
          rulingBadge: "Injunction Granted (Interim)",
          rulingVariant: "success",
          description:
            "Judge Henderson closely scrutinized Nova's privilege objection. Because the leaked Slack excerpt demonstrated potential crime-fraud exception to attorney-client privilege, Judge Henderson refused Nova's motion to dismiss and granted a 48-hour expedited evidentiary review of Nova's internal repositories, forcing Nova's lead counsel to request an immediate confidential settlement recess.",
          realityLesson:
            "High-stakes litigators often take calculated procedural gambles with contested evidence when client survival demands immediate relief. However, experienced associates must have a watertight backup foundation (such as the Git delivery commits) ready if the bench rules the primary exhibit inadmissible.",
        },
      },
      {
        id: "option_c",
        code: "Exhibit A-2",
        title: "Exhibit A-2: Clause 14.1 Dispute Escalation Notice",
        tag: "Procedural Violation",
        isRecommended: false,
        tradeoff:
          "Clean, undeniable procedural breach (Nova failed to deliver mandatory 30-day cure notification prior to contract termination). However, this yields lower emergency damages and will not halt Nova's market deployment.",
        proLabel: "Zero admissibility risk",
        conLabel: "Weak injunction power",
        consequence: {
          headline: "Consequence Analysis: What Happened Because You Submitted Exhibit A-2",
          rulingBadge: "Damages Hearing Scheduled",
          rulingVariant: "info",
          description:
            "Judge Henderson found Nova breached procedural notice requirements, but refused to grant an emergency asset freeze because procedural notice violations can be compensated monetarily after trial.",
          realityLesson:
            "Safe procedural wins frequently fail to satisfy clients whose core business model faces instant cannibalization from market competitors.",
        },
      },
    ],
    defaultSelectedOptionId: "option_b",
    studentRationalePlaceholder:
      "Explain why your selected exhibit aligns with your client's core goal of an immediate injunction...",
    studentRationaleDefault:
      "Demonstrating pretext immediately establishes irreparable harm necessary for an emergency injunction, shifting burden of proof onto Nova. A procedural 30-day notice claim only entitles us to contractual cure damages, allowing Nova to release their pirated model during that window.",
    aiSyntaxCheckStatus: "Co-Counsel AI Syntax Check: Solid",
  },
  evidenceAssets: [
    {
      id: "doc-03",
      category: "evidence",
      title: "Doc 03: Slack Thread Export #eng-leadership",
      badge: "Critical Leak",
      badgeType: "error",
      timestamp: "June 14, 2:18 PM",
      snippetHeader: "From: Marcus Wright (VP Eng, Nova) | Direct Export",
      snippetQuote:
        '"Apex\'s perception model is fully ingested into our staging cluster. Can we cite SLA latency to freeze payments before the Q3 investor call?"',
      snippetFooter: "Replies: 4 hidden | 2 attachments (.py weights)",
      sourceMeta: "Source: Confidential Whistleblower",
      admissibilityMeta: "Admissibility: Contested (Rule 408)",
      verifiedLabel: "Flagged for Hearing",
      actionLabel: "View Full Chain",
    },
    {
      id: "doc-01",
      category: "evidence",
      title: "Doc 01: Master Services Agmt",
      description: "Section 8.2 (Material Breach) vs Section 14.1 (Mandatory 30-Day Mediation Period).",
      statusLabel: "Status: Verified Admissible",
      actionLabel: "Inspect Clauses",
    },
    {
      id: "doc-04",
      category: "evidence",
      title: "Doc 04: Server Audit Log",
      description: "AWS S3 bucket access records showing unauthorized repository clones from Nova IP addresses.",
      statusLabel: "Status: Corroborating",
      actionLabel: "Inspect Audit",
    },
    {
      id: "witness-01",
      category: "witnesses",
      title: "Witness: Dr. Elena Rostova",
      badge: "Available",
      badgeType: "success",
      description: "Apex Chief Scientist confirming Milestone 3 code passes all 12 precision thresholds in contract.",
      actionLabel: "Review Deposition Summary",
    },
    {
      id: "witness-02",
      category: "witnesses",
      title: "Witness: Marcus Wright (Deposition Subpoena)",
      badge: "Hostile / Pending",
      badgeType: "warning",
      description: "Nova VP of Engineering subpoenaed for testimony on code fork timeline and server repository mirror dates.",
      actionLabel: "View Deposition Outline",
    },
    {
      id: "witness-03",
      category: "witnesses",
      title: "Witness: Sarah Jenkins (Lead SRE)",
      badge: "Available",
      badgeType: "success",
      description: "Apex infrastructure lead with cryptographic key access logs verifying timely code push on Milestone 3.",
      actionLabel: "View Affidavit",
    },
    {
      id: "clause-01",
      category: "clauses",
      title: "Clause 8.2: Immediate Material Default",
      description: "Governs unilateral termination if delivery defects persist for >14 days after formal technical notification.",
      statusLabel: "Contested by Defense",
      actionLabel: "Read Clause Text",
    },
    {
      id: "clause-02",
      category: "clauses",
      title: "Clause 14.1: Mandatory Escalation & Cure",
      description: "Requires 30 days of executive-level negotiation prior to court filings or license revocation.",
      statusLabel: "Binding Standard",
      actionLabel: "Read Clause Text",
    },
  ],
  behavioralSignals: [
    {
      id: "signal-1",
      title: "Evidentiary Synthesis",
      level: "Strong Demonstrated",
      percentage: 88,
      colorScheme: "tertiary",
      description:
        "Demonstrated rapid identification of bad-faith intent markers amidst high technical noise. Cut through 18 pages of logs in under 7 minutes.",
    },
    {
      id: "signal-2",
      title: "Risk Tolerance in Ambiguity",
      level: "High / Decisive",
      percentage: 82,
      colorScheme: "primary",
      description:
        "Selected decisive, high-impact contested evidence over safe procedural filings when the client faced existential market launch threats.",
    },
    {
      id: "signal-3",
      title: "Analytical Skepticism",
      level: "Moderate",
      percentage: 65,
      colorScheme: "secondary",
      description:
        "Carefully corroborated 3 of 4 source documents with Dr. Rostova's testimony before locking in the final motion strategy.",
    },
  ],
  parentDialogue: {
    title: "Parent & Student Career Conversation Starter",
    subtitle: "Guidance Facilitator",
    quote:
      '"Real litigation attorneys spend approximately 70% of their billable hours meticulously reviewing documentation, cross-referencing audit timestamps, and evaluating evidentiary risk—rather than delivering dramatic courtroom orations. When Alex investigated the leaked Slack messages and server timestamps, did they find parsing document details intellectually energizing, or did it feel burdensome?"',
    guideLabel: "Counselor Reflection Guide Available",
    shareCtaText: "Send this talking prompt to Parent Portal",
  },
  nextStepPathwayCta: {
    label: "Explore Legal Education Pathways (B.A. LL.B / J.D. Timeline & Costs) →",
    href: "/journey",
  },
  complementaryLabs: [
    {
      id: "lab-swe",
      title: "Software Engineering Incident Lab",
      description:
        "Troubleshoot a catastrophic database failover on an active cloud cluster under 30-minute SLA constraints.",
      ctaText: "Start Software Incident Simulation →",
      icon: "Terminal",
      href: "/experience?career=software-engineering",
    },
    {
      id: "lab-ux",
      title: "Product Design UX Lab",
      description:
        "Resolve high churn in a fintech checkout funnel by analyzing behavioral heatmaps and redesigning modal architecture.",
      ctaText: "Start Product Design Simulation →",
      icon: "Palette",
      href: "/experience?career=product-design",
    },
  ],
};
