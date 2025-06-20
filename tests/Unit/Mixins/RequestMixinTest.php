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

test('no sorts returns null', function (): void {
    $request = new Request;

    $sorts = $request->getSorts();

    expect($sorts)->toBeNull();
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
        ->and($filters['foo'])->toBe('bar')
        ->and($filters['baz'])->toBe('qux');
});
