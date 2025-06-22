<?php

declare(strict_types=1);

use Illuminate\Http\Request;

test('sorts can be retrieved', function (): void {
    $request = new Request(query: [
        'sort' => 'name,-email',
    ]);

    $sorts = $request->getSorts();

    expect($sorts)->toBeArray()
        ->toHaveCount(2)
        ->and($sorts[0])->toBe(['id' => 'name', 'desc' => false])
        ->and($sorts[1])->toBe(['id' => 'email', 'desc' => true]);
});

test('invalid sorts are ignored', function (): void {
    $request = new Request(query: [
        'sort' => 'name,-email,,',
    ]);

    $sorts = $request->getSorts();

    expect($sorts)->toBeArray()
        ->toHaveCount(2)
        ->and($sorts[0])->toBe(['id' => 'name', 'desc' => false])
        ->and($sorts[1])->toBe(['id' => 'email', 'desc' => true]);
});

test('no sorts returns empty array', function (): void {
    $request = new Request;

    $sorts = $request->getSorts();

    expect($sorts)->toBeArray()
        ->toHaveCount(0);
});

test('filters can be retrieved', function (): void {
    $request = new Request(query: [
        'filter' => [
            'foo' => 'bar',
            'baz' => 'qux',
        ],
    ]);

    $filters = $request->getFilters();

    expect($filters)->toBeArray()
        ->toHaveCount(2)
        ->and($filters[0])->toBe(['id' => 'foo', 'value' => 'bar'])
        ->and($filters[1])->toBe(['id' => 'baz', 'value' => 'qux']);
});

test('invalid filters are ignored', function (): void {
    $request = new Request(query: [
        'filter' => [
            'foo' => 'bar',
            '' => 'qux',
        ],
    ]);

    $filters = $request->getFilters();

    expect($filters)->toBeArray()
        ->toHaveCount(1)
        ->and($filters[0])->toBe(['id' => 'foo', 'value' => 'bar']);
});

test('no filters returns empty array', function (): void {
    $request = new Request;

    $filters = $request->getFilters();

    expect($filters)->toBeArray()
        ->toHaveCount(0);
});
