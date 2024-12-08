<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\User;
use App\Support\Localisation\Facades\Localisation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

/**
 * @mixin User
 */
final class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    #[Override]
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->toAtomString(),
            'two_factor_confirmed_at' => $this->two_factor_confirmed_at?->toAtomString(),
            'language' => Localisation::getIso639Locale($this->language),
            'avatar_url' => $this->avatar_url,
        ];
    }
}
