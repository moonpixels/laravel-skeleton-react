<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

final class TransformInertiaRequestKeysToSnakeCase
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->header('X-Inertia') === 'true') {
            $request->replace($this->transformKeysToSnakeCase($request->all()));
        }

        return $next($request);
    }

    /**
     * @param  array<string, mixed>|Collection<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function transformKeysToSnakeCase(array|Collection $data): array
    {
        return collect($data)->mapWithKeys(fn ($value, $key) => [
            Str::snake($key) => is_array($value) || $value instanceof Collection
                ? $this->transformKeysToSnakeCase($value)
                : $value,
        ])->all();
    }
}
