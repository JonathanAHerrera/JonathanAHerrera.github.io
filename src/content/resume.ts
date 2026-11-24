export type LongitudeLatitude = [longitude: number, latitude: number];

export type ResumeLocation = {
  name: string;
  coordinates: LongitudeLatitude;
};

/** "Month Year" or "Present" exactly as the CV prints it. */
export type ResumeDate = string;

export type ResumeDateRange = {
  start: ResumeDate;
  end: ResumeDate;
};

/** One CV bullet. `emphasizedPhrases` are the substrings the PDF sets in bold, each appearing verbatim in `text`. */
export type ResumeBullet = {
  text: string;
  emphasizedPhrases: string[];
};

export type ResumeContactLinks = {
  email: string;
  emailUrl: string;
  linkedInHandle: string;
  linkedInUrl: string;
  gitHubHandle: string;
  gitHubUrl: string;
};

export type ResumeEducation = {
  institution: string;
  degree: string;
  minor: string;
  gpa: string;
  dates: ResumeDateRange;
  location: ResumeLocation;
};

export type ResumeExperience = {
  id: string;
  organization: string;
  role: string;
  dates: ResumeDateRange;
  location: ResumeLocation;
  bullets: ResumeBullet[];
};

export type ResumeTeachingExperience = Omit<ResumeExperience, "dates"> & {
  /** The PDF still has "Month Year – Month Year" placeholders here. */
  dates: ResumeDateRange | null;
};

export type ResumeProject = {
  id: string;
  name: string;
  /** The italic tag after the name in the PDF: stack or focus area. */
  technologies: string[];
  dates: { start: ResumeDate; end: ResumeDate | null };
  bullets: ResumeBullet[];
};

export type ResumeSkillGroup = {
  label: string;
  items: string[];
};

export type Resume = {
  name: string;
  contact: ResumeContactLinks;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  leadership: ResumeExperience[];
  teaching: ResumeTeachingExperience[];
  projects: ResumeProject[];
  skills: ResumeSkillGroup[];
  interests: string[];
};

const AUSTIN_TX: ResumeLocation = { name: "Austin, TX", coordinates: [-97.7431, 30.2672] };
const COLLEGE_STATION_TX: ResumeLocation = { name: "College Station, TX", coordinates: [-96.3344, 30.628] };
const OKLAHOMA_CITY_OK: ResumeLocation = { name: "Oklahoma City, OK", coordinates: [-97.5164, 35.4676] };

export const RESUME_LOCATIONS = {
  austin: AUSTIN_TX,
  collegeStation: COLLEGE_STATION_TX,
  oklahomaCity: OKLAHOMA_CITY_OK,
} as const;

