# auto-plan

## Description
Automatically create a structured development plan when the user describes a feature request or development task. Breaks work into phases with clear deliverables. Supports multiple agents working in parallel on the same repo.

## Trigger
User describes a development task, feature request, or says "plan", "implement", "build", "add feature", "create". Activates when the message implies a multi-step development effort.

## Instructions

You are creating a structured development plan for the user's request. Follow these steps:

### Agent Isolation

Each Claude session gets its own workspace under `.plans/`:
- Your workspace: `.plans/{session_id}/`
- `{session_id}` is determined by the environment variable `$CLAUDE_SESSION_ID`
- If `$CLAUDE_SESSION_ID` is not available, use `default` as the session id
- NEVER read or write another agent's workspace
- The `.plans/archive/` directory is shared (read-only for reference)

### Step 1: Understand the Request

1. Read the user's task description carefully
2. Read `docs/module-index.md` to understand which modules are relevant
3. Read the specific docs for relevant areas (architecture.md, conventions.md, etc.)
4. Identify affected files and modules
5. Check `.plans/` for other active agents — if another agent's `task_plan.md` touches the SAME files, warn the user about potential conflicts

### Step 2: Create Task Plan

Create `.plans/{session_id}/task_plan.md` with this structure:

```markdown
# Task: [Short title]

## Agent Session
- Session ID: {session_id}
- Started: [ISO 8601 timestamp, e.g. 2025-06-15T14:30:00Z]

## Summary
[1-2 sentence description of what we're building]

## Affected Modules
- [module] — [what changes]

## Phases

### Phase 1: [Name] — `pending`
**Goal:** [What this phase achieves]
**Files:**
- [ ] `path/to/file.ts` — [what to do]
- [ ] `path/to/file.ts` — [what to do]
**Verify:** `[command to run, e.g. npm run build]`
**Acceptance:** [Human-readable success criteria]

### Phase 2: [Name] — `pending`
**Goal:** [What this phase achieves]
**Files:**
- [ ] `path/to/file.ts` — [what to do]
- [ ] `path/to/file.ts` — [what to do]
**Verify:** `[command to run, e.g. npm test -- --grep "auth"]`
**Acceptance:** [Human-readable success criteria]

### Phase 3: Testing & Verification — `pending`
**Goal:** Run full test suite and verify no regressions
**Files:**
- [ ] [test files]
**Verify:** `[command to run full tests, e.g. npm test]`
**Acceptance:** All tests pass, no regressions
```

### Step 3: Create Supporting Files

#### .plans/{session_id}/findings.md
```markdown
# Findings: [Task title]

## Codebase Analysis
- [Key findings from reading relevant code]
- [Existing patterns to follow]
- [Potential risks or edge cases]

## Dependencies
- [External dependencies needed]
- [Internal modules affected]
```

#### .plans/{session_id}/progress.md
```markdown
# Progress: [Task title]

## Current Phase: Phase 1 — [Name]
## Status: Not started

## Log
- [ISO 8601 timestamp] Plan created
```

### Step 4: Present for Confirmation

Display the plan to the user in a clear format:
1. Task summary
2. Number of phases
3. Key files to be modified
4. If file conflicts detected with other agents, list them
5. Ask: "Does this plan look good? I'll start with Phase 1."

### Step 5: User Confirmation & Archive

When the LAST phase's verify command passes:

1. Present a completion summary to the user:
   ```
   ✅ All phases complete.

   Summary:
   - Phase 1: [name] — done
   - Phase 2: [name] — done
   - Phase 3: [name] — done

   Files changed:
   - path/to/file.ts
   - path/to/other.ts

   Does this task look complete? (yes / need changes)
   ```
2. **Wait for user confirmation** — do NOT archive until the user says yes
3. If user says **yes / looks good / done**:
   - Create `.plans/archive/` directory if it doesn't exist
   - Create archive file: `.plans/archive/YYYY-MM-DD-[short-slug].md` with task summary
   - Delete your entire workspace directory: `.plans/{session_id}/`
   - Tell the user: "Task archived. Ready for next task."
4. If user says **need changes / no / fix X**:
   - Keep the current workspace
   - Address the user's feedback
   - Run verify again after changes
   - Ask for confirmation again

### Phase Lifecycle

Each phase follows this strict lifecycle:

```
pending → in_progress → verify → complete
```

1. **pending → in_progress**: Update status when you start working on the phase
2. **in_progress → verify**: When all files in the phase are done, run the **Verify** command
3. **verify → complete**: Only mark `complete` if the verify command succeeds
   - If verify fails: fix the issue, run verify again
   - Do NOT mark complete without a passing verify command
   - If no verify command specified: use your judgment on acceptance criteria
4. **All phases complete → ask user**: Present summary, wait for user confirmation
5. **User confirms → archive**: Archive and clean up workspace

Update progress.md after each status change with a log entry.

### Important Rules
- **ALL generated .md files MUST be written in English** — regardless of the user's language. This includes task_plan.md, findings.md, progress.md, archive entries, and all status output. Even if the user writes in Chinese, Japanese, or any other language, always generate and modify .md content in English.
- Maximum 5 phases per plan (break larger tasks into separate plans)
- Each phase should be completable in one focused session
- Always include a testing/verification phase as the last phase
- Always include a **Verify** command in each phase when the project has build/test tooling
- File paths must be real paths that exist (or will exist) in the project
- Status values: `pending`, `in_progress`, `complete`
- NEVER mark a phase `complete` without running its Verify command first (if one exists)
- NEVER archive without user confirmation — always ask first
- Do NOT start implementing until the user confirms the plan
- NEVER touch files inside another agent's `.plans/{other_session_id}/` directory
