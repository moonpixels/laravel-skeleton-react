<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('users can logout', function (): void {
    $this->post(route('logout'))
        ->assertRedirect('/');

    $this->assertGuest();
});
