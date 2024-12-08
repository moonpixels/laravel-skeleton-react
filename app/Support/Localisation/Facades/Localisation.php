<?php

declare(strict_types=1);

namespace App\Support\Localisation\Facades;

use Illuminate\Support\Facades\Facade;
use Override;

/**
 * @method static string getIso15897Locale(string $locale)
 * @method static string getIso639Locale(string $locale)
 * @method static string getLanguageFromLocale(string $locale)
 * @method static void setLocale(string $locale)
 * @method static void setLocaleFromRequest()
 * @method static array getSupportedLocales(string $format = 'iso15897')
 * @method static string getDefaultLocale()
 * @method static bool isSupportedLocale(string $locale)
 *
 * @see \App\Support\Localisation\Localisation
 */
final class Localisation extends Facade
{
    #[Override]
    protected static function getFacadeAccessor(): string
    {
        return \App\Support\Localisation\Localisation::class;
    }
}
