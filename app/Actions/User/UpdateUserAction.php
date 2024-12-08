<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\DTOs\User\UpdateUserData;
use App\Models\User;

final class UpdateUserAction
{
    public function handle(User $user, UpdateUserData $data): User
    {
        $user->fill([
            'name' => $data->name,
            'email' => $data->email,
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($user->wasChanged('email')) {
            $user->sendEmailVerificationNotification();
        }

        return $user;
    }
}
