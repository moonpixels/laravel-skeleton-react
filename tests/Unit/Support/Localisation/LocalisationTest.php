<?php

declare(strict_types=1);

use App\Models\User;
use App\Support\Localisation\Localisation;
use Illuminate\Http\Request;

test('it can get the ISO 15897 locale', function (): void {
    $localisation = createLocalisation();

    expect($localisation->getIso15897Locale('en-GB'))->toBe('en_GB')
        ->and($localisation->getIso15897Locale('en_GB'))->toBe('en_GB')
        ->and($localisation->getIso15897Locale('en'))->toBe('en');
});

test('it can get the ISO 639 locale', function (): void {
    $localisation = createLocalisation();

    expect($localisation->getIso639Locale('en-GB'))->toBe('en-GB')
        ->and($localisation->getIso639Locale('en_GB'))->toBe('en-GB')
        ->and($localisation->getIso639Locale('en'))->toBe('en');
});

test('it can get the language from the locale', function (): void {
    $localisation = createLocalisation();

    expect($localisation->getLanguageFromLocale('en-GB'))->toBe('en')
        ->and($localisation->getLanguageFromLocale('en_GB'))->toBe('en')
        ->and($localisation->getLanguageFromLocale('en'))->toBe('en');
});

test('it can set the locale', function (): void {
    $localisation = createLocalisation();

    $localisation->setLocale('en_GB');

    expect(app()->getLocale())->toBe('en_GB');
});

test('it throws an exception when setting an unsupported locale', function (): void {
    $localisation = createLocalisation();

    $localisation->setLocale('invalid');
})->throws('InvalidArgumentException');

test('it can set the locale from a request with an accept language header', function (): void {
    $localisation = createLocalisation();

    $localisation->setLocaleFromRequest();

    expect(app()->getLocale())->toBe('en_GB');
});

test('it can set the locale from a request with an authenticated user', function (): void {
    $user = User::factory()->create(['language' => 'fr_FR']);

    $request = new Request;
    $request->setUserResolver(fn () => $user);

    $localisation = createLocalisation(request: $request);

    $localisation->setLocaleFromRequest();

    expect(app()->getLocale())->toBe('fr_FR');
});

test('it can handle a user with an invalid locale', function (): void {
    $user = User::factory()->create(['language' => 'invalid']);

    $request = new Request;
    $request->setUserResolver(fn () => $user);

    $localisation = createLocalisation(request: $request);

    $localisation->setLocaleFromRequest();

    expect(app()->getLocale())->toBe('en_GB');
});

test('it can set the locale from a request with no locale information', function (): void {
    $localisation = createLocalisation(request: new Request);

    $localisation->setLocaleFromRequest();

    expect(app()->getLocale())->toBe('en_GB');
});

test('it can get an array of supported locales in ISO 15897 format', function (): void {
    $localisation = createLocalisation();

    expect($localisation->getSupportedLocales())->toBeArray()
        ->and($localisation->getSupportedLocales())->toHaveKeys(['en_GB', 'fr_FR'])
        ->and($localisation->getSupportedLocales()['en_GB'])->toHaveKey('regional', 'en_GB')
        ->and($localisation->getSupportedLocales()['fr_FR'])->toHaveKey('regional', 'fr_FR');
});

test('it can get an array of supported locales in ISO 639 format', function (): void {
    $localisation = createLocalisation();

    expect($localisation->getSupportedLocales('iso639'))->toBeArray()
        ->and($localisation->getSupportedLocales('iso639'))->toHaveKeys(['en-GB', 'fr-FR'])
        ->and($localisation->getSupportedLocales('iso639')['en-GB'])->toHaveKey('regional', 'en-GB')
        ->and($localisation->getSupportedLocales('iso639')['fr-FR'])->toHaveKey('regional', 'fr-FR');
});

test('it can get the default locale', function (): void {
    $localisation = createLocalisation();

    expect($localisation->getDefaultLocale())->toBe('en_GB');
});

test('it can check if a locale is supported', function (): void {
    $localisation = createLocalisation();

    expect($localisation->isSupportedLocale('en_GB'))->toBeTrue()
        ->and($localisation->isSupportedLocale('fr_FR'))->toBeTrue()
        ->and($localisation->isSupportedLocale('invalid'))->toBeFalse();
});

function createLocalisation(
    ?string $defaultLocale = null,
    ?array $supportedLocales = null,
    ?Request $request = null
): Localisation {
    if ($defaultLocale === null) {
        $defaultLocale = 'en_GB';
    }

    if ($supportedLocales === null) {
        $supportedLocales = [
            'en_GB' => ['name' => 'English', 'nativeName' => 'English', 'regional' => 'en_GB'],
            'fr_FR' => ['name' => 'French', 'nativeName' => 'Français', 'regional' => 'fr_FR'],
        ];
    }

    if (! $request instanceof Request) {
        $request = new Request;
        $request->headers->set('accept-language', 'en-GB,en;q=0.5');
    }

    return new Localisation($defaultLocale, $supportedLocales, $request);
}
