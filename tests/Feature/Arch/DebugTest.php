<?php

declare(strict_types=1);

arch('debug')
    ->expect(['dd', 'dump', 'die'])
    ->not->toBeUsed();
