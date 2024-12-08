<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

final readonly class RegisterData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $language,
        public string $password,
    ) {}
}
