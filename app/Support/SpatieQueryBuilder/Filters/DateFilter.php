<?php

declare(strict_types=1);

namespace App\Support\SpatieQueryBuilder\Filters;

use Carbon\CarbonImmutable;
use Carbon\CarbonPeriodImmutable;
use Carbon\Exceptions\InvalidFormatException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;
use Spatie\QueryBuilder\Enums\FilterOperator;
use Spatie\QueryBuilder\Filters\Filter;

/**
 * @implements Filter<Model>
 */
final class DateFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        if (is_array($value)) {
            if (count($value) < 2) {
                return;
            }

            try {
                $period = new CarbonPeriodImmutable($value[0], $value[1]);

                $query->whereBetween($property, $period->setTimezone('UTC'));

                return;
            } catch (InvalidArgumentException) {
                return;
            }
        }

        $value = (string) $value;

        $filterOperator = $this->getFilterOperator($value);

        $this->removeFilterOperatorFromValue($value, $filterOperator);

        if ($value === '') {
            return;
        }

        try {
            $date = new CarbonImmutable($value);

            match ($filterOperator) {
                FilterOperator::EQUAL => $query->whereDate($property, $date),
                FilterOperator::NOT_EQUAL => $query->whereDate($property, '!=', $date),
                FilterOperator::GREATER_THAN => $query->whereDate($property, '>', $date),
                FilterOperator::GREATER_THAN_OR_EQUAL => $query->whereDate($property, '>=', $date),
                FilterOperator::LESS_THAN => $query->whereDate($property, '<', $date),
                FilterOperator::LESS_THAN_OR_EQUAL => $query->whereDate($property, '<=', $date),
                default => null
            };
        } catch (InvalidFormatException) {
            return;
        }
    }

    private function getFilterOperator(string $value): FilterOperator
    {
        $filterOperator = FilterOperator::EQUAL;

        foreach (FilterOperator::cases() as $filterOperatorCase) {
            if (str_starts_with($value, $filterOperatorCase->value) && ! $filterOperatorCase->isDynamic()) {
                $filterOperator = $filterOperatorCase;
            }
        }

        return $filterOperator;
    }

    private function removeFilterOperatorFromValue(string &$value, FilterOperator $filterOperator): void
    {
        if (str_starts_with($value, $filterOperator->value)) {
            $value = substr($value, strlen($filterOperator->value));
        }
    }
}
