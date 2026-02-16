#!/usr/bin/env node
// PostToolUse hook — remind Claude to update progress after writing files
// Auto-discovers active workspace (own or orphaned, picks newest by mtime)
// Uses stderr for reminders
// Cross-platform: works on Windows, macOS, Linux

const { findActivePlan } = require("./utils");

const active = findActivePlan();
if (active) {
  process.stderr.write(
    `[vibe-ready] File written. Remember to update .plans/${active.sessionId}/progress.md and check off completed items in task_plan.md.\n`
  );
}

process.exit(0);
