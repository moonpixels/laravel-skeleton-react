<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class TwoFactorLoginRequest extends FormRequest
{
    private ?User $challengedUser = null;

    /**
     * @return array<string, list<ValidatorAwareRule|ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'code' => ['nullable', 'string'],
            'is_recovery' => ['nullable', 'boolean'],
        ];
    }

    public function hasChallengedUser(): bool
    {
        return (bool) $this->getChallengedUser();
    }

    /**
     * @throws ValidationException
     */
    public function authenticate(): RedirectResponse
    {
        if (! ($user = $this->getChallengedUser()) instanceof User) {
            throw new HttpResponseException(redirect()->route('login'));
        }

        $this->ensureIsNotRateLimited();

        if ($this->boolean('is_recovery')) {
            $this->validateRecoveryCode();
        } else {
            $this->validateCode();
        }

        Auth::guard('web')->login($user, $this->remember());

        RateLimiter::clear($this->throttleKey());

        $this->session()->forget('login');

        $this->session()->regenerate();

        return redirect()->intended('dashboard');
    }

    private function getChallengedUser(): ?User
    {
        if ($this->challengedUser instanceof User) {
            return $this->challengedUser;
        }

        $user = User::find($this->session()->get('login.id'));

        if ($user instanceof User) {
            return $this->challengedUser = $user;
        }

        return null;
    }

    /**
     * @throws ValidationException
     */
    private function ensureIsNotRateLimited(): void
    {
        if (RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            $seconds = RateLimiter::availableIn($this->throttleKey());

            throw ValidationException::withMessages([
                'code' => __('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => ceil($seconds / 60),
                ]),
            ]);
        }
    }

    private function throttleKey(): string
    {
        $email = Str::lower($this->getChallengedUser()->email ?? '');

        return Str::transliterate("two_factor_login_attempt:{$email}:{$this->ip()}");
    }

    /**
     * @throws ValidationException
     */
    private function validateRecoveryCode(): void
    {
        if (! $this->input('code') || $this->getChallengedUser()?->verifyTwoFactorRecoveryCode($this->input('code')) !== true) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'code' => __('validation.invalid_recovery_code'),
            ]);
        }

        $this->getChallengedUser()->replaceRecoveryCode($this->input('code'));
    }

    /**
     * @throws ValidationException
     */
    private function validateCode(): void
    {
        if (! $this->input('code') || $this->getChallengedUser()?->verifyTwoFactorCode($this->input('code')) !== true) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'code' => __('validation.invalid_code'),
            ]);
        }
    }

    private function remember(): bool
    {
        return $this->session()->get('login.remember', false);
    }
}
