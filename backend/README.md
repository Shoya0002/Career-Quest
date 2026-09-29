# CareerQuest Backend Foundation

FastAPI backend for CareerQuest providing structured Career Explorer, Career Details, the interactive Experience Lab simulation engine, and the deterministic What-If Career Simulator.

---

## 🚀 Tech Stack

- **Python:** 3.12+
- **Framework:** FastAPI
- **Data Validation:** Pydantic v2
- **ORM:** SQLAlchemy 2.x
- **Database:** SQLite (prototype, designed for seamless migration to PostgreSQL)
- **Migrations:** Alembic
- **ASGI Server:** Uvicorn
- **Testing:** pytest, pytest-asyncio, httpx

---

## 📁 Architecture Overview

```
backend/
│
├── app/
│   ├── main.py                  # FastAPI app entrypoint, CORS, lifespan, OpenAPI config
│   │
│   ├── core/
│   │   ├── config.py            # Pydantic BaseSettings loading from .env
│   │   └── database.py          # SQLAlchemy engine, SessionLocal, get_db dependency
│   │
│   ├── models/                  # SQLAlchemy 2.x ORM models
│   │   ├── career.py            # Normalized tables: Career, Skills, Education, Progression, etc.
│   │   ├── experience.py        # Experience, Scenario, Evidence, Decision, DecisionOutcome, Session
│   │   ├── what_if.py           # PathwayOption model for What-If calculations
│   │   └── __init__.py
│   │
│   ├── schemas/                 # Pydantic v2 request/response schemas
│   │   ├── career.py            # Career, Explorer list, Details, and Pathway schemas
│   │   ├── experience.py        # Anti-cheating Scenario, Decision, Session, and Reflection schemas
│   │   ├── what_if.py           # WhatIfRequest, WhatIfResponse, and PathwayOption schemas
│   │   └── __init__.py
│   │
│   ├── api/
│   │   ├── routes/
│   │   │   ├── careers.py       # REST API endpoints (/api/v1/careers)
│   │   │   ├── experiences.py   # REST API endpoints (/api/v1/experiences & /api/v1/experience-sessions)
│   │   │   ├── what_if.py       # REST API endpoints (/api/v1/careers/{slug}/what-if)
│   │   │   └── __init__.py
│   │   └── __init__.py
│   │
│   ├── services/
│   │   ├── career_service.py    # Career queries, filtering, search & pagination logic
│   │   ├── experience_service.py # Safe public scenario retrieval (anti-cheating)
│   │   ├── simulation_service.py # Interactive decision resolution, state advancement & scoring
│   │   └── what_if_service.py   # Deterministic What-If constraint evaluation engine
│   │
│   └── seed/
│       ├── careers.py           # Main seed orchestrator (8 structured careers)
│       ├── experiences.py       # Seed script for Software Engineer Production Incident simulation
│       └── what_if.py           # Seed script for What-If pathway options (B.Tech, B.Sc, Alt, Abroad)
│
├── tests/
│   ├── conftest.py              # Pytest fixtures and in-memory test database
│   ├── test_careers.py          # Phase 1: Career Explorer and Details test suite
│   ├── test_experiences.py      # Phase 2: Experience Lab simulation lifecycle test suite
│   └── test_what_if.py          # Phase 3: What-If Career Simulator test suite
│
├── alembic/                     # Alembic database migration scripts
├── alembic.ini                  # Alembic configuration
├── pytest.ini                   # Pytest runner configuration
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment configuration template
└── README.md                    # Backend setup and documentation
```

---

## ⚙️ Setup & Local Development

### 1. Create and Activate Virtual Environment

