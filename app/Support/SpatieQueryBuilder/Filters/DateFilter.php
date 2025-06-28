<?php

declare(strict_types=1);

namespace App\Support\SpatieQueryBuilder\Filters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Enums\FilterOperator;
use Spatie\QueryBuilder\Filters\Filter;

final class DateFilter implements Filter
{
    public function __invoke(Builder $query, mixed $value, string $property): void
    {
        if (is_array($value) && count($value) === 2) {
            $query->whereBetween($property, $value);
        }

        $value = (string) $value;

        $filterOperator = $this->getFilterOperator($value);

        $this->removeFilterOperatorFromValue($value, $filterOperator);

        if (empty($value)) {
            return;
        }

        match ($filterOperator) {
            FilterOperator::EQUAL => $query->whereDate($property, $value),
            FilterOperator::NOT_EQUAL => $query->whereDate($property, '!=', $value),
            FilterOperator::GREATER_THAN => $query->whereDate($property, '>', $value),
            FilterOperator::GREATER_THAN_OR_EQUAL => $query->whereDate($property, '>=', $value),
            FilterOperator::LESS_THAN => $query->whereDate($property, '<', $value),
            FilterOperator::LESS_THAN_OR_EQUAL => $query->whereDate($property, '<=', $value),
            default => null
        };
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
