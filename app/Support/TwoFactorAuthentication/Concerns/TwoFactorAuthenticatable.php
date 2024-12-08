<?php

declare(strict_types=1);

namespace App\Support\TwoFactorAuthentication\Concerns;

use App\Support\TwoFactorAuthentication\Facades\TwoFactorAuthentication;
use BaconQrCode\Renderer\Color\Rgb;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\Fill;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of Model
 *
 * @mixin TModel
 */
trait TwoFactorAuthenticatable
{
    public function hasTwoFactorAuthenticationEnabled(): bool
    {
        return $this->two_factor_secret && $this->two_factor_confirmed_at;
    }

    public function replaceRecoveryCode(string $code): bool
    {
        $currentCodes = $this->two_factor_recovery_codes;

        $newCode = TwoFactorAuthentication::generateRecoveryCode();

        return $this->forceFill([
            'two_factor_recovery_codes' => str_replace($code, $newCode, $currentCodes ?? ''),
        ])->save();
    }

    public function getTwoFactorQrCodeSvg(): string
    {
        $writer = new Writer(
            new ImageRenderer(
                new RendererStyle(
                    size: 128,
                    margin: 0,
                    fill: Fill::uniformColor(new Rgb(255, 255, 255), new Rgb(9, 9, 11))
                ),
                new SvgImageBackEnd
            )
        );

        $svg = $writer->writeString($this->getTwoFactorQrCodeUrl());

        return trim(substr($svg, strpos($svg, "\n") + 1));
    }

    public function getTwoFactorQrCodeUrl(): string
    {
        return TwoFactorAuthentication::getQrCodeUrl(
            config('app.name'),
            $this->email,
            $this->two_factor_secret ?? ''
        );
    }

    public function verifyTwoFactorCode(string $code): bool
    {
        return TwoFactorAuthentication::verify($this->two_factor_secret ?? '', $code);
    }

    public function verifyTwoFactorRecoveryCode(string $code): bool
    {
        return in_array($code, $this->two_factor_recovery_codes ?? [], true);
    }
}
