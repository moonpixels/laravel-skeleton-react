<?php

declare(strict_types=1);

namespace App\Http\Requests\Account;

use App\DTOs\User\UpdateUserData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Foundation\Http\FormRequest;

final class UpdateAccountRequest extends FormRequest
{
    /**
     * @return array<string, list<ValidatorAwareRule|ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                "unique:users,email,{$this->user()?->id}",
            ],
        ];
    }

    public function toDTO(): UpdateUserData
    {
        return new UpdateUserData(
            name: $this->validated('name'),
            email: $this->validated('email'),
        );
    }
}
