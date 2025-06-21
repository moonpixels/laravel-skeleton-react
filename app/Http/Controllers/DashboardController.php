<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;

final class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $users = QueryBuilder::for(User::class)
            ->defaultSort('name')
            ->allowedSorts(['name', 'email', 'language'])
            ->paginate()
            ->withQueryString();

        return Inertia::render('dashboard', [
            'users' => UserResource::collection($users),
            'sorts' => $request->getSorts(),
            'filters' => $request->getFilters(),
        ]);
    }
}
