<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\assertModelMissing;

expect()->extend('toBeDeleted', function () {
    assertModelMissing($this->value);

    return $this;
});

expect()->extend('toExistInStorage', function (?string $disk = null) {
    Storage::disk($disk)->assertExists($this->value);

    return $this;
});
