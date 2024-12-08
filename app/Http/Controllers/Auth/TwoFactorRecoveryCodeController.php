<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

final class TwoFactorRecoveryCodeController extends Controller
{
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        return response()->json([
            'recoveryCodes' => $user->two_factor_recovery_codes,
        ]);
    }
}
