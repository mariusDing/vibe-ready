# /vibe-ready:init

Initialize this repository for the vibe-ready workflow.

Analyze the project structure, detect the tech stack, and generate:
- `CLAUDE.md` — project identity and behavior rules for Claude
- `docs/` — module index, architecture, conventions, tech stack
- `.plans/` — task lifecycle directory with `archive/` subdirectory
- `.plans/archive/` — shared archive (committed to git)

Agent workspaces (`.plans/{session_id}/`) are created on-demand when a task starts, not during init.

Follow the repo-init skill instructions precisely. This is the first step for any new repository.

**Important:** All generated .md files (CLAUDE.md, docs/*, README.md) must be written in English, regardless of the user's language.
