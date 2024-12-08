<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\DisableTwoFactorAction;
use App\Actions\Auth\EnableTwoFactorAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\DisableTwoFactorRequest;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

final class TwoFactorController extends Controller
{
    public function store(
        #[CurrentUser] User $user,
        EnableTwoFactorAction $action
    ): JsonResponse {
        abort_unless($action->handle($user), 500);

        return response()->json([
            'qrCode' => $user->getTwoFactorQrCodeSvg(),
            'secret' => $user->two_factor_secret,
        ]);
    }

    public function destroy(
        DisableTwoFactorRequest $request,
        #[CurrentUser] User $user,
        DisableTwoFactorAction $action
    ): RedirectResponse {
        $action->handle($user);

        return back();
    }
}
