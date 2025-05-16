<?php

declare(strict_types=1);

arch('actions')
    ->expect('App\Actions')
    ->toBeClasses()
    ->toExtendNothing()
    ->toHaveSuffix('Action')
    ->toUseStrictTypes();
