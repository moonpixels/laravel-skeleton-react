<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

beforeEach(function (): void {
    $this->user = User::factory()->unverified()->create();
    $this->actingAs($this->user);
});

test('email verification can be resent', function (): void {
    Notification::fake();

    $this->post(route('verification.send'))
        ->assertRedirect();

    Notification::assertSentTo($this->user, VerifyEmail::class);
});

test('email verification is not resent when user is already verified', function (): void {
    Notification::fake();

    $this->user->markEmailAsVerified();

    $this->post(route('verification.send'))
        ->assertRedirect();

    Notification::assertNotSentTo($this->user, VerifyEmail::class);
});
