#!/usr/bin/env node
// Shared utilities for vibe-ready hooks
// Cross-platform: works on Windows, macOS, Linux

const fs = require("fs");
const path = require("path");

const sessionId = process.env.CLAUDE_SESSION_ID || "default";
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const plansDir = path.join(projectDir, ".plans");
const configPath = path.join(projectDir, ".vibe-ready.json");

/**
 * Find the active workspace for this agent.
 * Priority: 1) own session workspace  2) newest orphaned workspace (by mtime)
 * Returns { sessionId, isResumed } or null if no active plan found.
 */
function findActivePlan() {
  // Check own workspace first
  const ownPlan = path.join(plansDir, sessionId, "task_plan.md");
  if (fs.existsSync(ownPlan) && fs.readFileSync(ownPlan, "utf-8").trim()) {
    return { sessionId: sessionId, isResumed: false };
  }

  // Scan for orphaned workspaces — pick the newest by mtime
  if (!fs.existsSync(plansDir)) return null;

  const entries = fs.readdirSync(plansDir, { withFileTypes: true });
  let bestCandidate = null;
  let bestMtime = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "archive") continue;
    if (entry.name === sessionId) continue;

    const candidatePlan = path.join(plansDir, entry.name, "task_plan.md");
    if (fs.existsSync(candidatePlan)) {
      const content = fs.readFileSync(candidatePlan, "utf-8").trim();
      if (content) {
        const stat = fs.statSync(candidatePlan);
        if (stat.mtimeMs > bestMtime) {
          bestMtime = stat.mtimeMs;
          bestCandidate = entry.name;
        }
      }
    }
  }

  if (bestCandidate) {
    return { sessionId: bestCandidate, isResumed: true };
  }
  return null;
}

/**
 * Read plugin config from .vibe-ready.json
 * Returns config object with defaults applied.
 */
function readConfig() {
  const defaults = { context_mode: "full" };
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return { ...defaults, ...config };
    }
  } catch (e) {
    // Ignore config errors, use defaults
  }
  return defaults;
}

module.exports = {
  sessionId,
  projectDir,
  plansDir,
  configPath,
  findActivePlan,
  readConfig,
};
