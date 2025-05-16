<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\DTOs\User\UpdateUserAvatarData;
use App\Models\User;
use App\Support\ImageProcessor\Exceptions\ImageProcessorException;
use App\Support\ImageProcessor\Facade\ImageProcessor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class UpdateUserAvatarAction
{
    private const int AVATAR_SIZE = 128;

    /**
     * @throws ImageProcessorException
     */
    public function handle(User $user, UpdateUserAvatarData $data): User
    {
        if ($data->avatar instanceof UploadedFile) {
            ImageProcessor::read($data->avatar->path())
                ->cover(self::AVATAR_SIZE, self::AVATAR_SIZE)
                ->toWebp()
                ->optimize()
                ->save();
        }

        tap($user->avatar_path, function (?string $previousAvatarPath) use ($user, $data): void {
            $user->update([
                'avatar_path' => $data->avatar?->storePublicly('avatars'),
            ]);

            if (is_string($previousAvatarPath)) {
                Storage::delete($previousAvatarPath);
            }
        });

        return $user;
    }
}
