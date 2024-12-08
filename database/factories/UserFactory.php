<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use App\Support\Localisation\Facades\Localisation;
use App\Support\TwoFactorAuthentication\Facades\TwoFactorAuthentication;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Override;

/**
 * @extends Factory<User>
 */
final class UserFactory extends Factory
{
    protected $model = User::class;

    #[Override]
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'language' => Localisation::getDefaultLocale(),
            'password' => Hash::make('password'),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'remember_token' => Str::random(10),
            'avatar_path' => null,
            'email_verified_at' => now(),
            'two_factor_confirmed_at' => null,
        ];
    }

    public function unverified(): self
    {
        return $this->state(fn (array $attributes): array => [
            'email_verified_at' => null,
        ]);
    }

    public function withTwoFactorAuth(): self
    {
        return $this->state(fn (array $attributes): array => [
            'two_factor_secret' => TwoFactorAuthentication::generateSecretKey(),
            'two_factor_recovery_codes' => ['recovery-code-1', 'recovery-code-2'],
            'two_factor_confirmed_at' => now(),
        ]);
    }

    public function withUnconfirmedTwoFactorAuth(): self
    {
        return $this->state(fn (array $attributes): array => [
            'two_factor_secret' => TwoFactorAuthentication::generateSecretKey(),
            'two_factor_recovery_codes' => ['recovery-code-1', 'recovery-code-2'],
        ]);
    }

    public function withAvatar(): self
    {
        return $this->state(fn (array $attributes): array => [
            'avatar_path' => UploadedFile::fake()->image('avatar.jpg')->storePublicly('avatars'),
        ]);
    }
}
