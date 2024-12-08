<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('confirm password page can be rendered', function (): void {
    $this->get(route('password.confirm'))
        ->assertOk();
});
