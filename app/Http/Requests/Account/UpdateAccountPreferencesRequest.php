<?php

declare(strict_types=1);

namespace App\Http\Requests\Account;

use App\DTOs\User\UpdateUserPreferencesData;
use App\Support\Localisation\Rules\SupportedLocale;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Foundation\Http\FormRequest;

final class UpdateAccountPreferencesRequest extends FormRequest
{
    /**
     * @return array<string, list<ValidatorAwareRule|ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'language' => ['required', 'string', new SupportedLocale],
        ];
    }

    public function toDTO(): UpdateUserPreferencesData
    {
        return new UpdateUserPreferencesData(
            language: $this->validated('language'),
        );
    }
}
