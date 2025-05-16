<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake();

    $this->user = User::factory()->withAvatar()->create();
    $this->previousAvatarPath = $this->user->avatar_path;
    $this->actingAs($this->user);
});

test('avatar can be removed', function (): void {
    $this->delete(route('account.avatar.destroy'))
        ->assertValid()
        ->assertRedirect();

    expect($this->user->avatar_path)->toBeNull()
        ->and($this->previousAvatarPath)->not->toExistInStorage();
});
