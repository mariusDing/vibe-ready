# vibe-ready

Make any repo AI-coding-friendly in one command.

Stop wasting the first 10 minutes of every Claude session explaining your project. `vibe-ready` scans your codebase, generates structured documentation, and gives Claude a complete development workflow — planning, execution, debugging, and archiving — out of the box.

## Installation

```bash
# Step 1: Add the marketplace
/plugin marketplace add mariusDing/vibe-ready

# Step 2: Install the plugin
/plugin install vibe-ready@vibe-ready
```

## Quick Start

```bash
# Open your repo and initialize
/vibe-ready:init

# Start your first task
/vibe-ready:plan add user authentication
```

That's it. Claude now understands your codebase and follows a structured workflow.

## How It Works

When you run `/vibe-ready:init`, vibe-ready analyzes your project and generates a set of docs that Claude reads before every task:

| Generated File | Purpose |
|----------------|---------|
| `CLAUDE.md` | Project identity + behavior rules for Claude |
| `docs/module-index.md` | Map of all modules (Claude reads this first) |
| `docs/architecture.md` | System design overview |
| `docs/conventions.md` | Coding style detected from your code |
| `docs/tech-stack.md` | Languages, frameworks, dependencies |
| `.plans/` | Task lifecycle directory |

From there, every task follows the same cycle:

```
init (once) --> plan --> code --> user confirms --> archive --> plan --> ...
```

1. **Plan before coding** — Claude breaks your request into phases with clear deliverables and verify commands
2. **Code with guardrails** — Hooks automatically remind Claude to follow the plan and track progress
3. **Verify each phase** — Each phase has a verify command (`npm test`, `npm run build`, etc.) that must pass
4. **User confirms completion** — Claude asks you to verify before archiving. You stay in control.

## Commands

| Command | What it does |
|---------|-------------|
| `/vibe-ready:init` | Analyze repo and generate all documentation |
| `/vibe-ready:plan [task]` | Create a phased development plan |
| `/vibe-ready:status` | Show current task progress and active agents |
| `/vibe-ready:config [setting] [value]` | Configure plugin settings |

## Skills

vibe-ready ships with three built-in skills:

- **auto-plan** — Breaks any task into phased plans with deliverables, verify commands, and acceptance criteria. Claude won't start coding until you approve the plan.
- **debug-flow** — Hypothesis-driven debugging. Reproduce the bug, form up to 3 hypotheses, investigate without modifying code, then fix. Triggers automatically when you describe a bug.
- **repo-init** — The engine behind `/vibe-ready:init`. Analyzes your project structure, detects conventions, and generates all documentation.

## Context Window Full? Just Open a New Window

If Claude's context fills up mid-task, open a new terminal in the same project:

```bash
claude /plugin add /path/to/vibe-ready
```

The new agent **automatically discovers** the unfinished task and resumes from where the previous agent left off. No commands needed — hooks handle the handoff.

## Multi-Agent Support

Multiple Claude agents can work on the same repo simultaneously. Each agent gets an isolated workspace under `.plans/`, identified by `$CLAUDE_SESSION_ID`:

```
.plans/
  abc123/             <-- Agent A's workspace (isolated)
    task_plan.md
    findings.md
    progress.md
  def456/             <-- Agent B's workspace (isolated)
    task_plan.md
    findings.md
    progress.md
  archive/            <-- Shared archive (committed to git)
    2025-06-15-add-login.md
    2025-06-16-fix-payments.md
```

- **Conflict detection**: Warns when two agents plan to edit the same files
- **Automatic resume**: New sessions pick up the most recent orphaned workspace
- **Shared archive**: Completed tasks are archived and committed to git for team knowledge

## Hooks

Four hooks run automatically — no configuration needed:

| Hook | When | What it does |
|------|------|-------------|
| **UserPromptSubmit** | Every prompt | Injects active task plan into context |
| **PreToolUse** | Before file write | Reminds Claude to check plan alignment |
| **PostToolUse** | After file write | Reminds Claude to update progress |
| **Stop** | Agent finishes | Blocks if phases incomplete; asks for confirmation if all complete |

### Token Budget Control

Control how much context is injected per prompt with `/vibe-ready:config context_mode [value]`:

| Mode | Behavior | When to use |
|------|----------|-------------|
| `full` **(default)** | Injects entire task plan + progress | Best quality, full context |
| `compact` | Injects title, summary, and phase statuses only | Save tokens on long tasks |
| `off` | No injection | Manual workflow, maximum savings |

## Cross-Platform

All hook scripts are written in **Node.js** — works on Windows, macOS, and Linux with no extra dependencies. Claude Code already requires Node.js, so there's nothing additional to install.

## Project Structure

```
vibe-ready/
  .claude-plugin/
    plugin.json                 # Plugin metadata
  commands/
    init/SKILL.md               # /vibe-ready:init
    plan/SKILL.md               # /vibe-ready:plan
    status/SKILL.md             # /vibe-ready:status
    config/SKILL.md             # /vibe-ready:config
  skills/
    repo-init/SKILL.md          # Repo analysis & doc generation
    auto-plan/SKILL.md          # Task planning logic
    debug-flow/SKILL.md         # Hypothesis-driven debugging
  hooks/
    hooks.json                  # Hook configuration
    scripts/
      utils.js                  # Shared utilities (workspace discovery, config)
      prompt-context.js         # Context injection hook
      pre-write.js              # Pre-write reminder hook
      post-write.js             # Post-write reminder hook
  templates/                    # Templates for generated files
    CLAUDE.md.template
    task_plan.md.template
    findings.md.template
    progress.md.template
```

## Philosophy

- **Plan before you code.** Every task starts with a plan. Claude won't write a line of code until you approve it.
- **Verify, don't trust.** Each phase has a verify command. No phase is marked complete without passing verification.
- **User stays in control.** Claude asks for confirmation before archiving. You decide when a task is done.
- **Context is everything.** Hooks ensure Claude always knows what it's working on, even across sessions.
- **Works everywhere.** Node.js hooks, no shell dependencies, no platform-specific code.

## License

MIT
