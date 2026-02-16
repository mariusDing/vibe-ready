# repo-init

## Description
Initialize a repository for vibe-ready workflow. Analyzes the project structure, tech stack, and generates CLAUDE.md, docs/, and .plans/ directory.

## Trigger
User says "init", "initialize", "setup vibe", or uses /vibe-ready:init command.

## Instructions

You are initializing this repository for the vibe-ready structured development workflow. Follow these steps precisely:

### Step 1: Analyze the Project

1. Read `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, or equivalent to detect:
   - Project name
   - Tech stack (language, framework, major dependencies)
   - Build/test commands
2. Scan the top-level directory structure to understand the project layout
3. Read a few key source files to understand coding conventions (naming style, import patterns, error handling)

### Step 2: Create docs/ Directory

Create the following files under `docs/`:

#### docs/module-index.md
A concise map of the project's modules/directories. This is Claude's "first stop" when receiving a task. Format:

```markdown
# Module Index

| Module/Dir | Purpose | Key Files |
|-----------|---------|-----------|
| src/auth/ | Authentication & authorization | login.ts, middleware.ts |
| src/api/ | REST API endpoints | routes.ts, handlers/ |
| ... | ... | ... |
```

Keep it under 80 lines. Only include directories that contain meaningful code.

#### docs/architecture.md
High-level architecture overview (under 100 lines):
- System components and their relationships
- Data flow patterns
- Key design decisions visible in the code

#### docs/conventions.md
Coding conventions detected from the codebase (under 60 lines):
- Naming conventions
- File organization patterns
- Import/export patterns
- Error handling patterns
- Testing patterns

#### docs/tech-stack.md
Technology stack details (under 50 lines):
- Language version
- Framework and version
- Key dependencies and their purposes
- Build/test/deploy tools

### Step 3: Create .plans/ Directory

Create the `.plans/` directory structure:
- `.plans/archive/` — shared archive directory (committed to git)
- Agent workspaces are created on-demand at `.plans/{session_id}/` — NOT during init

Add to `.gitignore`:
```
# vibe-ready: ignore active agent workspaces, keep archive
.plans/*/
!.plans/archive/
```

This ensures:
- Each agent's workspace (`.plans/{session_id}/`) is gitignored (temporary)
- The archive directory (`.plans/archive/`) IS committed (permanent team knowledge)

### Step 4: Generate CLAUDE.md

Use the template below, filling in project-specific details from your analysis:

```markdown
# [ProjectName]

[One-sentence description]

## Tech Stack
- [Detected tech stack items]

## Directory Map
- `src/` → [Description]
- `tests/` → [Description]
- [Other key directories]

## Development Rules

### Agent Workspace
- Your workspace: `.plans/{session_id}/` (use $CLAUDE_SESSION_ID, fallback to `default`)
- NEVER read/write another agent's workspace
- Archive at `.plans/archive/` is shared read-only reference

### When you receive any dev task:
1. Check `.plans/{session_id}/task_plan.md`
   - Has content → resume from last progress
   - Empty/missing → this is a new task
2. For new tasks: read docs/module-index.md first to locate relevant modules
3. Then read ONLY the relevant doc:

| Task involves | Read first |
|--------------|------------|
| [area 1] | docs/[relevant].md |
| [area 2] | docs/[relevant].md |
| Unknown area | docs/module-index.md |

4. Never read all docs/ at once

### Coding Standards
- [Max 5 rules inferred from the codebase]

### Compact Rules
Preserve: task plan, modified files, unresolved errors
Discard: completed phase details, resolved investigation logs
```

### Step 5: Generate README.md (if missing)

If no `README.md` exists in the project root:

1. Thoroughly read the codebase — source files, configs, existing docs — to fully understand what this project does
2. Generate a `README.md` with:

```markdown
# [ProjectName]

[Clear description of what this project does and why it exists]

## Tech Stack
- [Language, framework, key dependencies]

## Getting Started

### Prerequisites
- [Required tools and versions]

### Installation
[Steps to install and set up]

### Usage
[How to run/use the project]

## Project Structure
[Brief directory overview]
```

Keep it under 80 lines. Write it for human contributors, not AI agents.

If `README.md` already exists, skip this step entirely — do NOT modify it.

### Step 6: Confirm

After creating all files, display a summary:
- Project name and detected stack
- Number of modules indexed
- Files created
- Suggest running `/vibe-ready:plan [task description]` to start first task

### Important Notes
- **ALL generated .md files MUST be written in English** — regardless of the user's language. This includes CLAUDE.md, all docs/ files (module-index.md, architecture.md, conventions.md, tech-stack.md), README.md, and any .plans/ files. Even if the user communicates in Chinese, Japanese, or any other language, always generate and modify .md content in English.
- Keep CLAUDE.md under 150 lines total
- Each docs/ file should be under 150 lines
- Be precise and concise — every line costs tokens
