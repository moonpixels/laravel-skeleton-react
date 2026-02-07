# Permission Recipes

Use `permission` to align tool access with the workflow. Grant only what the agent needs.

## Read-Only Reviewer

```yaml
permission:
  edit: deny
  bash:
    "*": deny
    "git diff*": allow
    "git log*": allow
    "git status*": allow
```

## Test Runner (Read-Only)

```yaml
permission:
  edit: deny
  bash:
    "*": deny
    "npm test*": allow
    "npx tsc*": allow
```

## Test Fixer (Edit + Test)

```yaml
permission:
  edit: allow
  bash:
    "*": deny
    "npm test*": allow
    "npx tsc*": allow
```

## Feature Builder (Full Build)

```yaml
permission:
  edit: allow
  bash: ask
```

## Docs Writer (Path-Restricted)

```yaml
permission:
  edit:
    "docs/*": allow
    "README.md": allow
    "*.md": ask
    "*": deny
  bash: deny
```

## Notes

- `edit` covers all file modifications (edit/write/patch). Use it instead of `write`.
- Put "*" first; last matching rule wins.
