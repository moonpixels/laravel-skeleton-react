<?php

declare(strict_types=1);

namespace App\Http\Requests\Account;

use App\DTOs\User\UpdateUserAvatarData;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rules\File;

final class UpdateAccountAvatarRequest extends FormRequest
{
    /**
     * @return array<string, list<ValidatorAwareRule|ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'avatar' => ['nullable', File::image()->max(1024 * 5)],
        ];
    }

    public function toDTO(): UpdateUserAvatarData
    {
        $file = $this->file('avatar') instanceof UploadedFile ? $this->file('avatar') : null;

        return new UpdateUserAvatarData(
            avatar: $file,
        );
    }
}
