# /vibe-ready:plan

Create a structured development plan for the given task.

Usage: `/vibe-ready:plan [task description]`

Take the task description provided by the user and:
1. Read `docs/module-index.md` to identify relevant modules
2. Read relevant docs for the affected areas
3. Create your agent workspace at `.plans/{session_id}/` (use $CLAUDE_SESSION_ID, fallback to `default`)
4. Create a phased plan in `.plans/{session_id}/task_plan.md`
5. Create initial findings in `.plans/{session_id}/findings.md`
6. Create progress tracker in `.plans/{session_id}/progress.md`
7. Check other agents' task_plan.md files for file conflicts, warn if found
8. Present the plan and wait for user confirmation before starting

Follow the auto-plan skill instructions precisely. Do NOT begin implementation until the user approves the plan.

**Important:** All generated .md files (task_plan.md, findings.md, progress.md) must be written in English, regardless of the user's language.
