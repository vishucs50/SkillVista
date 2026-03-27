# SkillVista

SkillVista is a modern Next.js application that helps assess and surface employability skills, career readiness, and personalized learning actions for students and job seekers. It provides assessment workflows, results generation, user authentication, and an analytics/dashboard UI.

## Tech stack

- Next.js (App Router)
- React 19
- Tailwind CSS
- MongoDB (Mongoose)
- NextAuth for authentication
- Cloudinary for media uploads
- Zustand for state Management
- Google Generative AI client (Gemini integration)

## Key features

- **Multi-step assessment flow** with interactive stepper UI
- **User authentication** with NextAuth (Google OAuth, email/password)
- **Profile management** with image upload via Cloudinary
- **Comprehensive dashboard** with analytics:
  - Employability Index
  - Skill Aptitude Radar
  - Hiring Readiness Score
  - Critical Skill Gaps identification
  - Next Best Action recommendations
- **Skill Gap Analysis**:
  - Target role selection
  - Skill comparison against target roles
  - AI-powered gap analysis
- **GitHub Integration**:
  - Connect GitHub account for automated analysis
  - Repository and code analysis
  - Skill progress tracking through GitHub activity
- **Learning Path Generation**:
  - Personalized learning recommendations
  - Action plans with next steps
  - Resource suggestions for skill development
- **Assessment Results** with detailed performance analytics
- **Real-time synchronization** of assessment and results data

## Quick start

Prerequisites: Node.js 18+, npm (or pnpm/yarn), and access to a MongoDB instance.

1. Clone the repo

```bash
git clone https://github.com/vishucs50/SkillVista.git
cd SkillVista
```

2. Install dependencies

```bash
npm install
```

3. Create environment variables

Create a `.env.local` at the project root with the following required variables:

**Database:**
- `MONGODB_URI` — MongoDB connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/?appName=skillvista`)

**Authentication (NextAuth):**
- `NEXTAUTH_SECRET` — Random secret key for NextAuth encryption (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` — Base URL of your application (e.g., `http://localhost:3000` for dev, `https://yourdomain.com` for prod)
- `GOOGLE_CLIENT_ID` — From [Google Cloud Console](https://console.cloud.google.com)
- `GOOGLE_CLIENT_SECRET` — From Google Cloud Console
- `GITHUB_CLIENT_ID` — From [GitHub Developer Settings](https://github.com/settings/developers)
- `GITHUB_CLIENT_SECRET` — From GitHub Developer Settings

**Media Upload (Cloudinary):**
- `CLOUDINARY_CLOUD_NAME` — Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Your Cloudinary API key
- `CLOUDINARY_API_SECRET` — Your Cloudinary API secret

**AI & Analytics (Google Generative AI):**
- `GEMINI_API_KEY` — From [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Run development server

```bash
npm run dev
```

5. Build and start for production

```bash
npm run build
npm run start
```

6. Lint

```bash
npm run lint
```

## Project layout

- `src/app` — Next.js App Router pages & API routes:
  - `(auth)` — Login and registration pages
  - `(landing)` — Public landing page
  - `api` — Backend endpoints for auth, assessment, results, skill gap analysis, GitHub integration, and more
  - `assessment` — Multi-step assessment workflow
  - `dashboard` — Main analytics dashboard
  - `skill-gap` — Skill gap analysis & comparison page
  - `learning-path` — Personalized learning recommendations
  - `skill-progress` — GitHub-based progress tracking
- `src/components` — UI components organized by feature:
  - `assessment` — Assessment stepper components
  - `auth` — Login/register forms and logout button
  - `dashboard` — Dashboard widgets (EmployabilityIndex, HiringReadiness, SkillAptitudeRadar, etc.)
  - `skill-gap` — Analysis components (RoleSelector, SkillComparison, GithubAnalysis, ActionPlan)
  - `ui` — Reusable UI primitives (buttons, cards, inputs, etc.)
- `src/lib` — Helper utilities:
  - `db.js` — Database connection
  - `cloudinary.js` — Image upload integration
  - `github.js` — GitHub API integration
  - `gemini/` — Google Generative AI integration for analysis
  - `syncAssessment.js` — Assessment synchronization
  - `utils.js` — General utilities
- `src/models` — Mongoose schemas:
  - `Assessment.js` — Assessment data
  - `AssessmentResult.js` — Results and analytics
  - `SkillGapAnalysis.js` — Skill gap analysis data
  - `User.js` — User profile and settings
- `src/store` — Zustand state management stores for assessment, results, skill gap, and student data
## API routes

Server routes live under `src/app/api`:

- **Authentication** — NextAuth integration for Google OAuth and credentials
- **User management** — Profile retrieval and updates
- **Assessment** — Assessment data sync and retrieval
  - `POST /api/assessment/me` — Get user assessments
  - `POST /api/assessment/sync` — Synchronize assessment data
- **Results** — Assessment result generation and queries
  - `POST /api/results/generate` — Generate results with AI analysis
  - `GET /api/results/me` — Get user results
- **Skill Gap Analysis** — Analyze skills gap for target roles
  - `POST /api/skill-gap/analyze` — Run skill gap analysis
  - `GET /api/skill-gap/history` — Get analysis history
- **GitHub Integration** — Connect and analyze GitHub repositories
  - `GET /api/github/connect` — Check connection status
  - `POST /api/github/connect` — Initiate GitHub authentication
  - `POST /api/github/analyze` — Analyze repositories and code
- **Upload** — Media file uploads to Cloudinary
  - `POST /api/upload` — Upload profile images
- **Registration** — User registration flow
  - `POST /api/register` — Register new user account

## Main Pages

- **Landing Page** — Public homepage with feature overview
- **Assessment** — Multi-step skill assessment questionnaire
- **Dashboard** — Comprehensive analytics and insights:
  - Employability score
  - Skill strengths and weaknesses
  - Hiring readiness assessment
  - Recommended next actions
- **Skill Gap Analysis** — Identify gaps for target roles:
  - Select target job roles
  - Compare current skills vs required
  - AI-powered gap analysis
  - View actionable recommendations
- **Learning Path** — Personalized learning recommendations based on skill gaps
- **Skill Progress** — Track progress via GitHub integration:
  - Connect GitHub account
  - Analyze repositories
  - Monitor skill development

## Deployment

This app is ready for Vercel or any Node.js/Next.js hosting. Ensure environment variables are configured in the target environment.

hello world

