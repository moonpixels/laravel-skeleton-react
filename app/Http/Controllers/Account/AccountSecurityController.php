<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

final class AccountSecurityController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('account/security');
    }
}
