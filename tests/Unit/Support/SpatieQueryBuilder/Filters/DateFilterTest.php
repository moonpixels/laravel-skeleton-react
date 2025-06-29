<?php

declare(strict_types=1);

namespace Tests\Unit\Support\SpatieQueryBuilder\Filters;

use App\Support\SpatieQueryBuilder\Filters\DateFilter;
use Illuminate\Database\Eloquent\Builder;
use Mockery;
use Spatie\QueryBuilder\Enums\FilterOperator;

test('it filters by date range when array with two valid dates is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';
    $startDate = '2023-01-01';
    $endDate = '2023-01-31';

    $query->shouldReceive('whereBetween')
        ->once()
        ->with(
            $property,
            Mockery::on(fn ($period): bool => $period->getStartDate()->toDateString() === $startDate
                && $period->getEndDate()->toDateString() === $endDate
            )
        );

    $filter($query, [$startDate, $endDate], $property);
});

test('it does nothing when array with less than two elements is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';

    $query->shouldNotReceive('whereBetween');
    $query->shouldNotReceive('whereDate');

    $filter($query, ['2023-01-01'], $property);
});

test('it does nothing when array with invalid dates is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';

    $query->shouldNotReceive('whereBetween');
    $query->shouldNotReceive('whereDate');

    $filter($query, ['invalid-date', 'another-invalid-date'], $property);
});

test('it filters by exact date when string without operator is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';
    $date = '2023-01-01';

    $query->shouldReceive('whereDate')
        ->once()
        ->with($property, Mockery::on(fn ($carbonDate): bool => $carbonDate->toDateString() === $date));

    $filter($query, $date, $property);
});

test('it filters with not equal operator when != is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';
    $date = '2023-01-01';

    $query->shouldReceive('whereDate')
        ->once()
        ->with($property, '!=', Mockery::on(fn ($carbonDate): bool => $carbonDate->toDateString() === $date));

    $filter($query, FilterOperator::NOT_EQUAL->value.$date, $property);
});

test('it filters with greater than operator when > is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';
    $date = '2023-01-01';

    $query->shouldReceive('whereDate')
        ->once()
        ->with($property, '>', Mockery::on(fn ($carbonDate): bool => $carbonDate->toDateString() === $date));

    $filter($query, FilterOperator::GREATER_THAN->value.$date, $property);
});

test('it filters with greater than or equal operator when >= is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';
    $date = '2023-01-01';

    $query->shouldReceive('whereDate')
        ->once()
        ->with($property, '>=', Mockery::on(fn ($carbonDate): bool => $carbonDate->toDateString() === $date));

    $filter($query, FilterOperator::GREATER_THAN_OR_EQUAL->value.$date, $property);
});

test('it filters with less than operator when < is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';
    $date = '2023-01-01';

    $query->shouldReceive('whereDate')
        ->once()
        ->with($property, '<', Mockery::on(fn ($carbonDate): bool => $carbonDate->toDateString() === $date));

    $filter($query, FilterOperator::LESS_THAN->value.$date, $property);
});

test('it filters with less than or equal operator when <= is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';
    $date = '2023-01-01';

    $query->shouldReceive('whereDate')
        ->once()
        ->with($property, '<=', Mockery::on(fn ($carbonDate): bool => $carbonDate->toDateString() === $date));

    $filter($query, FilterOperator::LESS_THAN_OR_EQUAL->value.$date, $property);
});

test('it does nothing when empty string is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';

    $query->shouldNotReceive('whereDate');

    $filter($query, '', $property);
});

test('it does nothing when string with only operator is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';

    $query->shouldNotReceive('whereDate');

    $filter($query, FilterOperator::GREATER_THAN->value, $property);
});

test('it does nothing when invalid date string is provided', function (): void {
    $filter = new DateFilter;
    $query = Mockery::mock(Builder::class);
    $property = 'created_at';

    $query->shouldNotReceive('whereDate');

    $filter($query, 'invalid-date', $property);
});
