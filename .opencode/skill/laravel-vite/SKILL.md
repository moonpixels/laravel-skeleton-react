---
name: laravel-vite
description: Vite asset building and hot module replacement
compatibility: opencode
metadata:
  category: environment
  domain: frontend
---

## Vite Commands

**Development** (with HMR):
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
```

## Common Issues

**Manifest error**: Vite manifest not found
- Fix: Run `npm run build` or restart `npm run dev`

**Assets not updating**: HMR not working
- Fix: Restart `npm run dev`
- Check if dev server is running

## Integration

Vite compiles:
- TypeScript/React → JavaScript
- Tailwind CSS → Optimized CSS
- Asset fingerprinting for cache busting

## Configuration

- `vite.config.ts` - Vite configuration
- Tailwind v4 integrated via `@tailwindcss/vite`
- React Fast Refresh enabled

## When to Build

- Before deploying
- When Vite manifest errors occur
- After updating dependencies
