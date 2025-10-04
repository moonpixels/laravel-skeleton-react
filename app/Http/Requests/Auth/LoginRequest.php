<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class LoginRequest extends FormRequest
{
    /**
     * @return array<string, list<ValidatorAwareRule|ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'nullable', 'boolean'],
        ];
    }

    public function authenticate(): RedirectResponse
    {
        $this->ensureIsNotRateLimited();

        $this->validateCredentials();

        RateLimiter::clear($this->throttleKey());

        $user = User::query()->where('email', $this->input('email'))->first();

        if ($user?->hasTwoFactorAuthenticationEnabled()) {
            return $this->redirectUserToTwoFactorLogin($user);
        }

        Auth::guard('web')->attempt(
            $this->only('email', 'password'),
            $this->boolean('remember')
        );

        $this->session()->regenerate();

        return redirect()->intended('dashboard');
    }

    /**
     * @throws ValidationException
     */
    private function ensureIsNotRateLimited(): void
    {
        if (RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            $seconds = RateLimiter::availableIn($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }
    }

    private function throttleKey(): string
    {
        $email = Str::lower($this->input('email'));

        return Str::transliterate("login_attempt:{$email}:{$this->ip()}");
    }

    /**
     * @throws ValidationException
     */
    private function validateCredentials(): void
    {
        if (! Auth::guard('web')->validate($this->only('email', 'password'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }
    }

    private function redirectUserToTwoFactorLogin(User $user): RedirectResponse
    {
        $this->session()->put([
            'login.id' => $user->getKey(),
            'login.remember' => $this->boolean('remember'),
        ]);

        return redirect()->route('two-factor.login');
    }
}
