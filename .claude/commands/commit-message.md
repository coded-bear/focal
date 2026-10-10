---
description: Create a commit message by analyzing git diffs
allowed-tools: Bash(git status:*), Bash(git diff --staged), Bash(git commit:*)
---

## Context:

- Current git status: !`git status`
- Current git diff: !`git diff --staged`

Analyze above staged git changes and create a commit message. Use present tense and explain "why" something has changed, not just "what" has changed.

If nothing is staged, say so and stop; do not stage files or commit.

## Commit types with emojis:

Only use the following emojis:

- ✨ `feat:` - New feature
- 🐛 `fix:` - Bug fix
- 🔨 `refactor:` - Refactoring code
- 📝 `docs:` - Documentation
- 🎨 `style:` - Styling/formatting
- ✅ `test:` - Tests
- ⚡ `perf:` - Performance
- 🔧 `chore:` - Maintenance, config, dependencies
- 👷 `ci:` - CI configuration
- 📦 `build:` - Build system, packaging

## Format:

Use the following format for making the commit message:

```
<emoji> <type>: <concise_description>

<optional_body_explaining_why>
```

Separate the body from the subject with one blank line.

## Output:

1. Show summary of changes currently staged
2. Propose commit message with appropriate emoji
3. Ask for confirmation before committing

DO NOT auto-commit - wait for user approval, and only commit if the user says so.
