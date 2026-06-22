# Quiz Management MVP Scope

Based on an analysis of the Next.js 15, Tailwind, and Supabase codebase, here is a breakdown of what has been implemented and what features are pending (or marked as "coming soon").

## ✅ Currently Built Features

### 1. Authentication & Authorization
- **User Signup & Login:** Complete flow using Supabase Auth (Email/Password).
- **Role Separation:** Teachers have a dedicated dashboard, while students participate via quiz links.

### 2. Teacher Dashboard
- **Overview Metrics:** Summary of total quizzes created and total attempts by students.
- **Quiz Management:** List view of all quizzes created by the teacher.

### 3. Quiz Creation & Editing
- **Create Quiz Flow:** Teachers can set quiz titles, descriptions, and time limits per question.
- **Question Builder:** Create multiple-choice questions with 4 options and mark the correct answer.
- **Edit Quizzes:** Edit existing quizzes and update questions/details.

### 4. Student Quiz Experience
- **Quiz Intro Screen:** Displays quiz details before starting.
- **Active Quiz Interface:** Shows the current question, options, and a countdown timer based on the configured time-per-question.
- **Quiz Completion:** Submits the quiz and creates a `quiz_attempts` record.

---

## 🚧 Needs to be Built (Pending / Coming Soon)

### 1. Proctoring & Anti-Cheat
- *Database support exists (`warnings_count`, `is_terminated`, `terminated_reason`)* but the frontend integration is pending.
- **Tab Switching Detection:** Alert students and increment warnings. Auto-submit or terminate if the limit is exceeded.
- **Full-Screen Enforcement:** Prevent minimizing or resizing the quiz window.

### 2. Advanced Analytics & Reporting
- **Dashboard Analytics:** Detailed performance trends over time.
- **Student Result Details:** In-depth breakdown of how students answered specific questions.

### 3. Question Bank
- **Reusable Questions:** Save questions to a central bank to reuse them across multiple quizzes without re-typing.
- **Categorization & Tagging:** Organize questions by topic or difficulty.

### 4. Student Management
- **Roster & Classes:** Manage a list of registered students or group them into classes.
- **Assign Quizzes:** Directly assign a quiz to a specific group or student rather than just sharing a link.

### 5. Dashboard Enhancements
- **Bulk Actions:** Ability to delete, archive, or duplicate multiple quizzes at once.

---

> [!NOTE]
> The current version serves as a solid MVP for basic quiz creation and taking. Prioritizing the **Proctoring** and **Question Bank** features would add the most immediate value for a production-ready educational tool.
