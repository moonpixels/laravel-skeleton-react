<script lang="ts" setup>
import AppLogo from '@/Components/AppLogo.vue'
import { Link } from '@inertiajs/vue3'
import TheAccountDropdownMenu from '@/Components/TheAccountDropdownMenu.vue'
import TheNavigation from '@/Components/TheNavigation.vue'
import TheMobileNavigation from '@/Components/TheMobileNavigation.vue'
import TheFooter from '@/Components/TheFooter.vue'
</script>

<template>
  <div class="flex h-full flex-col lg:flex-row">
    <header
      class="shrink-0 lg:fixed lg:h-dvh lg:w-72 lg:border-r lg:bg-secondary/50"
    >
      <div class="flex h-14 w-full items-center justify-between px-4 sm:px-6">
        <Link :href="route('home')">
          <AppLogo class="h-6 w-auto" />
        </Link>

        <div class="flex items-center gap-2">
          <TheAccountDropdownMenu />
          <TheMobileNavigation />
        </div>
      </div>

      <div class="mt-4 hidden px-3 lg:flex lg:flex-col lg:space-y-px">
        <TheNavigation />
      </div>
    </header>

    <div
      class="flex min-h-dvh grow flex-col justify-between overflow-hidden border-t lg:ml-72 lg:border-t-0"
    >
      <main class="lg:pt-14">
        <header
          class="top-0 z-10 flex h-14 w-full items-center gap-2 border-b bg-muted px-4 backdrop-blur-sm sm:px-6 lg:fixed lg:bg-background/80 lg:px-8"
        >
          <slot name="breadcrumbs" />
        </header>

        <div class="overflow-y-auto px-4 py-10 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>

      <TheFooter />
    </div>
  </div>
</template>
