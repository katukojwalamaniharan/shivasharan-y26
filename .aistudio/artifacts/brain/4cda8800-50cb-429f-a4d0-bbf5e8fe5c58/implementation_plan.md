# FAANG Path: 2-Year DSA, CS Fundamentals & Resource Mastery Hub

A dedicated, full-stack developer study workspace and mentorship platform built to guide your brother from his Semester 1 Java & DSA foundation (Oct 2026 – Apr 2027) through Semester 4 FAANG internship readiness, complete with real-time progress analytics and role-based resource management.

## User Review & Critical Decisions

> [!IMPORTANT]
> All core product preferences from our planning discussion have been locked in below. Review the architecture and click **Proceed** when you are ready to provision the database and build the platform.

- **Confirmed Decision — DSA Problem Tracker & 7-Day Spaced Repetition**: Pre-loaded with the complete **NeetCode 150** curriculum organized by pattern, plus a custom problem logger for Striver A2Z / LeetCode contests. Solving any problem automatically schedules a **7-Day Cold Re-Solve** reminder in the Revision Queue.
- **Confirmed Decision — 4-Semester FAANG Roadmap**: Includes the exact checkboxes, weekly routine, and Month 1–6 milestones from your uploaded **Oct 2026 – Apr 2027 Foundation Roadmap**, seamlessly extended into **Semesters 2–4** (Graphs, Dynamic Programming, Tries, OS, DBMS, Computer Networks, Low-Level Design, and FAANG Mock Interviews).
- **Confirmed Decision — Spoken Explanations & Pattern Notes**: Features an in-browser **2-Minute Voice Explanation Recorder** (record, listen back, and log clarity ratings) alongside a structured **DSA Pattern Notes Editor** so he masters thinking aloud during interviews.
- **Confirmed Decision — Focused Dark Developer Workspace**: Engineered with a high-contrast dark slate canvas, `JetBrains Mono` tabular metrics, a 365-day GitHub-style consistency heatmap, and an **Exam Week Light Mode** toggle that recalibrates daily targets to 30–45 minutes of revision.
- **Confirmed Decision — Admin & User Permission Model**: Google Sign-In automatically elevates `katukojwalamaniharanchary@gmail.com` as Super Admin with full privileges to create/edit/delete resources, grant resource-editing rights (`canEditResources`) to your brother or other users, and inspect student progress dashboards.

---

## 1. Overview & Core Concept

- **What It Does**: Unifies your uploaded roadmaps, resource sheets, and study rules into an interactive daily command center. It eliminates resource overload ("Quality over Quantity") by surfacing the exact current month's checklist, primary vs. parked resources, daily routine splits (Mon–Fri 1h Learn / 45m DSA / 15m Aptitude; Sat 3h Pattern + 2h Project; Sun Revision & Spoken Explanations), and spaced-repetition problem queues.
- **Target Audience / Persona**:
  - **Primary Learner (Your Brother)**: Tracks daily routine tasks, solves and revises NeetCode 150 / Striver problems, records 2-minute spoken explanations, writes pattern notes, and tracks CS Fundamentals & Aptitude.
  - **Admin / Mentor (You — `katukojwalamaniharanchary@gmail.com`)**: Curates and updates the resource library, promotes/parks study materials, manages user roles and edit permissions, logs mock interview feedback, and monitors his consistency and velocity through live analytics.
- **Key Value**: Transforms static PDF/CSV roadmaps into an accountable, measurable system that enforces the **25–30 Minute Solo Rule**, the **7-Day Re-Solve Rule**, and **Spoken Interview Articulation**.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Daily Command Center & Routine Check-In**:
   - Upon signing in with Google, the learner lands on the **Analytics & Daily Hub**.
   - A prominent **Weekly Routine & Mode Bar** displays today's prescribed block (e.g., Weekday: *1 hr Learn · 45 min Problems · 15 min Aptitude* or Sunday: *Re-solve last week's problems · Explain 2 aloud · Plan next week*).
   - Toggling **Exam Week Light Mode** switches the daily objective to *30–45 min old problem revision only (zero new topics)* and highlights due revision items.
