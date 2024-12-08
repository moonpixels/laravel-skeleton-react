<?php

declare(strict_types=1);

namespace App\Support\ImageProcessor\Contracts;

use App\Support\ImageProcessor\Exceptions\DecoderException;
use App\Support\ImageProcessor\Exceptions\EncoderException;
use App\Support\ImageProcessor\Exceptions\RuntimeException;

interface ImageProcessor
{
    /**
     * @throws DecoderException
     */
    public function read(string $path): self;

    /**
     * @throws EncoderException
     */
    public function save(?string $path = null): void;

    /**
     * @throws RuntimeException
     */
    public function cover(int $width, int $height): self;

    /**
     * @throws RuntimeException
     */
    public function toWebp(): self;

    /**
     * @throws EncoderException
     */
    public function optimize(int $quality = 80): self;
}
