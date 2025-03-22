<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;

beforeEach(function (): void {
    $this->user = User::factory()->unverified()->create();
    $this->actingAs($this->user);
});

test('email can be verified', function (): void {
    Event::fake();

    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $this->user->id, 'hash' => sha1((string) $this->user->email)]
    );

    $this->get($verificationUrl)
        ->assertRedirect(route('dashboard'));

    expect($this->user->hasVerifiedEmail())->toBeTrue();

    Event::assertDispatched(Verified::class);
});

test('email is not verified with invalid hash', function (): void {
    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $this->user->id, 'hash' => sha1('wrong-email')]
    );

    $this->get($verificationUrl)
        ->assertForbidden();

    expect($this->user->hasVerifiedEmail())->toBeFalse();
});
