# /vibe-ready:config

Configure vibe-ready plugin settings for this project.

Usage: `/vibe-ready:config [setting] [value]`

Settings are stored in `.vibe-ready.json` at the project root.

## Available Settings

### context_mode
Controls how much task plan context is injected on each prompt.

| Value | Behavior | Token Cost |
|-------|----------|------------|
| `full` | Inject entire task_plan.md + progress.md (**default**) | Higher, but Claude has full context |
| `compact` | Inject only first 20 lines of task_plan.md | Lower, saves tokens |
| `off` | No context injection | Minimal, but Claude may lose track of task |

**Examples:**
- `/vibe-ready:config context_mode compact` — switch to compact mode
- `/vibe-ready:config context_mode full` — switch back to full mode

### Instructions

When the user runs this command:

1. Read `.vibe-ready.json` from the project root (create if missing)
2. If no arguments given, display all current settings
3. If setting and value given, update the setting and confirm

**Display format (no arguments):**
```
vibe-ready config:
  context_mode: full (default)
```

**Update format:**
```
Updated: context_mode = compact
```

**Default `.vibe-ready.json`:**
```json
{
  "context_mode": "full"
}
```

If `.vibe-ready.json` doesn't exist, treat all settings as their defaults. Only create the file when the user explicitly changes a setting.

**Important:** All output messages must be in English, regardless of the user's language.
