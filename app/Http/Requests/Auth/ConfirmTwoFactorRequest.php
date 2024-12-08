<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Support\TwoFactorAuthentication\Rules\ValidCode;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Foundation\Http\FormRequest;

final class ConfirmTwoFactorRequest extends FormRequest
{
    /**
     * @return array<string, list<ValidatorAwareRule|ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', new ValidCode],
        ];
    }
}
