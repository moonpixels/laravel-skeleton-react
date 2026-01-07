---
name: laravel-herd
description: Laravel Herd local development environment
compatibility: opencode
metadata:
  category: environment
  domain: devops
---

## What Laravel Herd Is

Laravel Herd provides automatic local development environment with HTTPS.

## Key Features

- **URL**: Project available at `APP_URL` from `.env`
- **No server commands**: Always running via Herd
- **Automatic HTTPS**: SSL certificates managed automatically
- **Services**: Redis and MinIO automatically configured

## Services

**Redis**: Available at `localhost:6379` for caching, sessions, queues

**MinIO**: S3-compatible storage at `https://minio.herd.test`

**PostgreSQL**: Database configured in `.env`

## No php artisan serve

Never run `php artisan serve` - project is always available through Herd at the configured URL.

## Environment Variables

Check `.env` for:
- `APP_URL` - Your Herd URL
- `DB_*` - Database credentials
- `REDIS_*` - Redis configuration
- `AWS_*` - MinIO/S3 configuration
