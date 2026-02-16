#!/usr/bin/env node
// PreToolUse hook — remind Claude to check the plan before writing files
// Auto-discovers active workspace (own or orphaned, picks newest by mtime)
// Uses stderr for reminders (PreToolUse does not support additionalContext)
// Cross-platform: works on Windows, macOS, Linux

const { findActivePlan } = require("./utils");

const active = findActivePlan();
if (active) {
  process.stderr.write(
    `[vibe-ready] Active task plan exists (.plans/${active.sessionId}/). Ensure this edit aligns with the current phase.\n`
  );
}

process.exit(0);
