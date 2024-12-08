<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Hash;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('password can be updated', function (): void {
    $this->put(route('account.password.update'), getUpdatePasswordData())
        ->assertValid()
        ->assertRedirect();

    expect(Hash::check('new-password', $this->user->password))->toBeTrue();
});

test('correct password is required to update password', function (): void {
    $this->put(route('account.password.update'), getUpdatePasswordData('wrong-password'))
        ->assertInvalid('current_password')
        ->assertRedirect();

    expect(Hash::check('new-password', $this->user->password))->toBeFalse();
});

function getUpdatePasswordData(string $currentPassword = 'password', string $newPassword = 'new-password'): array
{
    return [
        'current_password' => $currentPassword,
        'password' => $newPassword,
        'password_confirmation' => $newPassword,
    ];
}
