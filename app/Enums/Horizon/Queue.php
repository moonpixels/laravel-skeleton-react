<?php

declare(strict_types=1);

namespace App\Enums\Horizon;

enum Queue: string
{
    case Default = 'default';
    case Notifications = 'notifications';

    /**
     * @return list<self>
     */
    public static function short(): array
    {
        return [
            self::Default,
            self::Notifications,
        ];
    }

    /**
     * @return list<self>
     */
    public static function long(): array
    {
        return [
            //
        ];
    }
}
