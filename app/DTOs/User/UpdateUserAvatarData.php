<?php

declare(strict_types=1);

namespace App\DTOs\User;

use Illuminate\Http\UploadedFile;

final readonly class UpdateUserAvatarData
{
    public function __construct(
        public ?UploadedFile $avatar,
    ) {}
}
