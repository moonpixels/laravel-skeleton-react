<?php

declare(strict_types=1);

namespace App\Http\Requests\Account;

use App\DTOs\User\UpdateUserPreferencesData;
use App\Support\Localisation\Facades\Localisation;
use App\Support\Localisation\Rules\SupportedLocale;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

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

    #[Override]
    protected function prepareForValidation(): void
    {
        // Convert the language string to ISO 15897 format
        if ($this->has('language')) {
            $this->merge([
                'language' => Localisation::getIso15897Locale($this->input('language')),
            ]);
        }
    }
}
