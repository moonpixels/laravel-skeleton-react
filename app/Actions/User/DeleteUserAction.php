<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;

final class DeleteUserAction
{
    public function handle(User $user): bool
    {
        return (bool) $user->delete();
    }
}
