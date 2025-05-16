<?php

declare(strict_types=1);

use App\Models\User;
use App\Support\ImageProcessor\Contracts\ImageProcessor;
use App\Support\ImageProcessor\Exceptions\DecoderException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake();

    $this->user = User::factory()->withAvatar()->create();
    $this->previousAvatarPath = $this->user->avatar_path;
    $this->actingAs($this->user);
});

test('avatar can be set', function (): void {
    $this->user->forceFill(['avatar_path' => null])->save();

    $file = UploadedFile::fake()->image('avatar.jpg');

    $this->put(route('account.avatar.update'), ['avatar' => $file])
        ->assertValid()
        ->assertRedirect();

    expect($this->user)
        ->avatar_path->not->toBeNull()
        ->avatar_path->toExistInStorage();
});

test('avatar can be replaced', function (): void {
    $file = UploadedFile::fake()->image('new-avatar.jpg');

    $this->put(route('account.avatar.update'), ['avatar' => $file])
        ->assertValid()
        ->assertRedirect();

    expect($this->user)
        ->avatar_path->not->toBe($this->previousAvatarPath)
        ->avatar_path->toExistInStorage()
        ->and($this->previousAvatarPath)->not->toExistInStorage();
});

test('avatar must be an image', function (): void {
    $file = UploadedFile::fake()->create('not-an-image.txt');

    $this->put(route('account.avatar.update'), ['avatar' => $file])
        ->assertInvalid('avatar');

    expect($this->user->avatar_path)->toBe($this->previousAvatarPath);
});

test('avatar must be no more than 5MB', function (): void {
    $file = UploadedFile::fake()->image('avatar.jpg')->size((1024 * 5) + 1);

    $this->put(route('account.avatar.update'), ['avatar' => $file])
        ->assertInvalid('avatar');

    expect($this->user->avatar_path)->toBe($this->previousAvatarPath);
});

test('avatar is resized and optimised', function (): void {
    $file = UploadedFile::fake()->image('avatar.jpg')->size(1024 * 5);

    $this->put(route('account.avatar.update'), ['avatar' => $file])
        ->assertValid()
        ->assertRedirect();

    $avatarPath = $this->user->avatar_path;

    $image = new Imagick;
    $image->readImageBlob(Storage::get($avatarPath));

    expect($image->getImageWidth())->toBe(128)
        ->and($image->getImageHeight())->toBe(128)
        ->and($image->getImageMimeType())->toContain('webp')
        ->and($image->getImageLength())->toBeLessThan(1024 * 5);
});

test('avatar is not updated if an error occurs', function (): void {
    $mock = Mockery::mock(ImageProcessor::class);

    $mock->shouldReceive('read')
        ->once()
        ->andThrow(new DecoderException);

    $this->app->instance(ImageProcessor::class, $mock);

    $file = UploadedFile::fake()->image('avatar.jpg');

    $this->put(route('account.avatar.update'), ['avatar' => $file])
        ->assertInvalid('avatar');

    expect($this->user->avatar_path)->toBe($this->previousAvatarPath);
});
