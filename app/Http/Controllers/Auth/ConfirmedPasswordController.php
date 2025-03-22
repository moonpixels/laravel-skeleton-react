<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ConfirmPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class ConfirmedPasswordController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/confirm-password');
    }

    public function store(ConfirmPasswordRequest $request): RedirectResponse
    {
        $request->session()->passwordConfirmed();

        return redirect()->intended('dashboard');
    }
}
