# /vibe-ready:status

Show the current task status.

Determine your session workspace: `.plans/{session_id}/` (use $CLAUDE_SESSION_ID, fallback to `default`).

Read the following files and present a concise status report:

1. `.plans/{session_id}/task_plan.md` — show task name, current phase, and phase statuses
2. `.plans/{session_id}/progress.md` — show recent progress log entries
3. `.plans/{session_id}/findings.md` — show key findings if any

Also scan `.plans/` for other active agent directories and list them.

Format the output as:

```
Task: [name]
Session: [session_id]
Phase: [current] of [total]
Status: [overall status]

Phases:
  [1] [name] — [status]
  [2] [name] — [status]
  ...

Recent Progress:
  - [latest entries]

Other Active Agents:
  - [other_session_id]: [task name from first line of their task_plan.md]
```

If no active task (workspace doesn't exist or files are empty), say: "No active task. Use /vibe-ready:plan [description] to start one."

**Important:** All status output must be in English, regardless of the user's language.
