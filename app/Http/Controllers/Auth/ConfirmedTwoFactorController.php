<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\ConfirmTwoFactorAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ConfirmTwoFactorRequest;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;

final class ConfirmedTwoFactorController extends Controller
{
    public function store(
        ConfirmTwoFactorRequest $request,
        #[CurrentUser] User $user,
        ConfirmTwoFactorAction $action
    ): RedirectResponse {
        $action->handle($user);

        return back();
    }
}
