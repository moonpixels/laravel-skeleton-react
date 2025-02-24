<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Pipeline;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

final class TransformInertiaResponseKeysToCamelCase
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response instanceof Response && $request->header('X-Inertia') === 'true') {
            try {
                Pipeline::send($response)
                    ->through([
                        fn (Response $response, Closure $next) => $next($response->getContent()),
                        fn (string $content, Closure $next) => $next(json_decode($content, true)),
                        fn (array $data, Closure $next) => $next(json_encode($this->transformKeysToCamelCase($data))),
                    ])
                    ->then(fn (string $transformedData): Response => $response->setContent($transformedData));
            } catch (Throwable) {
                // Do nothing
            }
        }

        return $response;
    }

    /**
     * @param  array<string, mixed>|Collection<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function transformKeysToCamelCase(array|Collection $data): array
    {
        return collect($data)->mapWithKeys(fn ($value, $key) => [
            Str::camel($key) => is_array($value) || $value instanceof Collection
                ? $this->transformKeysToCamelCase($value)
                : $value,
        ])->all();
    }
}
