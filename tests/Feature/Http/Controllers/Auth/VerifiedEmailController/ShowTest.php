<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

beforeEach(function (): void {
    $this->user = User::factory()->unverified()->create();
    $this->actingAs($this->user);
});

test('email verification page can be rendered', function (): void {
    $this->get(route('verification.notice'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('auth/verify-email')
        );
});

test('email verification page is not rendered when user is already verified', function (): void {
    $this->user->markEmailAsVerified();

    $this->get(route('verification.notice'))
        ->assertRedirect(route('dashboard.index'));
});
