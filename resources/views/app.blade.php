<!DOCTYPE html>
<html
    lang="{{ app(App\Support\Localisation\Localisation::class)->getIso639Locale(app()->getLocale()) }}"
    class="antialiased bg-background lg:bg-sidebar"
>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body>
@inertia
</body>
</html>
