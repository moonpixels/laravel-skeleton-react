<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\DTOs\Auth\RegisterData;
use App\Models\User;
use App\Support\Localisation\Localisation;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;

final readonly class RegisterUserAction
{
    public function __construct(
        private Localisation $localisation
    ) {}

    public function handle(RegisterData $data): User
    {
        $user = User::query()->create([
            'name' => $data->name,
            'email' => $data->email,
            'language' => $this->getLanguage($data->language),
            'password' => Hash::make($data->password),
        ]);

        event(new Registered($user));

        return $user;
    }

    public function getLanguage(string $locale): string
    {
        $locales = [
            $this->localisation->getIso15897Locale($locale),
            $this->localisation->getLanguageFromLocale($locale),
        ];

        foreach ($locales as $locale) {
            if ($this->localisation->isSupportedLocale($locale)) {
                return $locale;
            }
        }

        return $this->localisation->getDefaultLocale();
    }
}
