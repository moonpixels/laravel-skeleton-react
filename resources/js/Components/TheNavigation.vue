<script lang="ts" setup>
import { computed } from 'vue'
import { trans } from 'laravel-vue-i18n'
import { Link } from '@inertiajs/vue3'
import { Home, UserCircleIcon } from 'lucide-vue-next'
import { Text } from '@/Components/ui/text'

const items = computed(() => {
  return [
    {
      label: trans('navigation.home'),
      href: route('home'),
      current: route().current('home*'),
      icon: Home,
    },
    {
      label: trans('navigation.account_settings'),
      href: route('account.edit'),
      current: route().current('account*'),
      icon: UserCircleIcon,
    },
  ]
})
</script>

<template>
  <nav>
    <ul class="-mx-2 space-y-1 lg:mx-0" role="list">
      <li v-for="item in items" :key="item.label">
        <Link
          :class="{ 'bg-black/3 dark:bg-white/3': item.current }"
          :href="item.href"
          class="flex items-center gap-2 rounded-sm px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <component
            :is="item.icon"
            aria-hidden="true"
            class="size-4 shrink-0 text-muted-foreground"
          />

          <Text
            :weight="item.current ? 'semibold' : 'medium'"
            class="leading-none text-foreground"
            size="sm"
          >
            {{ item.label }}
          </Text>
        </Link>
      </li>
    </ul>
  </nav>
</template>