```bash
cd backend
python -m venv .venv

# Windows (PowerShell)
.\.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

### 4. Initialize Database & Run Seed Script

```bash
# Seeds all 8 careers, Experience Lab simulation, and What-If pathway options
python -m app.seed.careers
```

### 5. Start Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

---

## 📖 Interactive API Documentation

Once the server is running:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI JSON:** [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

---

## 🔮 Phase 3 — What-If Career Simulator Reference

The What-If Simulator recalculates viable career pathway alternatives and financial trade-offs based on personal/financial constraints.

### Endpoint
`POST /api/v1/careers/{career_slug}/what-if`

### Input Variables
- `education_budget` (float, `>= 0`): Annual budget in preferred currency.
- `currency` (string, default `"INR"`): Currency symbol/code.
- `preferred_location` (enum: `"India"` | `"Abroad"`): Geographic preference.
- `education_path` (enum: `"btech"` | `"bsc"` | `"alternative"`): Target academic model.
- `study_abroad` (boolean): Whether international degree routes are desired.

### Example Request
```json
{
  "education_budget": 200000,
  "currency": "INR",
  "preferred_location": "India",
  "education_path": "btech",
  "study_abroad": false
}
```

### Example Response Structure
```json
{
  "career": {
    "id": "software-engineer",
    "title": "Software Engineer"
  },
  "inputs": {
    "education_budget": 200000.0,
    "currency": "INR",
    "preferred_location": "India",
    "education_path": "btech",
    "study_abroad": false
  },
  "base_pathway": {
    "career_id": "software-engineer",
    "career_slug": "software-engineer",
    "title": "Software Engineering Career Roadmap",
    "total_duration_years": 4.5,
    "total_estimated_cost": "$40,000 - $160,000 [Illustrative Prototype Range]",
    "nodes": [...],
    "edges": [...]
  },
  "result": {
    "available": [],
    "requires_funding": [
      {
        "id": "path-swe-btech",
        "title": "Traditional B.Tech / B.E. in Computer Science",
        "education_path": "btech",
        "estimated_duration_years": 4.0,
        "annual_estimated_cost": 350000.0,
        "cost_label": "₹3,50,000 / yr [prototype_estimate]",
        "location_type": "India",
        "study_abroad_supported": false,
        "nodes": [...],
        "edges": [...]
      }
    ],
    "affected": [
      {
        "id": "path-swe-bsc",
        "title": "B.Sc in Computer Science & Applied Software",
        "education_path": "bsc",
        "annual_estimated_cost": 120000.0
      },
      {
        "id": "path-swe-alt",
        "title": "Alternative Skill-Based Bootcamp & Apprenticeship",
        "education_path": "alternative",
        "annual_estimated_cost": 45000.0
      }
    ],
    "excluded": [
      {
        "id": "path-swe-abroad",
        "title": "International B.S. in Computer Science (Global Campus)"
      }
    ]
  },
  "changes": [
    {
      "pathway_id": "path-swe-btech",
      "pathway_title": "Traditional B.Tech / B.E. in Computer Science",
      "change_type": "requires_funding",
      "reason": "The selected annual budget of INR 200,000 is below the prototype estimate (₹3,50,000 / yr [prototype_estimate]). Estimated annual funding gap is INR 150,000.",
      "funding_gap": 150000.0,
      "suggested_actions": [
        "Apply for merit and need-based STEM scholarships.",
        "Explore government education loan schemes with post-completion moratorium.",
        "Consider paid industry co-ops and summer internships to offset upper-year tuition."
      ]
    }
  ],
  "summary": "1 target pathway(s) remain viable with scholarship or education loan financing. 2 alternative pathway option(s) fit within your current budget parameters."
}
```

---

## 💡 Phase 4: Funding Intelligence + Agent Validation

### Architecture Pipeline

```
Database Funding Records (Scholarships, Loans, Institutional Aid)
                    ↓
Career Agent (Educational Context & Budget Deficit Analysis)
                    ↓
Funding Agent (Targeted Option Matching strictly from Catalog)
                    ↓
Validation Layer (Zero-Hallucination & Grounding Verification)
                    ↓
