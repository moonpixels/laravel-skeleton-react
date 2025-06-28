<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\SpatieQueryBuilder\Filters\DateFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\Enums\FilterOperator;
use Spatie\QueryBuilder\QueryBuilder;

final class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $users = QueryBuilder::for(User::class)
            ->defaultSort('name')
            ->allowedSorts(['name', 'email', 'language'])
            ->allowedFilters([
                AllowedFilter::callback('search', function (Builder $query, string $value): void {
                    $query->whereLike(column: 'name', value: "%{$value}%")
                        ->orWhereLike(column: 'email', value: "%{$value}%");
                }),
                AllowedFilter::partial('_name', 'name'),
                AllowedFilter::operator('name', FilterOperator::DYNAMIC),
                AllowedFilter::partial('_email', 'email'),
                AllowedFilter::operator('email', FilterOperator::DYNAMIC),
                AllowedFilter::operator('language', FilterOperator::DYNAMIC),
                AllowedFilter::callback('verified', function (Builder $query, bool $value): void {
                    if ($value) {
                        $query->whereNotNull('email_verified_at');
                    } else {
                        $query->whereNull('email_verified_at');
                    }
                }),
                AllowedFilter::custom('created_at', new DateFilter),
            ])
            ->paginate()
            ->withQueryString();

        return Inertia::render('dashboard', [
            'users' => UserResource::collection($users),
            'sorts' => $request->getSorts(),
            'filters' => $request->getFilters(),
        ]);
    }
}
