<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Actions\User\DeleteUserAction;
use App\Actions\User\UpdateUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Account\DeleteAccountRequest;
use App\Http\Requests\Account\UpdateAccountRequest;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class AccountController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('account/general');
    }

    public function update(
        UpdateAccountRequest $request,
        #[CurrentUser] User $user,
        UpdateUserAction $action
    ): RedirectResponse {
        $action->handle($user, $request->toDTO());

        return back();
    }

    public function destroy(
        DeleteAccountRequest $request,
        #[CurrentUser] User $user,
        DeleteUserAction $action
    ): RedirectResponse {
        auth('web')->logout();

        if (! $action->handle($user)) {
            auth('web')->login($user);

            return to_route('account.edit');
        }

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
