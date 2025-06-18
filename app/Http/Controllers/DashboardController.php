<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function index(): Response
    {
        $users = User::paginate(5)->withQueryString();

        return Inertia::render('dashboard', [
            'users' => UserResource::collection($users),
        ]);
    }
}
