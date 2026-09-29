from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field


# --- Public Scenario & Evidence Schemas (Anti-cheating safe) ---

class EvidencePublicSchema(BaseModel):
    id: str = Field(..., description="Unique evidence ID")
    title: str = Field(..., description="Evidence title or document name")
    type: str = Field(..., description="Category e.g. timeline, metric, log, status, chat")
    content: str = Field(..., description="Structured scenario evidence information")
    importance: str = Field(..., description="Significance level: critical, high, medium, low")
    preview_text: Optional[str] = None
    full_content: Optional[str] = None
    display_order: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)


class DecisionPublicSchema(BaseModel):
    id: str = Field(..., description="Unique decision option ID")
    title: str = Field(..., description="Tactical decision title")
    description: str = Field(..., description="Contextual explanation and trade-offs")
    option_label: Optional[str] = None
    display_order: Optional[int] = 0

    # NOTICE: Never expose hidden outcomes, score deltas, or future branch targets here
    model_config = ConfigDict(from_attributes=True)


class ScenarioPublicResponse(BaseModel):
    id: str = Field(..., description="Scenario identifier")
    experience_id: str = Field(..., description="Parent experience identifier")
    sequence: int = Field(..., description="Sequence step (1, 2, 3)")
    sequence_order: Optional[int] = None
    title: str = Field(..., description="Scenario headline")
    situation: str = Field(..., description="High-level situation brief")
    situation_brief: Optional[str] = None
    description: str = Field(..., description="Detailed narrative and investigation task")
    evidence: List[EvidencePublicSchema] = Field(default_factory=list, description="Available logs, metrics and clues")
    evidence_items: Optional[List[EvidencePublicSchema]] = None
    decisions: List[DecisionPublicSchema] = Field(default_factory=list, description="Available tactical choices")

    model_config = ConfigDict(from_attributes=True)


# --- Experience Schemas ---

class ExperienceDetailResponse(BaseModel):
    id: str = Field(..., description="Unique experience ID")
    career_id: str = Field(..., description="Associated career ID")
    slug: str = Field(..., description="URL identifier e.g. swe-production-incident")
    title: str = Field(..., description="Experience simulation title")
    description: str = Field(..., description="Overview of the simulation challenge")
    role: str = Field(..., description="Professional role assumed by the student")
    estimated_duration: str = Field(..., description="Estimated completion time")
    difficulty: str = Field(..., description="Simulation difficulty level")
    learning_objective: str = Field(..., description="Primary real-world skills practiced")
    skills: List[str] = Field(default_factory=list, description="Skills exercised in this simulation")
    scenarios_count: int = Field(..., description="Total number of sequential scenarios")
    category: Optional[str] = Field(default="Technology", description="Career category")
    tagline: Optional[str] = Field(default=None, description="Experience subtitle or tagline")
    role_title: Optional[str] = Field(default=None, description="Assigned role title")
    organization: Optional[str] = Field(default="Global CloudCommerce", description="Simulated company name")
    briefing: Optional[str] = Field(default=None, description="Briefing text")
    total_scenarios: Optional[int] = Field(default=None, description="Total scenario count")
    first_scenario: Optional[ScenarioPublicResponse] = Field(default=None, description="First scenario in sequence")

    model_config = ConfigDict(from_attributes=True)


# --- Session & Decision Submission Schemas ---

class DecisionSubmitRequest(BaseModel):
    scenario_id: str = Field(..., description="The current active scenario ID")
    decision_id: str = Field(..., description="The student's selected decision ID")


class PerformanceScoreSchema(BaseModel):
    score_delta: int = Field(..., description="Score points awarded for this choice")
    technical: int = Field(..., description="Technical accuracy evaluation (1-10)")
    reasoning: int = Field(..., description="Analytical synthesis evaluation (1-10)")
    prioritization: int = Field(..., description="Triage and urgency evaluation (1-10)")
    communication: int = Field(..., description="Team alignment evaluation (1-10)")


class DecisionOutcomeInfoSchema(BaseModel):
    title: str = Field(..., description="Headline of the immediate outcome")
    description: str = Field(..., description="Detailed narrative of what happened next")
    consequence: str = Field(..., description="Real-world system/organizational consequence")
    feedback: str = Field(..., description="Professional coaching commentary on reasoning and trade-offs")


class SimpleDecisionSchema(BaseModel):
    id: str
    title: str


class SimpleScenarioSchema(BaseModel):
    id: str
    title: str


class SimulationProgressSchema(BaseModel):
    current: int = Field(..., description="Current scenario sequence")
    total: int = Field(..., description="Total scenario count")


class DecisionOutcomeResponse(BaseModel):
    decision: SimpleDecisionSchema
    outcome: DecisionOutcomeInfoSchema
    performance: PerformanceScoreSchema
    next_scenario: Optional[Any] = None
    progress: SimulationProgressSchema
    is_completed: bool = Field(..., description="True if the final scenario was completed")
    # Compatible alias fields for frontend
    outcome_headline: Optional[str] = None
    consequence_text: Optional[str] = None
    reflection_prompt: Optional[str] = None
    performance_delta: Optional[dict] = None
    is_final_scenario: Optional[bool] = None


class ExperienceSessionCreateResponse(BaseModel):
    session_id: str = Field(..., description="Generated session token/ID")
    experience: ExperienceDetailResponse
    first_scenario: ScenarioPublicResponse
    current_scenario: Optional[ScenarioPublicResponse] = None
    progress: SimulationProgressSchema


class ExperienceSessionStateResponse(BaseModel):
    session_id: str
    experience_id: str
    status: str  # "in_progress" | "completed"
    current_scenario: Optional[ScenarioPublicResponse] = None
    progress: SimulationProgressSchema
    decisions_made: int
    total_score: int
    started_at: datetime
    completed_at: Optional[datetime] = None


# --- Experience Completion & Reflection Schemas ---

class DecisionLogItemSchema(BaseModel):
    scenario_title: str
    decision_title: str
    outcome_title: str
    consequence: str
    feedback: str
    score_delta: int


class ReflectionPromptSchema(BaseModel):
    id: str
    prompt: str
    category: str


class PerformanceBreakdownSchema(BaseModel):
    technical_score: int
    reasoning_score: int
    prioritization_score: int
    communication_score: int
    technical_accuracy: Optional[int] = None
    problem_solving: Optional[int] = None
    collaboration_communication: Optional[int] = None
    stress_management: Optional[int] = None


class ExperienceCompletionResultResponse(BaseModel):
    session_id: str
    experience_id: str
    status: str
    total_score: int
    final_score: Optional[int] = None
    performance_breakdown: PerformanceBreakdownSchema
    scenarios_completed: int
    skills_exercised: List[str]
    decisions_log: List[DecisionLogItemSchema]
    decision_history: Optional[List[Dict[str, Any]]] = None
    strengths_demonstrated: List[str]
    areas_to_reflect_on: List[str]
    reflection_prompts: List[Any]
    summary_message: str = Field(
        ...,
        description="Encouraging professional summary describing what was practiced (no suitability scores)",
    )
