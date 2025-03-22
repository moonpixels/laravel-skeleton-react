<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(
        RegisterRequest $request,
        RegisterUserAction $action
    ): RedirectResponse {
        $user = $action->handle($request->toDTO());

        auth('web')->login($user);

        $request->session()->regenerate();

        return redirect('dashboard');
    }
}
