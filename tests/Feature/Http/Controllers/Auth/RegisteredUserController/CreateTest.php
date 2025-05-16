<?php

declare(strict_types=1);

test('registration page can be rendered', function (): void {
    $this->get(route('register'))
        ->assertOk();
});
