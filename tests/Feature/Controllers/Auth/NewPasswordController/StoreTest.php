<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('password can be reset with valid token', function (): void {
    Notification::fake();

    $this->post(route('password.request'), ['email' => $this->user->email]);

    Notification::assertSentTo($this->user, ResetPassword::class, function ($notification): bool {
        $this->post(route('password.store'), [
            'token' => $notification->token,
            'email' => $this->user->email,
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
            ->assertValid()
            ->assertRedirect();

        return true;
    });
});
