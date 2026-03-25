# Mental Ability Assessment System

## Overview
A comprehensive mental ability testing system integrated into SkillVista, featuring logical reasoning, aptitude, pattern recognition, and quantitative ability questions.

## Features Implemented

### 1. Database Schema
- **Question Model** (`src/models/Question.js`)
  - Supports mental_ability type questions
  - Categories: logical_reasoning, aptitude, pattern_recognition, quantitative
  - Difficulty levels: easy, medium, hard
  - Stores question text, options, and correct answers

- **MentalAbilityAttempt Model** (`src/models/MentalAbilityAttempt.js`)
  - Tracks user attempts with scores and percentages
  - Stores detailed answer records (selected vs correct)
  - Records time taken for each attempt
  - Links to User model via userId

### 2. API Routes
- `GET /api/questions?type=mental_ability&limit=15`
  - Fetches questions from database
  - Auto-seeds 15 questions if none exist
  - Shuffles questions for each request
  - Sanitizes response (removes correct answers)

- `POST /api/attempts`
  - Evaluates submitted answers
  - Calculates score and percentage
  - Compares with previous attempts
  - Returns improvement metrics

- `GET /api/attempts?userId={userId}`
  - Retrieves user's attempt history
  - Sorted by most recent first

- `GET /api/attempts/analytics?userId={userId}`
  - Provides performance analytics
  - Average, highest, lowest scores
  - Trend data for visualization

### 3. Pages
- **Assessment Hub** (`/assessment/hub`)
  - Overview of mental ability tests
  - Quick stats (latest score, average)
  - Start/retake test button
  - Attempt history with improvement indicators
  - Performance analytics dashboard

- **Mental Ability Test** (`/assessment/mental-ability`)
  - Interactive quiz interface
  - One question at a time
  - Previous/Next navigation
  - Question grid for quick navigation
  - Progress tracking
  - Timer display
  - Answer selection with visual feedback

### 4. Components
- **QuestionCard** - Displays question with radio-style options
- **ProgressBar** - Shows current progress and answered count
- **ResultSummary** - Displays score, performance message, improvement
- **AttemptHistory** - Lists previous attempts with dates and trends
- **Analytics** - Shows performance statistics
- **Timer** - Real-time elapsed time display

### 5. UI/UX Features
- Consistent with SkillVista design system
- Dark mode support
- Responsive layout (mobile-friendly)
- Visual feedback for selected answers
- Color-coded performance indicators
- Improvement tracking (trending up/down)
- Question navigation grid
- Confirmation for incomplete submissions

### 6. Question Bank
15 pre-seeded questions covering:
- Logical reasoning (syllogisms, coding-decoding)
- Pattern recognition (sequences, series)
- Quantitative ability (speed, percentage, profit/loss)
- Aptitude (age problems, work-time problems)

### 7. Navigation Integration
- Added "Mental Ability" link to dashboard sidebar
- Links to `/assessment/hub`

## Usage Flow

1. User navigates to Assessment Hub (`/assessment/hub`)
2. Views previous attempts and analytics (if any)
3. Clicks "Start Test" or "Retake Test"
4. Completes 15 questions with navigation
5. Submits test
6. Views results with improvement comparison
7. Can retake immediately or return to hub

## Technical Details

### Authentication
- Uses NextAuth with session-based auth
- All API routes protected
- User ID from session links attempts

### Database
- MongoDB with Mongoose ODM
- Reuses existing connection (`src/lib/db.js`)
- Proper indexing on userId and type fields

### State Management
- React hooks for local state
- No global state needed (isolated feature)

### Performance
- Questions shuffled server-side
- Efficient queries with lean()
- Minimal data transfer (sanitized responses)

## Future Enhancements
- Question difficulty adaptation
- Category-wise performance breakdown
- Timed test mode with countdown
- Detailed answer explanations
- More question categories
- Export results as PDF
- Leaderboard/rankings
