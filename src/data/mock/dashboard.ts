export interface DashboardData {
  greeting: {
    heading: string;
    subheading: string;
    supportingText: string;
    ctaText: string;
    ctaHref: string;
  };
  continueExperience: {
    id: string;
    careerTitle: string;
    scenarioTitle: string;
    description: string;
    progressPercentage: number;
    estimatedMinutesRemaining: number;
    href: string;
  };
  journeyStats: {
    careersExplored: number;
    experiencesCompleted: number;
    pathwaysCompared: number;
  };
  careersWorthExploring: Array<{
    id: string;
    title: string;
    category: string;
    discipline: string;
    description: string;
    skills: string[];
    iconName: "Terminal" | "Scale" | "Rocket" | "Palette";
    href: string;
  }>;
  pathwayPreview: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
    branches: Array<{
      id: string;
      category: "education" | "skills" | "career";
      stepLabel: string;
      title: string;
      subtitle: string;
    }>;
  };
}

export const MOCK_DASHBOARD_DATA: DashboardData = {
  greeting: {
    heading: "Good afternoon.",
    subheading: "Let's explore what comes next.",
    supportingText:
      "Discover careers, experience different professions, and understand the paths that can lead you there.",
    ctaText: "Explore Careers",
    ctaHref: "/explore",
  },
  continueExperience: {
    id: "sim-swe-incident",
    careerTitle: "Software Engineering",
    scenarioTitle: "Production Incident",
    description:
      "Continue your interactive experience and see how you handle a real-world engineering scenario.",
    progressPercentage: 72,
    estimatedMinutesRemaining: 4,
    href: "/experience?career=software-engineer",
  },
  journeyStats: {
    careersExplored: 4,
    experiencesCompleted: 2,
    pathwaysCompared: 3,
  },
  careersWorthExploring: [
    {
      id: "software-engineering",
      title: "Software Engineering",
      category: "Technology · Problem Solving",
      discipline: "Tech",
      description:
        "Build digital systems and solve infrastructure challenges. Design reliable software, write clean code, and collaborate with engineering teams.",
      skills: ["System Architecture", "Algorithmic Logic", "Cloud Infrastructure"],
      iconName: "Terminal",
      href: "/explore?career=software-engineer",
    },
    {
      id: "law",
      title: "Law",
      category: "Reasoning · Communication",
      discipline: "Humanities",
      description:
        "Analyze cases, advise organizations, and defend rights. Structure legal contracts, review precedents, and navigate regulatory frameworks.",
      skills: ["Legal Research", "Strategic Negotiation", "Contract Analysis"],
      iconName: "Scale",
      href: "/explore?career=corporate-lawyer",
    },
    {
      id: "entrepreneurship",
      title: "Entrepreneurship",
      category: "Strategy · Business",
      discipline: "Business",
      description:
        "Turn ideas into viable, sustainable ventures. Master cash flow planning, customer validation, product-market discovery, and resilient leadership.",
      skills: ["Financial Planning", "Go-To-Market", "Resource Allocation"],
      iconName: "Rocket",
      href: "/explore?career=tech-founder",
    },
    {
      id: "product-design",
      title: "Product Design",
      category: "Creativity · User Experience",
      discipline: "Design",
      description:
        "Translate user needs into intuitive digital solutions. Conduct user empathy research, create interactive prototypes, and establish scalable design systems.",
      skills: ["User Empathy Research", "Interactive Prototyping", "Design Systems"],
      iconName: "Palette",
      href: "/explore?career=product-design",
    },
  ],
  pathwayPreview: {
    title: "Explore Your Possible Paths",
    subtitle:
      "See how education choices, skills and different decisions can lead to different career outcomes.",
    ctaText: "View Career Map",
    ctaHref: "/journey",
    branches: [
      {
        id: "step-1",
        category: "education",
        stepLabel: "01. Education Foundation",
        title: "B.S. in Computer Science or STEM",
        subtitle: "Core analytical & quantitative coursework (4 Yrs)",
      },
      {
        id: "step-2",
        category: "skills",
        stepLabel: "02. Core Capabilities",
        title: "Distributed Systems & Cloud",
        subtitle: "Full-stack development, algorithms, system design",
      },
      {
        id: "step-3",
        category: "career",
        stepLabel: "03. Career Outcome",
        title: "Senior Software Architect / Tech Lead",
        subtitle: "High impact technical leadership ($130k–$195k+)",
      },
    ],
  },
};
