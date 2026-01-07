---
name: laravel-i18n
description: Internationalization with i18next and Laravel
compatibility: opencode
metadata:
  category: environment
  domain: i18n
---

## Frontend (React)

**Setup**: i18next with browser language detection

**Usage**:
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

return <h1>{t('welcome')}</h1>;
```

**Files**: 
- `resources/locales/en-GB/translation.json`
- `resources/locales/en-GB/validation.json`

## Backend (Laravel)

**Usage**:
```php
__('key')
trans('key')
@lang('key')  // In Blade
```

**Files**: `lang/en_GB/` directory

## Adding Translations

1. Add key to `resources/locales/{locale}/translation.json`
2. Use `t('key')` in React components
3. Add backend translations in `lang/{locale}/` if needed

## Supported Locales

Check `Localisation` support class for available locales.
