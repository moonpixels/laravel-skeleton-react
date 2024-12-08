<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('reset password link can be requested', function (): void {
    Notification::fake();

    $this->post(route('password.email'), ['email' => $this->user->email])
        ->assertValid()
        ->assertRedirect();

    Notification::assertSentTo($this->user, ResetPassword::class);
});
