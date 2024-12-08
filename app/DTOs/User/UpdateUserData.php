<?php

declare(strict_types=1);

namespace App\DTOs\User;

final readonly class UpdateUserData
{
    public function __construct(
        public string $name,
        public string $email,
    ) {}
}
