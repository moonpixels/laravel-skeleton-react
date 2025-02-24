<?php

declare(strict_types=1);

use App\Http\Middleware\TransformInertiaResponseKeysToCamelCase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Pipeline;
use Symfony\Component\HttpFoundation\Response;

test('response keys are transformed to camelCase for inertia responses', function (): void {
    $response = new Response;
    $response->setContent('{"snake_case":"value","nested":{"snake_case":"value"}}');

    $request = new Request;
    $request->headers->set('X-Inertia', 'true');

    $middleware = new TransformInertiaResponseKeysToCamelCase;

    $response = $middleware->handle($request, fn (): Response => $response);

    expect($response->getContent())->toBe('{"snakeCase":"value","nested":{"snakeCase":"value"}}');
});

test('response keys are not transformed for non-inertia responses', function (): void {
    $response = new Response;
    $response->setContent('{"snake_case":"value","nested":{"snake_case":"value"}}');

    $request = new Request;

    $middleware = new TransformInertiaResponseKeysToCamelCase;

    $response = $middleware->handle($request, fn (): Response => $response);

    expect($response->getContent())->toBe('{"snake_case":"value","nested":{"snake_case":"value"}}');
});

test('response keys are not transformed when an exception occurs', function (): void {
    $response = new Response;
    $response->setContent('{"snake_case":"value","nested":{"snake_case":"value"}}');

    $request = new Request;
    $request->headers->set('X-Inertia', 'true');

    Pipeline::shouldReceive('send')
        ->once()
        ->with($response)
        ->andThrow(new Exception);

    $middleware = new TransformInertiaResponseKeysToCamelCase;

    $response = $middleware->handle($request, fn (): Response => $response);

    expect($response->getContent())->toBe('{"snake_case":"value","nested":{"snake_case":"value"}}');
});
