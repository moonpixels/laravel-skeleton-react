<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('reset password link page can be rendered', function (): void {
    $this->get(route('password.request'))
        ->assertOk();
});
