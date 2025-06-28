<?php

declare(strict_types=1);

namespace App\Mixins;

use Closure;
use Illuminate\Http\Request;

/**
 * @mixin Request
 */
final class RequestMixin
{
    public function getSorts(): Closure
    {
        /**
         * @return array<int, array{id: string, desc: bool}>
         */
        return function (?string $default = null): array {
            $sortQuery = $this->query('sort', $default);

            if (is_string($sortQuery)) {
                $sorts = explode(',', $sortQuery);

                $sorts = array_map(function (string $value): array {
                    $value = trim($value);
                    $desc = str_starts_with($value, '-');
                    $id = ltrim($value, '-');

                    return [
                        'id' => $id,
                        'desc' => $desc,
                    ];
                }, $sorts);

                return array_filter($sorts, fn (array $sort): bool => $sort['id'] !== '');
            }

            return [];
        };
    }

    public function getFilters(): Closure
    {
        /**
         * @return array<int, array{id: string, value: string}>
         */
        return function (?array $default = null): array {
            $filters = $this->query('filter', $default);

            if (is_array($filters)) {
                $filters = array_map(fn (mixed $value, string $key): array => [
                    'id' => $key,
                    'value' => is_array($value) ? implode(',', $value) : $value,
                ], $filters, array_keys($filters));

                return array_filter($filters, fn (array $filter): bool => $filter['id'] !== '');
            }

            return [];
        };
    }
}