2. **4-Semester Interactive Roadmap (Oct 2026 – Oct 2028)**:
   - Switch between **Sem 1 (Months 1–6 Foundation)**, **Sem 2 (Advanced DSA + OS/DBMS)**, **Sem 3 (CN, LLD & Projects)**, and **Sem 4 (FAANG Prep & Mocks)**.
   - Check off granular tasks (e.g., *Week 1 Java Check: FizzBuzz, reverse array, class with constructor*, *Finish Abdul Bari course*, *Project 1 Java console app*, *Checkpoint: 80 problems*) with progress bars per month and open-item trackers (*Sem-1 exam dates*, *Weekday/weekend hours*, *Week 1 Java check result*).
3. **DSA Mastery Tracker & 7-Day Revision Queue**:
   - Filter the pre-loaded **NeetCode 150** bank or custom logged problems by pattern (*Arrays & Hashing*, *Two Pointers*, *Sliding Window*, *Binary Search*, *Stack*, *Linked List*, *Trees*, *Graphs*, *Dynamic Programming*), difficulty, and status (*Unsolved*, *Solved — Pending 7-Day Review*, *Re-Solved Cold*, *Needs Hint*).
   - Built-in **25–30 Min Solo Timer** at the top of the workspace helps enforce the rule of trying alone before checking a hint.
   - Marking a problem *Solved* sets `nextReviewDate = +7 days`. When due, it automatically surfaces in the **7-Day Re-Solve Queue** until completed cold without hints.
4. **Spoken Explanation Studio & Pattern Notes**:
   - Select any DSA pattern or problem to write a concise **Pattern Note** (trigger conditions, template complexity, key edge cases).
   - Launch the **2-Minute Spoken Explanation Recorder** using the browser's microphone (`MediaRecorder`), complete with a 120-second countdown, live waveform indicator, instant audio playback for self-review, and a one-click log to track weekly recorded explanations.
5. **Searchable Resource Library & Admin Controls**:
   - Pre-populated with all resources from your CSV and PDFs (*MOOC.fi Java*, *Abdul Bari Udemy*, *NeetCode 150*, *Striver A2Z Sheet*, *Codolio Tracker*, *Learn Git Branching*, *MIT Missing Semester*, *Scrimba HTML/CSS*, *IndiaBix*, *Tech Interview Handbook*, *Sean Prashad Patterns*, *AlgoMonster*, etc.).
   - Instant search and segmented filtering by **Category** (*Java*, *DSA*, *CS Fundamentals*, *Aptitude & Logic*, *Git & Shell*, *Web Dev*, *Handbooks & Tracking*) and **Priority** (*Primary / High*, *Reference*, *Optional*, *Parked Until Month 6*).
   - Users with Admin or granted `canEditResources` privileges can add new resources, edit recommendations/notes, or move items from *Parked* to *Active*.
6. **CS Fundamentals & Aptitude Tracker**:
   - Dedicated view for college syllabus alignment (*Programming & Data Structures*, *Discrete Maths & Logic*, *Operating Systems*, *DBMS*, *Computer Networks*) and the *IndiaBix 15-min 4x/week + Weekly Paper Puzzle* streak tracker.
7. **Admin User & Analytics Management Console**:
   - Accessible to `katukojwalamaniharanchary@gmail.com` (and any promoted admins).
   - View all registered users, toggle their **Can Edit Resources** permission or **Admin** role, inspect any learner's detailed analytics dashboard, and record **Mock Interview Evaluations** (Month 6 checkpoint).

### Visual Identity & Theme
- **Aesthetic Direction**: High-precision Developer Workspace & Telemetry Console (inspired by Linear and GitHub Dark).
- **Color Palette & Mood (60-30-10 Discipline)**:
  - *60% Dominant Canvas*: Deep Obsidian Slate (`#0B0F17` primary canvas, `#111827` structural sidebar).
  - *30% Structural Surfaces*: Elevated Slate panels (`#1E293B` with `1px solid rgba(255,255,255,0.08)` hairline dividers) and crisp slate typography (`#F8FAFC` primary, `#94A3B8` muted).
  - *10% Semantic Accents*: Focused Indigo (`#6366F1`) for primary actions and active states; Emerald (`#10B981`) for mastered/re-solved items; Amber (`#F59E0B`) for due 7-day revisions and Exam Light Mode; Rose (`#F43F5E`) for overdue reviews.
