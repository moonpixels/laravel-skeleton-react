---
description: Create a new Action class
---

Create a new Action class for: $ARGUMENTS

Load the `laravel-actions` skill for patterns.

Requirements:
- Name must end with "Action"
- Location: `app/Actions/{domain}/`
- Use `final readonly class`
- Single responsibility
- Constructor injection for dependencies
- Return DTO or model, not array
- Method named `handle()` or `execute()`

Ask which domain folder to use if unclear (Auth, User, etc.).

After creation, show:
- File location
- Usage example in a controller
