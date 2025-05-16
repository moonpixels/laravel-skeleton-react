<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->unverified()->create();
    $this->actingAs($this->user);
});

test('email verification page can be rendered', function (): void {
    $this->get(route('verification.notice'))
        ->assertOk();
});

test('email verification page is not rendered when user is already verified', function (): void {
    $this->user->markEmailAsVerified();

    $this->get(route('verification.notice'))
        ->assertRedirect(route('dashboard'));
});
