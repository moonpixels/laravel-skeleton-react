<?php

declare(strict_types=1);

namespace App\Support\ImageProcessor\Providers\Intervention;

use App\Support\ImageProcessor\Contracts\ImageProcessor;
use App\Support\ImageProcessor\Enums\ImageFormat;
use App\Support\ImageProcessor\Exceptions\DecoderException;
use App\Support\ImageProcessor\Exceptions\EncoderException;
use App\Support\ImageProcessor\Exceptions\RuntimeException;
use Intervention\Image\Encoders\AutoEncoder;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Exceptions\RuntimeException as InterventionRuntimeException;
use Intervention\Image\ImageManager;
use Intervention\Image\Interfaces\EncoderInterface;
use Intervention\Image\Interfaces\ImageInterface;
use Override;

final class InterventionImageProcessor implements ImageProcessor
{
    public ImageInterface $image;

    private int $quality = 100;

    private ?ImageFormat $format = null;

    public function __construct(private readonly ImageManager $manager) {}

    #[Override]
    public function save(?string $path = null): void
    {
        try {
            $encodedImage = $this->image->encode($this->getEncoder());

            $path ??= ensure($this->image->origin()->filePath())->isString();

            $encodedImage->save($path);
        } catch (InterventionRuntimeException $interventionRuntimeException) {
            throw new EncoderException($interventionRuntimeException->getMessage());
        }
    }

    #[Override]
    public function cover(int $width, int $height): ImageProcessor
    {
        try {
            $this->image->cover($width, $height);

            return $this;
        } catch (InterventionRuntimeException $interventionRuntimeException) {
            throw new RuntimeException($interventionRuntimeException->getMessage());
        }
    }

    #[Override]
    public function toWebp(): ImageProcessor
    {
        $this->format = ImageFormat::Webp;

        return $this;
    }

    #[Override]
    public function optimize(int $quality = 80): ImageProcessor
    {
        $this->quality = $quality;

        return $this;
    }

    #[Override]
    public function read(string $path): ImageProcessor
    {
        try {
            $this->image = $this->manager->read($path);
        } catch (InterventionRuntimeException $interventionRuntimeException) {
            throw new DecoderException($interventionRuntimeException->getMessage());
        }

        return $this;
    }

    private function getEncoder(): EncoderInterface
    {
        return match ($this->format) {
            ImageFormat::Webp => new WebpEncoder(quality: $this->quality),
            default => new AutoEncoder(quality: $this->quality),
        };
    }
}
