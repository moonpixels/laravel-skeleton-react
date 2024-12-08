<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('account can be deleted', function (): void {
    $this->delete(route('account.destroy'), ['password' => 'password'])
        ->assertValid()
        ->assertRedirect('/');

    $this->assertGuest();

    expect($this->user)->toBeDeleted();
});

test('correct password is required to delete account', function (): void {
    $this->delete(route('account.destroy'), ['password' => 'wrong-password'])
        ->assertInvalid('password');

    $this->assertAuthenticatedAs($this->user);

    expect($this->user)->not->toBeDeleted();
});

test('no action is taken when a delete request fails', function (): void {
    User::deleting(fn (): false => false);

    $this->delete(route('account.destroy'), ['password' => 'password'])
        ->assertRedirect(route('account.edit'));

    $this->assertAuthenticatedAs($this->user);

    expect($this->user)->not->toBeDeleted();
});