- **Typography & Hierarchy**:
  - *Display & Navigation*: `Plus Jakarta Sans` (SemiBold/Bold, tight tracking) for section headers and milestone titles.
  - *Body & Documentation*: `DM Sans` (Regular/Medium) for clean scannability across roadmap checklists, resource recommendations, and pattern notes.
  - *Metrics, Timers & Code*: `JetBrains Mono` with `tabular-nums` for problem counters, 30-minute solo timers, 7-day countdowns, and analytics percentages.
- **Component Styling & Layout**:
  - Full 1440px desktop presence with a fixed 260px left navigation rail, top contextual header following the strict 3-zone contract, and single-elevation data grids.
  - Zero static pill clutter: resource metadata (category, priority, status) is rendered as clean inline text with `·` separators, while interactive filter bars use tactile segmented buttons.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Enforcing "Focus Over Overload" in the Resource Library**
  - *Chosen Approach*: Resources are grouped into **Primary Active Curriculum** (the core 7 resources prescribed for Months 1–6) versus **Reference & Parked Until Month 6** (extra sheets like Rising Brain, Apna College, CodeChef, CS50).
  - *Why*: Your roadmap explicitly warns against duplicating sheets in Sem 1. Separating primary vs. parked resources keeps your brother laser-focused while preserving every link you collected for later stages.
- **Decision 2: Cloud Persistence + Real-Time Multi-User Sync via Firebase Firestore**
  - *Chosen Approach*: Store global curated resources in a shared Firestore collection (`resources`) governed by RBAC security rules, while storing user-specific roadmap progress, problem logs, pattern notes, and daily activity logs in user-scoped documents (`userProgress`, `problemLogs`, `patternNotes`, `activityLogs`) that both the learner and Admin can read.
  - *Why*: Allows you (as Admin) to log in from your own device anytime to check your brother's real-time problem count, 7-day revision compliance, and weekly streak without requiring manual status reports, while also letting you grant edit permissions to any user dynamically.
- **Decision 3: In-Browser Voice Recording with Local Playback + Cloud Metadata Log**
  - *Chosen Approach*: Use the native Web Audio / `MediaRecorder` API for recording 2-minute spoken explanations with instant in-browser playback and local `.webm` download, while saving the structured reflection log (problem explained, duration, self-rating, key takeaway, timestamp) to Firestore.
  - *Why*: Respects Firestore's 1MB document limit while giving your brother a zero-friction voice studio to practice his 2-minute interview explanations and listen back immediately.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation & Context Bar                          │
│  [FAANG Path Brand]   [Dashboard · Roadmap · DSA · Resources · CS & Apt]     │
│                                      [Solo Timer | Exam Mode | User/Admin]   │
└──────────────────────┬───────────────────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┬───────────────────────────────┐
        ▼                             ▼                               ▼
┌──────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────┐
│  Analytics & Daily   │   │  4-Semester Roadmap &   │   │   DSA Tracker &     │
│    Command Center    │   │   Weekly Routine View   │   │ 7-Day Review Queue  │
│ ──────────────────── │   │ ─────────────────────── │   │ ─────────────────── │
│ • 365-Day Heatmap    │   │ • Sem 1 (Months 1–6)    │   │ • NeetCode 150 Bank │
│ • Milestone Progress │   │ • Sem 2–4 FAANG Tracks  │   │ • Custom Problem Log│
│ • Topic Radar/Bars   │   │ • Routine Checkboxes    │   │ • 30m Solo Timer    │
│ • Open Items Card    │   │ • Exam Light Mode Rules │   │ • 7-Day Due Filter  │
└──────────┬───────────┘   └────────────┬────────────┘   └──────────┬──────────┘
           │                            │                           │
           ▼                            ▼                           ▼
