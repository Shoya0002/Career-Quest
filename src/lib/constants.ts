/**
 * CareerQuest Application Constants
 * "Explore. Experience. Decide."
 */

export const APP_CONFIG = {
  name: "CareerQuest",
  tagline: "Explore. Experience. Decide.",
  description:
    "An AI-powered career exploration platform helping students explore careers, experience realistic profession simulations, compare pathways, and make confident life decisions.",
  version: "0.1.0",
} as const;

/**
 * CareerQuest Locked Design System Tokens
 */
export const COLOR_TOKENS = {
  primary: "#4F46E5",
  secondary: "#0EA5E9",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
} as const;

/**
 * Core Application Navigation Routes
 */
export const ROUTES = {
  HOME: "/",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  EXPLORE: "/explore",
  CAREER: "/career",
  EXPERIENCE: "/experience",
  SIMULATION: "/simulation",
  RESULTS: "/results",
  WHAT_IF: "/what-if",
  JOURNEY: "/journey",
} as const;

export interface NavItem {
  title: string;
  href: string;
  description: string;
  iconName: string;
  badge?: string;
}

export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    description: "Student profile, recommendations & active progress",
    iconName: "LayoutDashboard",
  },
  {
    title: "Explore Careers",
    href: ROUTES.EXPLORE,
    description: "Discover careers based on interests, academics & salaries",
    iconName: "Compass",
  },
  {
    title: "Experience Lab",
    href: ROUTES.EXPERIENCE,
    description: "Interactive real-world simulations of professions",
    iconName: "Gamepad2",
    badge: "Interactive",
  },
  {
    title: "What-If Simulator",
    href: ROUTES.WHAT_IF,
    description: "Test budget, academic & timeframe constraints",
    iconName: "Sliders",
  },
  {
    title: "Career Journey",
    href: ROUTES.JOURNEY,
    description: "Visualize pathways, milestones and decision matrix",
    iconName: "Milestone",
  },
] as const;

/**
 * Multi-Agent System Roles (FastAPI Backend Orchestrator)
 */
export const AGENT_ROLES = {
  CAREER: {
    id: "career",
    name: "Career Strategist Agent",
    color: "#4F46E5",
    focus: "Market outlook, skill relevancy, work-life balance, progression",
  },
  FUNDING: {
    id: "funding",
    name: "Financial & ROI Agent",
    color: "#0EA5E9",
    focus: "Tuition, debt-to-income, scholarship opportunities, expected ROI",
  },
  SIMULATION: {
    id: "simulation",
    name: "Experience Simulation Agent",
    color: "#16A34A",
    focus: "Real-world dilemmas, technical choices, stress & satisfaction",
  },
} as const;

/**
 * FastAPI Backend Endpoints
 */
export const API_ENDPOINTS = {
  CAREERS: "/api/careers",
  SIMULATIONS: "/api/simulations",
  SIMULATION_STEP: "/api/simulations/step",
  AGENT_DEBATE: "/api/agents/debate",
  WHAT_IF: "/api/what-if/simulate",
  PATHWAYS: "/api/pathways",
  USER_PROFILE: "/api/user/profile",
} as const;
