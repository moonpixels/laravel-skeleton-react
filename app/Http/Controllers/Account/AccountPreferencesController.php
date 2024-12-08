<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Actions\User\UpdateUserPreferencesAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Account\UpdateAccountPreferencesRequest;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class AccountPreferencesController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Account/Preferences');
    }

    public function update(
        UpdateAccountPreferencesRequest $request,
        #[CurrentUser] User $user,
        UpdateUserPreferencesAction $action
    ): RedirectResponse {
        $action->handle($user, $request->toDTO());

        return back();
    }
}
