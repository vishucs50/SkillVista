# SkillVista

SkillVista is a modern Next.js application that helps assess and surface employability skills, career readiness, and personalized learning actions for students and job seekers. It provides assessment workflows, results generation, user authentication, and an analytics/dashboard UI.

## Tech Stack

- **Frontend**: Next.js (App Router), React 19, Tailwind CSS
- **Backend**: Node.js with Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **Authentication**: NextAuth (Google OAuth, email/password)
- **Media**: Cloudinary for image uploads
- **State Management**: Zustand
- **AI**: Google Generative AI (Gemini integration)


## Key Features

- **Multi-step Assessment Flow** - Interactive stepper UI for comprehensive skill assessment
- **User Authentication** - NextAuth integration with Google OAuth and email/password options
- **Profile Management** - Upload and manage profile images via Cloudinary
- **Comprehensive Dashboard** - Advanced analytics including:
  - Employability Index
  - Skill Aptitude Radar
  - Hiring Readiness Score
  - Critical Skill Gaps identification
  - Next Best Action recommendations
- **Skill Gap Analysis** - Compare current skills against target job roles with AI-powered insights
- **GitHub Integration** - Connect GitHub account for automated code and repository analysis
- **Learning Path Generation** - Personalized learning recommendations and action plans
- **Assessment Results** - Detailed performance analytics and insights
- **Real-time Synchronization** - Instant syncing of assessment and results data

## Quick Start

**Prerequisites**: Node.js 18+, npm (or pnpm/yarn), and MongoDB access

### 1. Clone the Repository
```bash
git clone https://github.com/vishucs50/SkillVista.git
cd SkillVista
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root with these variables:

**Database:**
- `MONGODB_URI` — MongoDB connection string

**Authentication (NextAuth):**
- `NEXTAUTH_SECRET` — Random secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` — Application base URL (e.g., `http://localhost:3000`)
- `GOOGLE_CLIENT_ID` — From [Google Cloud Console](https://console.cloud.google.com)
- `GOOGLE_CLIENT_SECRET` — From Google Cloud Console
- `GITHUB_CLIENT_ID` — From [GitHub Developer Settings](https://github.com/settings/developers)
- `GITHUB_CLIENT_SECRET` — From GitHub Developer Settings

**Media Upload (Cloudinary):**
- `CLOUDINARY_CLOUD_NAME` — Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Your Cloudinary API key
- `CLOUDINARY_API_SECRET` — Your Cloudinary API secret

**AI & Analytics:**
- `GEMINI_API_KEY` — From [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm run start
```

### 6. Lint Code
```bash
npm run lint
```

## Project Structure

### `/src/app` — Next.js App Router
- `(auth)` — Authentication pages (login, registration)
- `(landing)` — Public landing page
- `api` — Backend API endpoints
- `assessment` — Multi-step assessment workflow
- `dashboard` — Main analytics dashboard
- `skill-gap` — Skill gap analysis interface
- `learning-path` — Learning recommendations
- `skill-progress` — GitHub-based progress tracking

### `/src/components` — UI Components
- `assessment` — Assessment UI components
- `auth` — Login/registration forms
- `dashboard` — Dashboard widgets and charts
- `skill-gap` — Analysis and comparison components
- `ui` — Reusable UI primitives

### `/src/lib` — Utilities & Integrations
- `db.js` — MongoDB connection
- `cloudinary.js` — Image upload handling
- `github.js` — GitHub API integration
- `gemini/` — Google Generative AI integration
- `syncAssessment.js` — Assessment data sync
- `utils.js` — General utilities

### `/src/models` — Database Schemas
- `Assessment.js` — Assessment data
- `AssessmentResult.js` — Results and analytics
- `SkillGapAnalysis.js` — Gap analysis data
- `User.js` — User profiles

### `/src/store` — State Management
- Zustand stores for assessment, results, skill gap analysis, and student data

## API Routes

All API routes are located under `/src/app/api`:

**Authentication:**
- NextAuth integration for Google OAuth and credentials

**Assessment:**
- `POST /api/assessment/me` — Get user assessments
- `POST /api/assessment/sync` — Sync assessment data

**Results:**
- `POST /api/results/generate` — Generate results with AI analysis
- `GET /api/results/me` — Retrieve user results

**Skill Gap Analysis:**
- `POST /api/skill-gap/analyze` — Analyze skill gaps
- `GET /api/skill-gap/history` — Get analysis history

**GitHub Integration:**
- `GET /api/github/connect` — Check connection status
- `POST /api/github/connect` — Initiate GitHub authentication
- `POST /api/github/analyze` — Analyze repositories

**Media:**
- `POST /api/upload` — Upload profile images

**User Management:**
- `POST /api/register` — Register new user account
- Profile retrieval and updates

## Main Pages

- **Landing Page** — Feature overview and call-to-action
- **Assessment** — Multi-step skill questionnaire
- **Dashboard** — Comprehensive analytics and insights
- **Skill Gap Analysis** — Identify and compare skill gaps for target roles
- **Learning Path** — Personalized recommendations based on gaps
- **Skill Progress** — GitHub-based progress tracking

## Deployment

SkillVista is ready for deployment on Vercel or any Node.js/Next.js hosting platform. Ensure all environment variables are properly configured in your deployment environment.

