<?php

declare(strict_types=1);

use Illuminate\Database\Eloquent\Model;

arch('models')
    ->expect('App\Models')
    ->toBeClasses()
    ->toExtend(Model::class)
    ->toUseStrictTypes();
