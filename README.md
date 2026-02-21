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

- Multi-step assessment flow with stepper UI
- User registration & login (NextAuth)
- Upload and manage profile Images via Cloudinary
- Generate assessment results and dashboards
- API routes for syncing assessments and results

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

Create a `.env.local` at the project root with required variables. Inspect `src/lib` and `src/app/api` for the exact variables your setup needs (examples below).

Common variables to provide:

- `MONGODB_URI` — MongoDB connection string
- `NEXTAUTH_SECRET` — NextAuth secret key
- `NEXTAUTH_URL` — base URL (e.g. `http://localhost:3000`)
- `GOOGLE_CLIENT_ID`=from google cloud console
- `GOOGLE_CLIENT_SECRET`=from google cloud console
- Cloudinary credentials 
- Any provider/API keys (e.g. generative AI)

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

- `src/app` — Next.js App Router pages & API routes
- `src/components` — UI components and stepper steps
- `src/lib` — helpers: `db.js`, `cloudinary.js`, `utils.js`, gemini helpers
- `src/models` — Mongoose models
- `src/store` — Zustand stores for assessment/result state
## API routes

Server routes live under `src/app/api`. Important endpoints include authentication, registration, upload, assessment sync, and result generation.

## Deployment

This app is ready for Vercel or any Node.js/Next.js hosting. Ensure environment variables are configured in the target environment.



