<script lang="ts" setup>
import AppLogo from '@/Components/AppLogo.vue'
import { Link } from '@inertiajs/vue3'
import { Text } from '@/Components/ui/text'
import dayjs from 'dayjs'
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="flex h-16 shrink-0 items-center justify-between px-4">
      <Link :href="route('home')">
        <AppLogo class="h-6 w-auto" />
      </Link>
    </header>

    <main class="flex grow justify-center px-4 py-16 sm:items-center">
      <slot />
    </main>

    <footer
      class="m-auto flex h-16 w-full max-w-lg shrink-0 items-center justify-center px-4"
    >
      <Text class="opacity-75" size="xs" variant="muted">
        {{
          $t('general.copyright_notice', { year: dayjs().year().toString() })
        }}
      </Text>
    </footer>
  </div>
</template>
