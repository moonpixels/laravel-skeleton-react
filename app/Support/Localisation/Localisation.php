<?php

declare(strict_types=1);

namespace App\Support\Localisation;

use Illuminate\Container\Attributes\Config;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use InvalidArgumentException;

/**
 * @phpstan-type  TSupportedLocale array{name: string, nativeName: string, regional: string}
 * @phpstan-type TSupportedLocales array<string, TSupportedLocale>
 */
final readonly class Localisation
{
    /**
     * @param  TSupportedLocales  $supportedLocales
     */
    public function __construct(
        #[Config('app.locale')] private string $defaultLocale,
        #[Config('localisation.supported_locales')] private array $supportedLocales,
        private Request $request
    ) {}

    public function getIso15897Locale(string $locale): string
    {
        return str_replace('-', '_', $locale);
    }

    public function getIso639Locale(string $locale): string
    {
        return str_replace('_', '-', $locale);
    }

    public function getLanguageFromLocale(string $locale): string
    {
        $locale = $this->getIso15897Locale($locale);

        $position = strpos($locale, '_');

        if ($position === 0 || $position === false) {
            return $locale;
        }

        return substr($locale, 0, $position);
    }

    /**
     * @throws InvalidArgumentException
     */
    public function setLocale(string $locale): void
    {
        throw_unless($this->isSupportedLocale($locale), InvalidArgumentException::class, "Locale [{$locale}] is not supported.");

        app()->setLocale($locale);
    }

    public function setLocaleFromRequest(): void
    {
        $userLocale = $this->getLocaleFromUser();
        $acceptLanguageLocale = $this->getLocaleFromAcceptLanguageHeader();

        $locale = $userLocale ?? $acceptLanguageLocale ?? $this->defaultLocale;

        $this->setLocale($locale);
    }

    /**
     * @return TSupportedLocales
     */
    public function getSupportedLocales(string $format = 'iso15897'): array
    {
        if ($format === 'iso15897') {
            return $this->supportedLocales;
        }

        return Arr::mapWithKeys($this->supportedLocales, fn (array $value, string $key): array => [
            $this->getIso639Locale($key) => [
                ...$value,
                'regional' => $this->getIso639Locale($value['regional']),
            ],
        ]);
    }

    public function getDefaultLocale(): string
    {
        return $this->defaultLocale;
    }

    public function isSupportedLocale(string $locale): bool
    {
        return isset($this->supportedLocales[$locale]);
    }

    private function getLocaleFromAcceptLanguageHeader(): ?string
    {
        return $this->request->getPreferredLanguage(array_keys($this->supportedLocales));
    }

    private function getLocaleFromUser(): ?string
    {
        $userLocale = $this->request->user()?->language;

        if (! $userLocale) {
            return null;
        }

        $locales = [
            $this->getIso15897Locale($userLocale),
        ];

        if ($this->isExtendedLocale($locales[0])) {
            $locales[] = $this->getLanguageFromLocale($locales[0]);
        }

        return $this->getSupportedLocale($locales);
    }

    private function isExtendedLocale(string $locale): bool
    {
        return str_contains($locale, '_') || str_contains($locale, '-');
    }

    /**
     * @param  string[]  $locales
     */
    private function getSupportedLocale(array $locales): ?string
    {
        return array_find($locales, fn (string $locale): bool => $this->isSupportedLocale($locale));
    }
}
