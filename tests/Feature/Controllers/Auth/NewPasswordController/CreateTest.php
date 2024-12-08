<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('reset password page can be rendered', function (): void {
    Notification::fake();

    $this->post(route('password.request'), ['email' => $this->user->email]);

    Notification::assertSentTo($this->user, ResetPassword::class, function ($notification): bool {
        $this->get(route('password.reset', ['token' => $notification->token]))
            ->assertOk();

        return true;
    });
});
