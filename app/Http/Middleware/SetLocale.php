<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Support\Localisation\Facades\Localisation;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        Localisation::setLocaleFromRequest();

        return $next($request);
    }
}
