<?php

declare(strict_types=1);

use App\Support\ImageProcessor\Exceptions\DecoderException;
use App\Support\ImageProcessor\Exceptions\EncoderException;
use App\Support\ImageProcessor\Providers\Intervention\InterventionImageProcessor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\Exceptions\RuntimeException as InterventionRuntimeException;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\ImageInterface;

beforeEach(function (): void {
    $this->processor = new InterventionImageProcessor(new ImageManager(new Driver));
});

it('reads from a valid image path', function (): void {
    $path = createFakeImage();

    expect($this->processor->read($path))->toBeInstanceOf(InterventionImageProcessor::class);
});

it('throws a decoder exception when reading from an invalid image path', function (): void {
    $this->processor->read('invalid-image-path.jpg');
})->throws(DecoderException::class);

it('saves the image with a new path', function (): void {
    $path = createFakeImage();

    $newPath = Str::replaceLast('.jpg', '.new.jpg', $path);

    $this->processor->read($path)->save($newPath);

    expect(Storage::exists(relativePath($newPath)))->toBeTrue();
});

it('saves the image with the same path', function (): void {
    $path = createFakeImage();

    $this->processor->read($path)->save();

    expect(Storage::exists(relativePath($path)))->toBeTrue();
});

it('throws an encoder exception if the image cannot be saved', function (): void {
    $path = createFakeImage();

    $this->processor->read($path)->save('');
})->throws(EncoderException::class);

it('resizes the image to cover the given dimensions', function (): void {
    $path = createFakeImage();

    $this->processor->read($path)->cover(100, 100)->save();

    expect($this->processor->image->width())->toBe(100)
        ->and($this->processor->image->height())->toBe(100);
});

it('throws a runtime exception if the image cannot be resized', function (): void {
    $mock = Mockery::mock(ImageInterface::class);

    $mock->shouldReceive('cover')
        ->once()
        ->andThrow(new InterventionRuntimeException);

    $this->processor->image = $mock;

    $this->processor->cover(100, 100);
})->throws(RuntimeException::class);

it('formats the image to webp', function (): void {
    $path = createFakeImage();

    $newPath = Str::replaceLast('.jpg', '.webp', $path);

    $this->processor->read($path)->toWebp()->save($newPath);

    expect(Storage::mimeType(relativePath($newPath)))->toBe('image/webp');
});

it('throws a runtime exception if the image cannot be formatted to webp', function (): void {
    $mock = Mockery::mock(ImageInterface::class);

    $mock->shouldReceive('encode')
        ->once()
        ->andThrow(new InterventionRuntimeException);

    $this->processor->image = $mock;

    $this->processor->toWebp()->save();
})->throws(RuntimeException::class);

it('optimizes the image', function (): void {
    $path = createFakeImage();

    $newPath = Str::replaceLast('.jpg', '.new.jpg', $path);

    $this->processor->read($path)->optimize()->save($newPath);

    expect(Storage::size(relativePath($newPath)))->toBeLessThan(Storage::size(relativePath($path)));
});

function createFakeImage(): string
{
    Storage::fake();

    return Storage::path(UploadedFile::fake()->image('image.jpg')->store());
}

function relativePath(string $path): string
{
    return Str::afterLast($path, '/');
}