Response Synthesizer (Structured Grounded Response + Disclaimer)
```

### Key Features
- **Strict Grounding:** The validator automatically strips ungrounded or hallucinated funding programs and adjusts exaggerated claims back to authoritative database records.
- **Provider Agnostic:** Configurable LLM abstraction with instant deterministic fallback if external AI APIs are offline.
- **Source Transparency:** All funding options contain verifiable source metadata and mock prototype indicators.
- **Safe Trace:** Optional `debug=true` parameter returns pipeline stage execution status without exposing raw prompts or private keys.

### Funding API Endpoints

#### 1. Search & Filter Funding Records
`GET /api/v1/funding?career_category=Technology&education_level=bachelor&location=India`

#### 2. Get Single Funding Option
`GET /api/v1/funding/{option_id}`

#### 3. AI Funding Analysis
`POST /api/v1/funding/analyze`

**Request:**
```json
{
  "career_slug": "software-engineer",
  "education_path": "btech",
  "annual_budget": 200000,
  "currency": "INR",
  "location": "India",
  "query": "What funding options can help me pursue software engineering in India?",
  "debug": true
}
```

**Response:**
```json
{
  "query": "What funding options can help me pursue software engineering in India?",
  "career": {
    "id": "1",
    "slug": "software-engineer",
    "title": "Software Engineer"
  },
  "funding_need": {
    "annual_budget": 200000.0,
    "currency": "INR",
    "estimated_annual_cost": 350000.0,
    "annual_deficit": 150000.0
  },
  "options": [
    {
      "id": "fund-stem-merit-scholarship",
      "name": "National STEM Excellence Scholarship",
      "type": "scholarship",
      "provider": "National Science & Technology Foundation",
      "why_relevant": "Provides direct merit tuition relief for undergraduate B.Tech STEM degrees.",
      "eligibility": "Minimum 80% aggregate in 10+2 (PCM) and enrollment in recognized B.Tech/B.E./B.Sc CS program.",
      "amount": "Up to ₹1,50,000 / year tuition fee waiver",
      "confidence": "supported",
      "source": {
        "name": "National STEM Foundation Portal (Demo Source)",
        "url": "https://demo.careerquest.org/sources/stem-scholarship",
        "verified": false,
        "last_verified_at": "2026-03-01",
        "is_mock": true
      }
    }
  ],
  "removed_claims": [],
  "uncertainties": [],
  "limitations": [
    "Estimated annual funding gap is 150,000 INR. Combining scholarships with educational loans or institutional aid is advised."
  ],
  "disclaimer": "Funding information is strictly informational and should be directly verified with the granting institution or financial provider before applying. CareerQuest does not guarantee scholarship eligibility or loan approval.",
  "trace": {
    "career_agent": "completed",
    "funding_agent": "completed",
    "validator": "completed",
    "synthesizer": "completed"
  }
}
```

---

## ⚖️ Phase 5: Career Decision Matrix

### Product Purpose
The Decision Matrix enables side-by-side trade-off evaluation between any two careers.
- **Deterministic & Objective:** No LLM hallucination, no ranking, no suitability score, and no winner is declared.
- **Side-by-Side Dimensions:** 12 common dimensions normalized from authoritative database records.

### Comparison Dimensions
1. `overview` (Overview & Professional Scope)
2. `education` (Education Path)
3. `education_duration` (Education Duration)
4. `education_cost` (Education Cost)
5. `skills` (Core Skills)
6. `work_environment` (Work Environment & Stress Context)
7. `career_progression` (Career Progression)
8. `specializations` (Specializations)
9. `work_models` (Work Models & Flexibility)
10. `geographic_opportunities` (Geographic Opportunities & Hubs)
11. `practical_considerations` (Practical Considerations & Trade-Offs)
12. `funding_considerations` (Funding Considerations & Financial Aid)

### Decision Matrix API Endpoint

`GET /api/v1/careers/compare?career_a=software-engineer&career_b=lawyer`

**Optional Filter:**
`GET /api/v1/careers/compare?career_a=software-engineer&career_b=lawyer&dimensions=education,skills,education_cost`

**Response:**
```json
{
  "career_a": {
    "id": "software-engineer",
    "slug": "software-engineer",
    "title": "Software Engineer",
    "category": "Technology",
    "tagline": "Architect and build scalable systems powering the modern world"
  },
  "career_b": {
    "id": "lawyer",
    "slug": "lawyer",
    "title": "Lawyer",
    "category": "Law & Public Policy",
    "tagline": "Advocate justice, structure complex transactions, and navigate legal systems"
  },
  "dimensions": [
    {
      "key": "education",
      "label": "Education Path",
      "career_a": {
        "value": "B.Tech / B.E. / B.S. in Computer Science or Software Engineering",
        "details": ["..."],
        "data_available": true
      },
      "career_b": {
        "value": "5-Year Integrated Law Degree (B.A. LL.B. / B.B.A. LL.B.)",
        "details": ["..."],
        "data_available": true
      }
    }
  ],
  "trade_offs": [
    {
      "dimension": "education",
      "label": "Education & Licensing Requirements",
      "summary": "Software Engineer pathways emphasize foundational degrees (Technology) with flexible alternative entry routes, whereas Lawyer pathways require formal professional degree accreditation and statutory licensing."
    }
  ],
  "source": {
    "name": "CareerQuest Comprehensive Career Registry (Prototype Data)",
    "url": "https://demo.careerquest.org/sources/careers",
    "verified": false,
    "is_mock": true
  },
  "disclaimer": "Career comparison data is strictly informational and intended to highlight structured trade-offs. CareerQuest does not declare winners, compute suitability scores, or rank career paths."
}
```

---

## 🧪 Running Tests

Run the complete test suite (47 tests across all 5 phases):

```bash
pytest -v
```


