<?php

declare(strict_types=1);

use App\Models\User;

test('users can login', function (): void {
    $user = User::factory()->create();

    visit(route('login'))
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->press('Log in')
        ->assertRoute('dashboard');
});

test('users with invalid credentials cannot login', function (): void {
    visit(route('login'))
        ->fill('email', 'test@example.com')
        ->fill('password', 'wrong-password')
        ->press('Log in')
        ->assertSee('These credentials do not match our records.');
});
