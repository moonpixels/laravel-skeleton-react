<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Override;

final class VerifiedEmailController extends Controller implements HasMiddleware
{
    #[Override]
    public static function middleware(): array
    {
        return [
            new Middleware(['signed', 'throttle:6,1'], only: ['store']),
        ];
    }

    public function show(#[CurrentUser] User $user): RedirectResponse|Response
    {
        return $user->hasVerifiedEmail()
            ? redirect()->intended('home')
            : Inertia::render('auth/verify-email', ['status' => session('status')]);
    }

    public function store(EmailVerificationRequest $request): RedirectResponse
    {
        $request->fulfill();

        return redirect()->intended('home');
    }
}
