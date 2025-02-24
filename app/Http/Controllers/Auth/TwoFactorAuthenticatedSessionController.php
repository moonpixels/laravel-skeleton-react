<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TwoFactorLoginRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class TwoFactorAuthenticatedSessionController extends Controller
{
    /**
     * @throws HttpResponseException
     */
    public function create(TwoFactorLoginRequest $request): Response
    {
        if (! $request->hasChallengedUser()) {
            throw new HttpResponseException(redirect()->route('login'));
        }

        return Inertia::render('auth/two-factor');
    }

    public function store(TwoFactorLoginRequest $request): RedirectResponse
    {
        return $request->authenticate();
    }
}
