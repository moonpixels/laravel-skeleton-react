<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\User\UpdateUserPasswordAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Account\UpdateAccountPasswordRequest;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;

final class PasswordController extends Controller
{
    public function update(
        UpdateAccountPasswordRequest $request,
        #[CurrentUser] User $user,
        UpdateUserPasswordAction $action
    ): RedirectResponse {
        $action->handle($user, $request->validated('password'));

        return back();
    }
}
