<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Artisan;

test('unverified users are pruned after 24 hours', function (): void {
    $unverifiedUser = User::factory()
        ->unverified()
        ->create([
            'created_at' => now()->subDay(),
        ]);

    $verifiedUser = User::factory()
        ->create([
            'created_at' => now()->subDay(),
        ]);

    Artisan::call('model:prune');

    expect($unverifiedUser)->toBeDeleted()
        ->and($verifiedUser)->not->toBeDeleted();
});
