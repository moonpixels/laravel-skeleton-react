<?php

declare(strict_types=1);

namespace App\Models;

use App\Support\TwoFactorAuthentication\Concerns\TwoFactorAuthenticatable;
use Carbon\Carbon;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Override;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $language
 * @property string $password
 * @property ?string $two_factor_secret
 * @property ?list<string> $two_factor_recovery_codes
 * @property ?string $remember_token
 * @property ?string $avatar_path
 * @property ?Carbon $email_verified_at
 * @property ?Carbon $two_factor_confirmed_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property-read ?string $avatar_url
 */
final class User extends Authenticatable implements MustVerifyEmail
{
    /**
     * @use HasFactory<UserFactory>
     * @use TwoFactorAuthenticatable<User>
     */
    use HasFactory, MassPrunable, Notifiable, TwoFactorAuthenticatable;

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'language' => 'en',
        'avatar_path' => null,
    ];

    /**
     * @return Builder<covariant $this>
     */
    public function prunable(): Builder
    {
        return self::query()
            ->whereNull('email_verified_at')
            ->where('created_at', '<=', now()->subDay());
    }

    /**
     * @return Attribute<string|null, never>
     */
    public function avatarUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->avatar_path
            ? Storage::url($this->avatar_path)
            : null
        );
    }

    #[Override]
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_secret' => 'encrypted',
            'two_factor_recovery_codes' => 'encrypted:array',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
