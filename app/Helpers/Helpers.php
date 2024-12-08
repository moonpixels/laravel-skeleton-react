<?php

declare(strict_types=1);

use App\Helpers\Ensure;

/**
 * @template TVariable
 *
 * @param  TVariable  $variable
 * @return Ensure<TVariable>
 */
function ensure(mixed $variable): Ensure
{
    return new Ensure($variable);
}
