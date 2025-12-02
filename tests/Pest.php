<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

pest()->extend(TestCase::class)->in('Browser', 'Feature', 'Unit');
pest()->use(LazilyRefreshDatabase::class)->in('Feature', 'Unit');
pest()->use(RefreshDatabase::class)->in('Browser');
