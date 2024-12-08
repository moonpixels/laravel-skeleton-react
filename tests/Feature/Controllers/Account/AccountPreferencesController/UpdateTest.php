<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('preferences can be updated', function (): void {
    $this->put(route('account.preferences.update'), ['language' => 'en'])
        ->assertValid()
        ->assertRedirect();

    expect($this->user->language)->toBe('en')
        ->and(app()->getLocale())->toBe('en');
});

test('language cannot be updated to an unsupported locale', function (): void {
    $this->put(route('account.preferences.update'), ['language' => 'invalid'])
        ->assertInvalid('language');

    expect($this->user->language)->not()->toBe('invalid')
        ->and(app()->getLocale())->not()->toBe('invalid');
});
