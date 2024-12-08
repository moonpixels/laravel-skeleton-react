<?php

declare(strict_types=1);

namespace App\Support\Localisation\Rules;

use App\Support\Localisation\Facades\Localisation;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Override;

final class SupportedLocale implements ValidationRule
{
    #[Override]
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! Localisation::isSupportedLocale($value)) {
            $fail('validation.in')->translate();
        }
    }
}
