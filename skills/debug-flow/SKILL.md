# debug-flow

## Description
Structured debugging workflow using hypothesis-driven investigation. Systematically diagnose bugs through 3 rounds of hypothesis → verify → conclude. Supports multi-agent parallel work.

## Trigger
User reports a bug, error, or issue. Keywords: "bug", "error", "broken", "not working", "fails", "crash", "500", "exception", "debug", "fix".

## Instructions

You are debugging an issue reported by the user. Follow the structured hypothesis-driven approach:

### Agent Isolation

Each Claude session gets its own workspace under `.plans/`:
- Your workspace: `.plans/{session_id}/`
- `{session_id}` is determined by the environment variable `$CLAUDE_SESSION_ID`
- If `$CLAUDE_SESSION_ID` is not available, use `default` as the session id
- NEVER read or write another agent's workspace

### Step 1: Create Debug Plan

Create `.plans/{session_id}/task_plan.md`:

```markdown
# Debug: [Short description of the issue]

## Agent Session
- Session ID: {session_id}
- Started: [ISO 8601 timestamp, e.g. 2025-06-15T14:30:00Z]

## Reported Symptom
[What the user described]

## Phases

### Phase 1: Reproduce & Gather Evidence — `in_progress`
**Goal:** Confirm the issue and collect error details
**Actions:**
- [ ] Reproduce the error
- [ ] Read error logs/stack trace
- [ ] Identify the entry point of the failure
**Acceptance:** Error is reproducible and entry point is identified

### Phase 2: Hypothesis & Investigation — `pending`
**Goal:** Form and test hypotheses about root cause
**Hypotheses:**
- H1: [hypothesis] — `untested`
- H2: [hypothesis] — `untested`
- H3: [hypothesis] — `untested`
**Acceptance:** Root cause identified and confirmed

### Phase 3: Fix & Verify — `pending`
**Goal:** Implement fix and verify it resolves the issue
**Files:**
- [ ] `path/to/file` — [what to fix]
**Acceptance:** Original error no longer occurs, no regressions
```

### Step 2: Record Findings

Create/update `.plans/{session_id}/findings.md`:

```markdown
# Debug Findings: [Issue]

## Evidence
- [What the error says]
- [Where it occurs]
- [When it started/conditions]

## Hypotheses
| # | Hypothesis | Status | Evidence |
|---|-----------|--------|----------|
| H1 | [description] | untested | |
| H2 | [description] | untested | |
| H3 | [description] | untested | |

## Root Cause
[Filled in after investigation]

## Fix Applied
[Description of the fix]
```

### Step 3: Investigate (3 rounds max)

For each hypothesis:
1. **State** what you're checking and why
2. **Read** the relevant code (do NOT modify anything yet)
3. **Verify** — check logs, run tests, trace the execution
4. **Conclude** — confirmed, rejected, or needs more data

Update the hypothesis table in findings.md after each round.

### Step 4: Fix

Once root cause is identified:
1. Update Phase 3 with specific files and changes
2. Present the proposed fix to the user
3. After confirmation, implement the fix
4. Run tests to verify
5. Update progress.md

### Step 5: User Confirmation & Archive

When all phases are `complete`:

1. Present a completion summary to the user:
   ```
   ✅ Bug fix complete.

   Root cause: [one-line root cause from findings.md]
   Fix: [one-line description of the fix]

   Files changed:
   - path/to/file.ts
   - path/to/other.ts

   Does this fix look complete? (yes / need changes)
   ```
2. **Wait for user confirmation** — do NOT archive until the user says yes
3. If user says **yes / looks good / done**:
   - Create `.plans/archive/` directory if it doesn't exist
   - Create archive file: `.plans/archive/YYYY-MM-DD-debug-[short-slug].md` with debug summary, root cause, and fix description
   - Delete your entire workspace directory: `.plans/{session_id}/`
   - Tell the user: "Bug fixed and archived. Ready for next task."
4. If user says **need changes / no / not fixed**:
   - Keep the current workspace
   - Address the user's feedback
   - Run tests again after changes
   - Ask for confirmation again

### Important Rules
- **ALL generated .md files MUST be written in English** — regardless of the user's language. This includes task_plan.md, findings.md, progress.md, archive entries, and all debug output. Even if the user describes the bug in Chinese, Japanese, or any other language, always generate and modify .md content in English.
- Maximum 3 hypothesis rounds — if no root cause found after 3 rounds, summarize findings and ask the user for more context
- NEVER modify code during investigation (Phases 1-2), only read
- Always record findings even if a hypothesis is rejected (negative results are valuable)
- Update findings.md after EVERY investigation step
- If the fix requires changes in multiple files, list ALL files before starting
- Status values for hypotheses: `untested`, `testing`, `confirmed`, `rejected`
- NEVER archive without user confirmation — always ask first
- NEVER touch files inside another agent's `.plans/{other_session_id}/` directory
