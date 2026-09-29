🎮 CareerQuest

Explore. Experience. Decide.

CareerQuest is an AI-powered career exploration platform that helps students make informed career decisions by experiencing careers before choosing them.

✨ Features

🧭 Career Exploration — Discover career and education pathways based on interests, academics, and constraints.

🎮 Career Experiences — Experience interactive simulations of professions such as Law, Software Engineering, and Entrepreneurship.

🤖 AI Career Council — Career, Funding, and Simulation agents analyze and debate possible pathways.

🔀 What-If Simulator — Explore how changes in budget, academics, or other constraints affect possible pathways.

📊 Decision Matrix — Compare pathways across academics, interests, finances, and experience.

🕸️ Career Map — Visualize multiple routes toward a career.

🧠 Core Idea

Don't just choose a career. Experience it first.

CareerQuest supports students in exploring their possibilities rather than making the decision for them.

🛠️ Tech Stack

Frontend

Next.js

TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

React Flow

Recharts

Backend

FastAPI

Python

Pydantic

SQLAlchemy

Database & Storage

PostgreSQL

pgvector

Redis

AI & Agentic System

LangGraph

LLM Provider Abstraction

RAG

Career Simulation Engine

Custom Python Simulation Engine

JSON-based scenario definitions

Deterministic scoring and game-state management

AI-powered dynamic interactions

Authentication

Auth.js

Google OAuth

Testing

Pytest

Vitest

React Testing Library

Deployment

Vercel — Frontend

Render / Railway — Backend

Supabase — PostgreSQL

Upstash — Redis

Development

Git

GitHub

Docker

Ruff

ESLint

🏗️ Architecture

                    STUDENT PROFILE
                           │
                           ▼
                  ┌─────────────────┐
                  │   ORCHESTRATOR  │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        Career Agent   Funding Agent   Simulation Agent
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                      AGENT DEBATE
                           │
                           ▼
                    DECISION ENGINE
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       Career Paths   What-If Engine   Decision Matrix
             │
             ▼
      Career Experience Lab

Engineering Principle

AI for reasoning → RAG for facts → deterministic code for calculations → simulation engine for experiences → agents for deliberation.

🚀 Hackathon

Built for HackMatrix , PCCOE Hackathon.

CareerQuest - Explore. Experience. Decide.