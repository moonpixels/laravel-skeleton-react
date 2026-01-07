---
description: Run all quality checks
agent: quality-auditor
subtask: true
---

Run all quality checks in sequence:
1. Rector - automated refactoring
2. Pint - code formatting
3. PHPStan - static analysis
4. Coverage - 90% minimum
5. Type coverage - 100% minimum
6. Tests - full suite

Execute: !`composer run checks`

The `quality-auditor` agent will handle fixing any issues found.
