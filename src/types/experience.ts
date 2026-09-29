export interface CareerExperienceTrack {
  id: string;
  name: string;
  icon?: string;
  iconName?: string;
  sublabel?: string;
  category?: string;
  description?: string;
  difficulty?: string;
  duration?: string;
  role?: string;
  organization?: string;
}

export interface CaseLitigant {
  role: string;
  name: string;
  entity?: string;
  counsel?: string;
}

export interface CaseDossier {
  title: string;
  court?: string;
  role?: string;
  urgencyNotice?: string;
  opposingCounsel?: string;
  caseNumber?: string;
  clientName?: string;
  litigationType?: string;
  status?: string;
  clientSummary?: string;
  clientGoal?: string;
  coreLegalQuestions?: string[];
  proceduralDeadlines?: { title: string; due: string; status: string }[];
  litigants?: CaseLitigant[];
  incidentSummary?: string;
  coreObjective?: string;
  proceduralConstraints?: string;
  tradeoffNote?: string;
  judge?: {
    name: string;
    notes: string;
  };
}

export interface DecisionConsequence {
  directResult?: string;
  judgeImpression?: string;
  downstreamRisks?: string[];
  tacticalGain?: string;
  headline?: string;
  rulingBadge?: string;
  rulingVariant?: string;
  description?: string;
  realityLesson?: string;
}

export interface DecisionOption {
  id: string;
  code?: string;
  title: string;
  description?: string;
  tag?: string;
  riskProfile?: string;
  primaryBenefit?: string;
  isRecommended?: boolean;
  tradeoff?: string;
  proLabel?: string;
  conLabel?: string;
  consequence?: DecisionConsequence;
}

export interface ExperienceStage {
  stageNumber: number;
  totalStages?: number;
  stageTitle: string;
  progressPercent: number;
  taskTitle: string;
  taskBadge: string;
  taskConstraint: string;
  taskContext: string;
  defaultSelectedOptionId?: string;
  studentRationalePlaceholder?: string;
  studentRationaleDefault?: string;
  aiSyntaxCheckStatus?: string;
  decisionOptions: DecisionOption[];
  stagesList: { number: number; title: string; status: string }[];
}

export interface EvidenceAsset {
  id: string;
  category?: string;
  tabLabel?: string;
  documentType?: string;
  title: string;
  source?: string;
  confidentiality?: string;
  timestamp?: string;
  badge?: string;
  badgeType?: string;
  snippetHeader?: string;
  snippetQuote?: string;
  snippetFooter?: string;
  sourceMeta?: string;
  admissibilityMeta?: string;
  verifiedLabel?: string;
  actionLabel?: string;
  description?: string;
  statusLabel?: string;
  contentText?: string;
  dataTable?: { headers: string[]; rows: string[][] };
  bulletInsights?: string[];
}

export interface BehavioralSignal {
  id?: string;
  title?: string;
  trait?: string;
  observedAction?: string;
  score?: number;
  level?: string;
  percentage?: number;
  colorScheme?: string;
  interpretation?: string;
  careerCorrelation?: string;
  description?: string;
}

export interface ParentDialoguePrompt {
  title?: string;
  subtitle?: string;
  quote?: string;
  guideLabel?: string;
  shareCtaText?: string;
  question?: string;
  context?: string;
  guidance?: string;
}

export interface ComplementaryLab {
  id: string;
  title: string;
  field?: string;
  duration?: string;
  description: string;
  similarityReason?: string;
  ctaText?: string;
  icon?: any;
  href?: string;
}

export interface CareerExperienceData {
  id?: string;
  careerId?: string;
  careerTitle?: string;
  careerCategory: string;
  dossier: CaseDossier;
  currentStage: ExperienceStage;
  evidenceAssets: EvidenceAsset[];
  behavioralSignals: BehavioralSignal[];
  parentDialogue: ParentDialoguePrompt | ParentDialoguePrompt[];
  complementaryLabs: ComplementaryLab[];
  nextStepPathwayCta: {
    title?: string;
    label?: string;
    description?: string;
    href: string;
  };
}

export interface EvidencePublicSchema {
  id: string;
  title: string;
  type: string;
  preview_text: string;
  full_content: string;
  display_order: number;
}

export interface DecisionPublicSchema {
  id: string;
  option_label: string;
  title: string;
  description: string;
  display_order: number;
}

export interface ScenarioPublicResponse {
  id: string;
  sequence_order: number;
  title: string;
  situation_brief: string;
  evidence_items: EvidencePublicSchema[];
  decisions: DecisionPublicSchema[];
}

export interface ExperienceDetailResponse {
  id: string;
  slug: string;
  title: string;
  category?: string;
  tagline?: string;
  role_title?: string;
  role?: string;
  description?: string;
  organization?: string;
  briefing?: string;
  total_scenarios?: number;
  scenarios_count?: number;
  first_scenario?: ScenarioPublicResponse;
  skills?: string[];
}

export interface ExperienceSessionCreateResponse {
  session_id: string;
  status?: "in_progress" | "completed";
  current_scenario: ScenarioPublicResponse;
  first_scenario?: ScenarioPublicResponse;
  experience?: ExperienceDetailResponse;
  progress?: {
    current: number;
    total: number;
  };
}

export interface PerformanceDelta {
  score_delta: number;
  new_total_score: number;
  speed_score?: number;
  methodology_score?: number;
  communication_score?: number;
}

export interface DecisionOutcomeResponse {
  outcome_headline: string;
  consequence_text: string;
  reflection_prompt: string;
  performance_delta: PerformanceDelta;
  is_final_scenario: boolean;
  next_scenario?: ScenarioPublicResponse | null;
}

export interface PerformanceBreakdown {
  problem_solving: number;
  technical_accuracy: number;
  collaboration_communication: number;
  stress_management: number;
}

export interface DecisionLogItem {
  scenario_order: number;
  scenario_title: string;
  selected_option_label: string;
  decision_title: string;
  outcome_headline: string;
  consequence_text: string;
  score_awarded: number;
}

export interface ExperienceCompletionResultResponse {
  session_id: string;
  status: "completed";
  final_score: number;
  performance_breakdown: PerformanceBreakdown;
  decision_history: DecisionLogItem[];
  reflection_prompts: string[];
}
