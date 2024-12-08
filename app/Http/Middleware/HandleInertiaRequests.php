<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Http\Resources\UserResource;
use App\Support\Localisation\Facades\Localisation;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Override;

final class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /**
     * @return array<string, mixed>
     */
    #[Override]
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'user' => $request->user() ? UserResource::make($request->user())->resolve() : null,
            'supportedLocales' => Localisation::getSupportedLocales('iso639'),
        ];
    }
}
