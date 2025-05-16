<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('password can be confirmed', function (): void {
    $this->post(route('password.confirm'), ['password' => 'password'])
        ->assertValid()
        ->assertRedirect();
});

test('password is not confirmed with invalid password', function (): void {
    $this->post(route('password.confirm'), ['password' => 'wrong-password'])
        ->assertInvalid();
});
