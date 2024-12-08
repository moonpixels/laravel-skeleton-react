<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\DTOs\User\UpdateUserPreferencesData;
use App\Models\User;

final class UpdateUserPreferencesAction
{
    public function handle(User $user, UpdateUserPreferencesData $data): User
    {
        $user->update([
            'language' => $data->language,
        ]);

        return $user;
    }
}
