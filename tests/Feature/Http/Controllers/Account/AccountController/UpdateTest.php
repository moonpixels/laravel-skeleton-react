<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('account can be updated', function (): void {
    Notification::fake();

    $this->put(route('account.update'), getUpdateAccountData())
        ->assertValid()
        ->assertRedirect();

    expect($this->user)
        ->name->toBe('Updated User')
        ->email->toBe('updated@example.com')
        ->email_verified_at->toBeNull();

    Notification::assertSentTo($this->user, VerifyEmail::class);
});

test('account can be updated without email change', function (): void {
    Notification::fake();

    $this->put(route('account.update'), getUpdateAccountData(['email' => $this->user->email]))
        ->assertValid()
        ->assertRedirect();

    expect($this->user)
        ->name->toBe('Updated User')
        ->email->toBe($this->user->email)
        ->email_verified_at->not()->toBeNull();

    Notification::assertNotSentTo($this->user, VerifyEmail::class);
});

function getUpdateAccountData(array $overrides = []): array
{
    return array_merge([
        'name' => 'Updated User',
        'email' => 'updated@example.com',
    ], $overrides);
}
