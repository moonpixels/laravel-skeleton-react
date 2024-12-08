<?php

declare(strict_types=1);

namespace App\Providers;

use App\Support\ImageProcessor\Contracts\ImageProcessor;
use App\Support\ImageProcessor\Providers\Intervention\InterventionImageProcessor;
use Illuminate\Support\ServiceProvider;
use Intervention\Image\Drivers\Imagick\Driver;
use Intervention\Image\ImageManager;
use Override;

final class ImageProcessorServiceProvider extends ServiceProvider
{
    #[Override]
    public function register(): void
    {
        $this->app->bind(ImageProcessor::class, function (): ImageProcessor {
            $manager = new ImageManager(driver: new Driver);

            return new InterventionImageProcessor(manager: $manager);
        });
    }
}
