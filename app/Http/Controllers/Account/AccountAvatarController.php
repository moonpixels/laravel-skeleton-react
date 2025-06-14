<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Actions\User\UpdateUserAvatarAction;
use App\DTOs\User\UpdateUserAvatarData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Account\UpdateAccountAvatarRequest;
use App\Models\User;
use App\Support\ImageProcessor\Exceptions\ImageProcessorException;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

final class AccountAvatarController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function update(
        UpdateAccountAvatarRequest $request,
        #[CurrentUser] User $user,
        UpdateUserAvatarAction $action
    ): RedirectResponse {
        try {
            $action->handle($user, $request->toDTO());
        } catch (ImageProcessorException $imageProcessorException) {
            report($imageProcessorException);

            throw ValidationException::withMessages([
                'avatar' => __('validation.account_avatar'),
            ]);
        }

        return back();
    }

    public function destroy(
        #[CurrentUser] User $user,
        UpdateUserAvatarAction $action
    ): RedirectResponse {
        $action->handle($user, new UpdateUserAvatarData(avatar: null));

        return back();
    }
}
