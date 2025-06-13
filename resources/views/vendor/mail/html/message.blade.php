<x-mail::layout>
    {{-- Header --}}
    <x-slot:header>
        <x-mail::header :url="config('app.url')">
            <table class="inner-header" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                    <td>
                        <img
                            src="{{ asset('images/logo.png') }}"
                            class="logo"
                            alt="{{ config('app.name') }}"
                        >
                    </td>
                </tr>
            </table>
        </x-mail::header>
    </x-slot:header>

    {{-- Body --}}
    {{ $slot }}

    {{-- Subcopy --}}
    @isset($subcopy)
        <x-slot:subcopy>
            <x-mail::subcopy>
                {{ $subcopy }}
            </x-mail::subcopy>
        </x-slot:subcopy>
    @endisset

    {{-- Footer --}}
    <x-slot:footer>
        <x-mail::footer>
            {{ __('common:copyright_notice', ['year' => date('Y'), 'company' => config('app.name')]) }}
        </x-mail::footer>
    </x-slot:footer>
</x-mail::layout>
