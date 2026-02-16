#!/usr/bin/env node
// UserPromptSubmit hook — inject active task plan context
// Uses per-agent workspace: .plans/{session_id}/
// Auto-discovers orphaned workspaces (picks newest by mtime)
// Supports 3 context modes: full (default), compact, off
// Cross-platform: works on Windows, macOS, Linux

const fs = require("fs");
const path = require("path");
const { plansDir, findActivePlan, readConfig } = require("./utils");

const config = readConfig();

// Off mode — no injection at all
if (config.context_mode === "off") {
  process.exit(0);
}

// Find active workspace
const active = findActivePlan();
if (!active) {
  process.exit(0);
}

const activeWorkspace = path.join(plansDir, active.sessionId);
const planPath = path.join(activeWorkspace, "task_plan.md");
const planContent = fs.readFileSync(planPath, "utf-8").trim();

if (!planContent) {
  process.exit(0);
}

// Output resume notice
if (active.isResumed) {
  console.log(
    `[vibe-ready] Resuming task from previous session (${active.sessionId}).`
  );
  console.log(
    `[vibe-ready] Your workspace: .plans/${active.sessionId}/ — use this path for all plan updates.`
  );
  console.log("");
}

console.log(
  `[vibe-ready] Active task plan (session: ${active.sessionId}, mode: ${config.context_mode}):`
);

const progressPath = path.join(activeWorkspace, "progress.md");

if (config.context_mode === "compact") {
  // Smart extraction: task title, summary, phase list with statuses
  const lines = planContent.split("\n");
  const extracted = [];
  let inPhaseHeader = false;

  for (const line of lines) {
    // Always include title line
    if (line.startsWith("# ")) {
      extracted.push(line);
      continue;
    }
    // Include summary section
    if (line.startsWith("## Summary")) {
      extracted.push(line);
      inPhaseHeader = false;
      continue;
    }
    // Include phase headers (### Phase N: Name — status)
    if (line.match(/^### Phase \d/)) {
      extracted.push(line);
      inPhaseHeader = true;
      continue;
    }
    // Include Goal line right after phase header
    if (inPhaseHeader && line.startsWith("**Goal:**")) {
      extracted.push(line);
      inPhaseHeader = false;
      continue;
    }
    // Include lines right after Summary header (the actual summary text)
    if (
      extracted.length > 0 &&
      extracted[extracted.length - 1] === "## Summary" &&
      line.trim()
    ) {
      extracted.push(line);
      continue;
    }
  }

  console.log(extracted.join("\n"));
  console.log("");
  console.log(
    `[vibe-ready] Full plan: .plans/${active.sessionId}/task_plan.md | Progress: .plans/${active.sessionId}/progress.md`
  );
} else {
  // Full mode (default): inject entire task_plan + progress
  console.log(planContent);

  if (fs.existsSync(progressPath)) {
    const progressContent = fs.readFileSync(progressPath, "utf-8").trim();
    if (progressContent) {
      console.log("");
      console.log("[vibe-ready] Progress:");
      console.log(progressContent);
    }
  }
}

process.exit(0);
