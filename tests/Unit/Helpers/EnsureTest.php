<?php

declare(strict_types=1);

use App\Models\User;

test('ensure helper works for custom types', function (): void {
    $variable = User::factory()->create();

    $value = ensure($variable)->is(User::class);

    expect($value)->toBe($variable);
});

test('ensure helper throws exception for custom types', function (): void {
    $variable = null;

    ensure($variable)->is(User::class);
})->throws(TypeError::class, 'Variable must be of type App\Models\User, null given');

test('ensure helper works for string types', function (): void {
    $variable = 'string';

    $value = ensure($variable)->isString();

    expect($value)->toBe($variable);
});

test('ensure helper throws exception for string types', function (): void {
    $variable = null;

    ensure($variable)->isString();
})->throws(TypeError::class, 'Variable must be of type string, null given');

test('ensure helper works for int types', function (): void {
    $variable = 1;

    $value = ensure($variable)->isInt();

    expect($value)->toBe($variable);
});

test('ensure helper throws exception for int types', function (): void {
    $variable = null;

    ensure($variable)->isInt();
})->throws(TypeError::class, 'Variable must be of type int, null given');

test('ensure helper works for float types', function (): void {
    $variable = 1.0;

    $value = ensure($variable)->isFloat();

    expect($value)->toBe($variable);
});

test('ensure helper throws exception for float types', function (): void {
    $variable = null;

    ensure($variable)->isFloat();
})->throws(TypeError::class, 'Variable must be of type float, null given');

test('ensure helpers works for boolean types', function (): void {
    $value = ensure(true)->isBool();

    expect($value)->toBeTrue();
});

test('ensure helper throws exception for boolean types', function (): void {
    $variable = null;

    ensure($variable)->isBool();
})->throws(TypeError::class, 'Variable must be of type bool, null given');

test('ensure helper works for array types', function (): void {
    $variable = [];

    $value = ensure($variable)->isArray();

    expect($value)->toBe($variable);
});

test('ensure helper throws exception for array types', function (): void {
    $variable = null;

    ensure($variable)->isArray();
})->throws(TypeError::class, 'Variable must be of type array, null given');

test('ensure helper works for null types', function (): void {
    $variable = null;

    $value = ensure($variable)->isNull();

    expect($value)->toBe($variable);
});

test('ensure helper throws exception for null types', function (): void {
    $variable = 1;

    ensure($variable)->isNull();
})->throws(TypeError::class, 'Variable must be of type null, int given');

test('ensure helper works for callable types', function (): void {
    $variable = fn (): string => 'callable';

    $value = ensure($variable)->isCallable();

    expect($value)->toBe($variable);
});

test('ensure helper throws exception for callable types', function (): void {
    $variable = null;

    ensure($variable)->isCallable();
})->throws(TypeError::class, 'Variable must be of type callable, null given');

test('ensure helper works for one of types', function (): void {
    $variable = User::factory()->create();

    $value = ensure($variable)->isOneOf([User::class, Generator::class]);

    expect($value)->toBe($variable);
});

test('ensure helper throws exception for one of types', function (): void {
    $variable = null;

    ensure($variable)->isOneOf([User::class, Generator::class]);
})->throws(TypeError::class, 'Variable must be of type App\Models\User|Generator, null given');
