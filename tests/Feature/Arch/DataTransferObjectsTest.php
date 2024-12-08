<?php

declare(strict_types=1);

arch('DTOs')
    ->expect('App\DTOs')
    ->toBeClasses()
    ->toBeReadonly()
    ->toExtendNothing()
    ->toUseStrictTypes();
