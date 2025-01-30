<?php

declare(strict_types=1);

namespace App\Helpers;

use TypeError;

/**
 * @template TVariable
 */
final readonly class Ensure
{
    /**
     * @param  TVariable  $variable
     */
    public function __construct(private mixed $variable) {}

    /**
     * @template TEnsureOfType
     *
     * @param  class-string<TEnsureOfType>  $type
     * @return (TVariable is TEnsureOfType ? TVariable : never)
     */
    public function is(string $type): mixed
    {
        if (! $this->variable instanceof $type) {
            $this->throwTypeError($type);
        }

        return $this->variable;
    }

    public function isString(): string
    {
        if (! is_string($this->variable)) {
            $this->throwTypeError('string');
        }

        return $this->variable;
    }

    public function isInt(): int
    {
        if (! is_int($this->variable)) {
            $this->throwTypeError('int');
        }

        return $this->variable;
    }

    public function isFloat(): float
    {
        if (! is_float($this->variable)) {
            $this->throwTypeError('float');
        }

        return $this->variable;
    }

    public function isBool(): bool
    {
        if (! is_bool($this->variable)) {
            $this->throwTypeError('bool');
        }

        return $this->variable;
    }

    /**
     * @return (TVariable is array ? TVariable : never)
     */
    public function isArray(): array
    {
        if (! is_array($this->variable)) {
            $this->throwTypeError('array');
        }

        return $this->variable;
    }

    public function isNull(): null
    {
        if (! is_null($this->variable)) {
            $this->throwTypeError('null');
        }

        return $this->variable;
    }

    public function isCallable(): callable
    {
        if (! is_callable($this->variable)) {
            $this->throwTypeError('callable');
        }

        return $this->variable;
    }

    /**
     * @template TEnsureOfType
     *
     * @param  array<int, class-string<TEnsureOfType>>  $types
     * @return (TVariable is TEnsureOfType ? TVariable : never)
     */
    public function isOneOf(array $types): mixed
    {
        foreach ($types as $type) {
            try {
                return $this->is($type);
            } catch (TypeError) {
                continue;
            }
        }

        $this->throwTypeError(implode('|', $types));
    }

    private function throwTypeError(mixed $type): never
    {
        $message = sprintf('Variable must be of type %s, %s given', $type, $this->getVariableType());

        throw new TypeError($message);
    }

    private function getVariableType(): string
    {
        return get_debug_type($this->variable);
    }
}