┌──────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────┐
│ Spoken Explanation & │   │  Searchable Resource    │   │  Admin & Mentorship │
│ Pattern Notes Studio │   │  Library (CSV + PDFs)   │   │   Control Console   │
│ ──────────────────── │   │ ─────────────────────── │   │ ─────────────────── │
│ • 2-Min Mic Recorder │   │ • Instant Search & Sort │   │ • User Role Manager │
│ • Playback & Export  │   │ • Primary vs Parked Tab │   │ • Edit Perm Toggle  │
│ • Markdown Pattern   │   │ • Admin/Editor CRUD     │   │ • Learner Switcher  │
│   Template Editor    │   │   Modal & Status Sync   │   │ • Mock Interview Log│
└──────────┬───────────┘   └────────────┬────────────┘   └──────────┬──────────┘
           │                            │                           │
           └────────────────────────────┼───────────────────────────┘
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                Firebase Authentication & Firestore Database                  │
│  • /users/{uid} (role: admin|user, canEditResources, examLightMode, targets) │
│  • /admins/{uid} (bootstrapped for katukojwalamaniharanchary@gmail.com)      │
│  • /resources/{resourceId} (seeded from CSV/PDFs, editable by Admin/Editors) │
│  • /userProgress/{uid} (roadmap checkboxes, CS/Aptitude streaks, open items) │
│  • /problemLogs/{logId} (status, solvedAt, nextReviewDate, coldResolved)     │
│  • /patternNotes/{noteId} (pattern templates, 2-min explanation logs)        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State
- **`users/{uid}`**: Stores user profile (`displayName`, `email`, `role: 'admin' | 'member'`, `canEditResources: boolean`, `examLightMode: boolean`, `weekdayHours`, `weekendHours`, `sem1ExamDates`, `week1JavaCheckResult`, `createdAt`, `updatedAt`).
- **`admins/{uid}`**: Lookup collection for hardened Firestore RBAC rules, automatically populated when `katukojwalamaniharanchary@gmail.com` signs in or promotes another user.
- **`resources/{resourceId}`**: Stores all learning resources (`title`, `category`, `typeFocus`, `priority: 'High' | 'Optional' | 'Reference' | 'Parked'`, `recommendedUse`, `url`, `status`, `notes`, `updatedBy`, `updatedAt`). Automatically seeded with your complete CSV and PDF resource catalog on initial load.
- **`userProgress/{uid}`**: Stores checked roadmap item IDs across Semesters 1–4, daily routine check-ins, activity date map for the 365-day heatmap, CS Fundamentals module completion, and IndiaBix / Logic Puzzle streaks.
- **`problemLogs/{logId}`**: Links a user (`userId`) to a NeetCode 150 or custom problem (`problemId`, `title`, `pattern`, `difficulty`, `platformUrl`, `status: 'todo' | 'solved' | 'review_due' | 'mastered'`, `solvedAt`, `nextReviewDate`, `reSolvedCount`, `spokenExplanationDone`, `timeSpentMinutes`, `notes`).
- **`patternNotes/{noteId}`**: Stores user-written pattern guides and logged 2-minute spoken explanation sessions (`userId`, `patternName`, `problemTitle`, `coreIntuition`, `complexityAnalysis`, `spokenDurationSec`, `selfRating`, `createdAt`).

### Interactive Component & State Mapping
- **Role-Based Access & Student Switcher**: When logged in as `katukojwalamaniharanchary@gmail.com`, an Admin bar lets you switch between viewing your own workspace or inspecting any registered user's live dashboard, roadmap progress, and problem logs, as well as toggling `canEditResources` per user.
- **Automatic 7-Day Spaced Repetition Engine**: Whenever a problem is marked *Solved*, the state handler computes `nextReviewDate = Date.now() + 7 * 86400000` and increments today's heatmap count. Any solved problem whose `nextReviewDate <= Date.now()` and `status !== 'mastered'` is badged in the **Due for 7-Day Cold Re-Solve** queue; completing the re-solve cold transitions the problem to `mastered`.
- **Solo Rule & Spoken Studio Timers**: Interactive 30-minute problem timer and 2-minute microphone recorder include start/pause/reset controls, visual progress rings, and direct saving to the user's daily activity log.
