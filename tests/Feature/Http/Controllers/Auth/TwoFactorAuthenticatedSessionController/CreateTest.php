<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('two factor challenge page can be rendered', function (): void {
    $this->withSession([
        'login.id' => $this->user->id,
        'login.remember' => false,
    ])
        ->get(route('two-factor.login'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('auth/two-factor')
        );
});

test('two factor challenge page requires a challenged user', function (): void {
    $this->get(route('two-factor.login'))
        ->assertRedirect(route('login'));

    $this->post(route('two-factor.login'))
        ->assertRedirect(route('login'));
});
