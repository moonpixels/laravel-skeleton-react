<?php

declare(strict_types=1);

namespace App\DTOs\User;

final readonly class UpdateUserPreferencesData
{
    public function __construct(
        public string $language,
    ) {}
}
