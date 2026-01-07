---
name: laravel-debugging
description: Debug Laravel applications using Horizon, Telescope, and Laravel Boost tools
compatibility: opencode
metadata:
  category: environment
  domain: debugging
---

## Debug Tools

**Horizon**: `/horizon` - Queue monitoring, failed jobs, metrics

**Telescope**: `/telescope` - Request debugging, queries, events (dev only)

**Debugbar**: Request debugging in browser (dev only)

## Laravel Boost Tools

**browser-logs**: Read browser console logs/errors
```
Use Laravel Boost browser-logs tool
```

**read-log-entries**: Read application logs
```
Use Laravel Boost read-log-entries tool
```

**last-error**: Get last backend exception details
```
Use Laravel Boost last-error tool
```

**tinker**: Execute PHP code in Laravel context
```
Use Laravel Boost tinker tool
```

**database-query**: Run read-only SQL queries
```
Use Laravel Boost database-query tool
```

## Debug Workflow

1. Check browser logs (browser-logs tool)
2. Check application logs (read-log-entries tool)
3. Check last error (last-error tool)
4. Test PHP code (tinker tool)
5. Inspect database (database-query tool)
6. Check Telescope for requests/queries
