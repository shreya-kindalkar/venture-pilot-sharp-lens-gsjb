# VenturePilot

A startup validation dashboard powered by a 5-agent AI pipeline. Paste in your startup idea and get back a full analysis — user personas, behavior simulations, problem detection, go-to-market strategies, and a scored summary.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

---

## What it does

Submit a startup idea and the app runs it through a multi-agent pipeline:

| Stage | Agent | Output |
|---|---|---|
| 1 | **PersonaSim** | 5 detailed user personas |
| 2 | **BehaviorSim** | Per-persona adoption simulations |
| 3 | **ProblemDetect** | Critical problems and friction points |
| 4 | **Strategy** | Prioritized go-to-market strategies |
| 5 | **Scoring** | Idea score, adoption probability, risk score |

Results can be saved to a database, downloaded as a text report, or copied to clipboard.

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Lyzr](https://lyzr.ai) API key
- (Optional) MongoDB connection string for saving analyses

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
# Required — get yours at lyzr.ai
LYZR_API_KEY=your-lyzr-api-key-here

# Optional — pre-configured agent ID
AGENT_ID=69ec739f2d2419110b70f24f

# Optional — enables saving analyses to MongoDB
DATABASE_URL=mongodb://...
APP_JWT_SECRET=your-jwt-secret
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) in your browser.

---

## Project structure

```
app/
  page.tsx              # Main app shell and state management
  sections/             # Page-level UI sections
    InputSection.tsx    # Idea input form
    OverviewSection.tsx # Scores and summary
    PersonasSection.tsx # User persona cards
    SimulationsSection.tsx # Behavior simulation results
    ProblemsSection.tsx # Detected problems
    StrategiesSection.tsx  # Recommended strategies
    NavigationBar.tsx   # Tab nav and action buttons
    LoadingOverlay.tsx  # Analysis progress screen
    AuthScreen.tsx      # Login / register
    SavedAnalyses.tsx   # Saved analysis panel
  api/
    agent/              # Lyzr agent proxy
    analyses/           # Save / load / delete analyses
    auth/               # Login, register, logout, me
    upload/             # File upload for AI analysis
    rag/                # RAG knowledge base operations
    scheduler/          # Scheduled agent runs
lib/
  aiAgent.ts            # callAIAgent() and file upload helpers
  ragKnowledgeBase.ts   # RAG document management
  scheduler.ts          # Schedule management
  clipboard.ts          # iframe-safe clipboard utility
models/
  Analysis.ts           # MongoDB analysis model
response_schemas/       # Agent response shape definitions
```

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack on port 3333 |
| `npm run build` | Production build |
| `npm run start` | Start production server on port 3333 |
| `npm run lint` | Run ESLint |

---

## Tech stack

- **Framework** — Next.js 14 (App Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS + shadcn/ui
- **AI** — Lyzr multi-agent pipeline (GPT-4.1 manager + Claude Sonnet sub-agents)
- **Database / Auth** — MongoDB via `lyzr-architect` with built-in RLS
- **Deployment** — Netlify (configured via `netlify.toml`)

---

## Deployment

The project includes a `netlify.toml` and `Dockerfile` for flexible deployment.

**Netlify (recommended):**
1. Connect your repo in the Netlify dashboard
2. Add environment variables (`LYZR_API_KEY`, `DATABASE_URL`, `APP_JWT_SECRET`)
3. Deploy — the `@netlify/plugin-nextjs` plugin handles the rest

**Docker:**
```bash
docker build -t venturepilot .
docker run -p 3333:3333 --env-file .env.local venturepilot
```
