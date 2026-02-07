# Research Process for Creating AGENTS.md

Step-by-step process for analyzing a project and creating an effective AGENTS.md.

## Step 1: Analyze Project Structure

1. Identify the tech stack and versions from `package.json`, `astro.config.mjs`, or build configs.
2. Find key configuration files (build, lint, format, test, typecheck).
3. Map top-level directories and identify the most important source folders.

## Step 2: Identify Commands

1. Extract scripts from package managers (`package.json`, `Makefile`, `justfile`).
2. Capture the exact daily commands: dev, lint, format, test, build, typecheck.
3. Note any “all checks” or quality gate commands used in CI.

## Step 3: Discover Architecture Decisions

1. Review README/docs for explicit conventions and patterns.
2. Inspect code to confirm state management, routing, and data-fetching choices.
3. List 3-5 critical decisions that shape everyday development.

## Step 4: Find Quality Standards

1. Check test config for coverage thresholds.
2. Confirm TypeScript strictness or equivalent type rules.
3. Identify linting/formatting requirements and pre-commit hooks.

## Step 5: Draft AGENTS.md

1. Start with a one-line project description.
2. Add Quick Commands with exact, runnable syntax.
3. Map Key Directories with clear purpose.
4. Add Architecture Decisions with only universal guidance.
5. Add Before Committing with the exact required commands.
6. Include Available Skills and Specialized Agents sections when configured.
7. Keep only universal, high-signal content; remove anything task-specific or stale.

## Step 6: Validate and Refine

1. Ensure every instruction applies to every task.
2. Confirm commands are exact and still valid.
3. Avoid large code snippets; only tiny, stable snippets when unavoidable.
4. Trim anything that does not improve daily effectiveness.

## Step 7: Handle Existing AGENTS.md

1. Read the file end-to-end before editing.
2. Preserve accurate universal guidance.
3. Update versions and commands based on current config.
4. Remove instructions that are task-specific or outdated.
