<?php

declare(strict_types=1);

use App\Http\Middleware\TransformInertiaRequestKeysToSnakeCase;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

test('input keys are transformed to snake_case for inertia requests', function (): void {
    $request = new Request;
    $request->headers->set('X-Inertia', 'true');
    $request->replace([
        'camelCase' => 'value',
        'nested' => [
            'camelCase' => 'value',
        ],
    ]);

    $middleware = new TransformInertiaRequestKeysToSnakeCase;

    $middleware->handle($request, function (Request $request): Response {
        expect($request->all())->toBe([
            'camel_case' => 'value',
            'nested' => [
                'camel_case' => 'value',
            ],
        ]);

        return new Response;
    });
});

test('input keys are not transformed for non-inertia requests', function (): void {
    $request = new Request;
    $request->replace([
        'camelCase' => 'value',
        'nested' => [
            'camelCase' => 'value',
        ],
    ]);

    $middleware = new TransformInertiaRequestKeysToSnakeCase;

    $middleware->handle($request, function (Request $request): Response {
        expect($request->all())->toBe([
            'camelCase' => 'value',
            'nested' => [
                'camelCase' => 'value',
            ],
        ]);

        return new Response;
    });
});
