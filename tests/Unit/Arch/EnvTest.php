<?php

declare(strict_types=1);

arch('env')
    ->expect(['env'])
    ->not->toBeUsed();
