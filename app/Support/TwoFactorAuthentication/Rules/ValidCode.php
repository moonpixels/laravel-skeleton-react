<?php

declare(strict_types=1);

namespace App\Support\TwoFactorAuthentication\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Override;

final class ValidCode implements ValidationRule
{
    #[Override]
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! request()->user()?->verifyTwoFactorCode((string) $value)) {
            $fail('validation.2fa_code')->translate();
        }
    }
}
