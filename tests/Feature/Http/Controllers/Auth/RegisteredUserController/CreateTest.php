<?php

declare(strict_types=1);

use Inertia\Testing\AssertableInertia;

test('registration page can be rendered', function (): void {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page): AssertableInertia => $page
            ->component('auth/register')
        );
});
