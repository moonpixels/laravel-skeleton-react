<?php

declare(strict_types=1);

use App\Helpers\Ensure;

test('ensure helper', function (): void {
    expect(ensure('string'))->toBeInstanceOf(Ensure::class);
});
