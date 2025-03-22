<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('login page can be rendered', function (): void {
    $this->get(route('login'))
        ->assertOk();
});

test('user is redirected to the dashboard page if already authenticated', function (): void {
    $this->actingAs($this->user)
        ->get(route('login'))
        ->assertRedirect(route('dashboard'));
});
