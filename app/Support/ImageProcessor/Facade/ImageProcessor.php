<?php

declare(strict_types=1);

namespace App\Support\ImageProcessor\Facade;

use Illuminate\Support\Facades\Facade;
use Override;

/**
 * @method static \App\Support\ImageProcessor\Contracts\ImageProcessor read(string $path)
 *
 * @see \App\Support\ImageProcessor\Contracts\ImageProcessor
 */
final class ImageProcessor extends Facade
{
    #[Override]
    protected static function getFacadeAccessor(): string
    {
        return \App\Support\ImageProcessor\Contracts\ImageProcessor::class;
    }
}