export const resume: Resume = {
  name: "Jonathan Herrera",
  contact: {
    email: "jonathan.a.herrera0@gmail.com",
    emailUrl: "mailto:jonathan.a.herrera0@gmail.com",
    linkedInHandle: "JonathanAHerrera",
    // URLs are the PDF's own link annotations, lowercase as written there.
    linkedInUrl: "https://linkedin.com/in/jonathanaherrera",
    gitHubHandle: "JonathanAHerrera",
    gitHubUrl: "https://github.com/jonathanaherrera",
  },
  education: [
    {
      institution: "Texas A&M University",
      degree: "Bachelor of Science in Computer Science",
      minor: "Music",
      gpa: "3.7",
      dates: { start: "Aug 2022", end: "Dec 2026" },
      location: COLLEGE_STATION_TX,
    },
  ],
  experience: [
    {
      id: "bumble",
      organization: "Bumble",
      role: "Software Engineering Intern",
      dates: { start: "May 2026", end: "Aug 2026" },
      location: AUSTIN_TX,
      bullets: [
        {
          text: "Built an agentic Slack bot (Slack API, FastAPI, Claude) that monitored the bug-report channel, generated tickets, researched root causes against internal docs, and opened draft fixes with reports on GitHub for review.",
          emphasizedPhrases: ["(Slack API, FastAPI, Claude)"],
        },
        {
          text: "Served as sole QA owner for the launch of Plans, a new Bumble product, surfacing 40+ pre-release bugs and fixing 15; cut the app’s QA cycle from 60 to 40 minutes with AI-generated per-ticket test guides.",
          emphasizedPhrases: ["40+ pre-release bugs and fixing 15", "60 to 40 minutes"],
        },
        {
          text: "Shipped 18 tickets across 3 codebases (TypeScript, Swift, Kotlin, Go) in 9 weeks, spanning retention notifications, Android-to-iOS feature parity, security fixes, and user analytics.",
          emphasizedPhrases: ["18 tickets across 3 codebases (TypeScript, Swift, Kotlin, Go)"],
        },
      ],
    },
    {
      id: "encando-ai",
      organization: "Encando AI",
      role: "Software Engineer",
      dates: { start: "Oct 2024", end: "Sep 2026" },
      location: COLLEGE_STATION_TX,
      bullets: [
        {
          text: "Engineered a fullstack AI learning platform with FastAPI + Next.js + MongoDB, deployed on AWS (EC2, S3), integrating LLM-powered tutors into a web platform for 700+ students at Texas A&M and UT Austin.",
          emphasizedPhrases: ["FastAPI + Next.js + MongoDB, deployed on AWS (EC2, S3)"],
        },
        {
          text: "Developed a Retrieval-Augmented Generation (RAG) pipeline using Langchain, Pinecone, and Google AI SDK, allowing for semantic search over instructor-uploaded documents and transcripts for context-aware answers.",
          emphasizedPhrases: ["Retrieval-Augmented Generation (RAG)", "Langchain", "Pinecone", "Google AI SDK"],
        },
        {
          text: "Iterated rapidly in a startup environment, leveraging AI-assisted coding tools (Cursor, ChatGPT) to ship AI features in under 2 weeks, and refining LLMs through user feedback and prompt engineering.",
          emphasizedPhrases: ["AI-assisted coding tools (Cursor, ChatGPT)", "user feedback and prompt engineering"],
        },
      ],
    },
    {
      id: "paycom",
      organization: "Paycom",
      role: "Software Engineering Intern",
      dates: { start: "May 2025", end: "Aug 2025" },
      location: OKLAHOMA_CITY_OK,
      bullets: [
        {
          text: "Built a Two-Tower Neural Network recommendation engine (TensorFlow, PyTorch, Scikit-learn) for Paycom’s payroll/HR platform, serving results through low-latency FastAPI endpoints, validated against internal heuristics.",
          emphasizedPhrases: ["TensorFlow, PyTorch, Scikit-learn"],
        },
        {
          text: "Built an end-to-end ML pipeline, including ingestion, training, and deployment on Docker + Kubernetes, with automated retraining and performance monitoring, at an S&P 500 payroll fintech.",
          emphasizedPhrases: ["Docker + Kubernetes", "automated retraining and performance monitoring"],
        },
      ],
    },
    {
      id: "tamu-ml-research",
      organization: "Texas A&M University",
      role: "Undergraduate ML Research Assistant",
      dates: { start: "Jan 2024", end: "Dec 2024" },
      location: COLLEGE_STATION_TX,
      bullets: [
        {
          text: "Built data pipelines with Python scrapers and embedded C++ motion sensors for fall-risk research, and led a team of 4 to automate pre-processing for the ML pipeline, cutting the project timeline by 17%.",
          emphasizedPhrases: ["Python scrapers and embedded C++ motion sensors", "led a team of 4"],
        },
      ],
    },
  ],
  leadership: [
    {
      id: "tamu-datathon",
      organization: "Texas A&M University",
      role: "TAMU Datathon Vice President",
      dates: { start: "Jan 2024", end: "Present" },
      location: COLLEGE_STATION_TX,
      bullets: [
        {
          text: "Directed a 40+ member team to organize Texas A&M’s first data science hackathon for over 450 participants.",
          emphasizedPhrases: ["Directed a 40+ member team"],
        },
        {
          text: "Designed the participant experience by managing workshops, fun mini-events, and judging for 100+ projects.",
          emphasizedPhrases: [],
        },
        {
          text: "Mentored 10+ teams in Pandas, NumPy, Scikit-Learn, and PyTorch, resulting in 2 top-5 placements.",
          emphasizedPhrases: ["Pandas", "NumPy", "Scikit-Learn", "PyTorch", "2 top-5 placements."],
        },
      ],
    },
  ],
  teaching: [
    {
      id: "tamu-peer-teacher",
      organization: "Texas A&M University",
      role: "Peer Teacher, CSCE 102 & CSCE 217",
      dates: null,
      location: COLLEGE_STATION_TX,
      bullets: [
        {
          text: "Supported students in CSCE 102 and CSCE 217 through lab sessions and office hours, explaining course programming concepts and assisting students in developing the skills necessary to think in systems.",
          emphasizedPhrases: ["CSCE 102", "CSCE 217"],
        },
        {
          text: "Worked with the course instructor to identify common points of confusion and analyzed student data to improve test making strategies and grading systems.",
          emphasizedPhrases: [],
        },
      ],
    },
  ],
  projects: [
    {
      id: "hopamine",
      name: "Hopamine",
      technologies: ["TypeScript", "Next.js", "Convex", "Figma"],
      dates: { start: "2026", end: "Present" },
      bullets: [
        {
          text: "Building Hopamine, a solarpunk social platform with profiles, collectible stamps, and community events.",
          emphasizedPhrases: ["Hopamine"],
        },
        {
          text: "Own the production backend end-to-end on Convex for ~200 active users: built real-time presence and live event feeds, monitor uptime, triage incidents, and ship fixes within hours of user reports.",
          emphasizedPhrases: ["Convex", "~200 active users", "real-time presence and live event feeds"],
        },
      ],
    },
    {
      id: "websocket-server",
      name: "WebSocket Server",
      technologies: ["Zig"],
      dates: { start: "2026", end: null },
      bullets: [
        {
          text: "Implemented a WebSocket server from scratch in Zig as a low-level systems project, whilst validating the implementation against the Autobahn conformance test suite",
          emphasizedPhrases: ["WebSocket server from scratch", "Autobahn"],
        },
      ],
    },
    {
      id: "vita-ai",
      name: "Vita AI",
      technologies: ["RAG & Agent Architecture"],
      dates: { start: "2026", end: null },
      bullets: [
        {
          text: "Designed the retrieval and memory architecture for a personalized nutrition chatbot, weighing tradeoffs between always-injected user context and agent-invoked retrieval tools.",
          emphasizedPhrases: ["retrieval and memory architecture", "agent-invoked retrieval tools"],
        },
        {
          text: "Added semantic long-term memory and an evaluator loop to check responses against user diet.",
          emphasizedPhrases: ["semantic long-term memory", "evaluator loop"],
        },
      ],
    },
    {
      id: "developer-news-agent",
      name: "Developer News Agent",
      technologies: ["Python", "Claude API"],
      dates: { start: "2026", end: null },
      bullets: [
        {
          text: "Built an agent on raw Anthropic tool use, with no framework, that gathers and assembles a personalized developer news feed focused on learning developer preferences and finding unique news databases.",
          emphasizedPhrases: ["raw Anthropic tool use, with no framework"],
        },
      ],
    },
  ],
  skills: [
    {
      label: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "Go", "Swift", "Kotlin", "C/C++", "SQL", "HTML/CSS"],
    },
    {
      label: "Frameworks & Libraries",
      items: ["React", "Next.js", "Node.js", "FastAPI", "Tailwind", "LangChain", "PyTorch", "TensorFlow"],
    },
    {
      label: "Tools & Infra",
      items: ["AWS (EC2, S3)", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Pinecone", "Git", "Jira", "Linux", "Convex"],
    },
    {
      label: "Coursework",
      items: ["Data Structures & Algorithms", "Networking", "Operating Systems", "Software Engineering"],
    },
    {
      label: "Additional Skills",
      items: ["Agile/Scrum", "Technical Writing", "System Design", "Test-Driven Development", "CI/CD"],
    },
  ],
  interests: ["UI/UX Design", "Fashion Design", "Cooking", "Crocheting", "Poetry"],
};

