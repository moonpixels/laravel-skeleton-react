<script lang="ts" setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import { useUser } from '@/Composables/useUser'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import { Button } from '@/Components/ui/button'
import { Text } from '@/Components/ui/text'
import { CircleUserIcon, LogOutIcon } from 'lucide-vue-next'
import { Link } from '@inertiajs/vue3'
import { Method } from '@inertiajs/core'
import { wTrans } from 'laravel-vue-i18n'
import { initials } from '@/Utils/strings'
import { FunctionalComponent, Ref } from 'vue'

const { user } = useUser()

interface Item {
  label: string | Ref<string>
  icon: FunctionalComponent
  href: string
  method: Method
  as?: string
}

const items: Item[] = [
  {
    label: wTrans('navigation.account_settings'),
    icon: CircleUserIcon,
    href: route('account.edit'),
    method: 'get',
  },
  {
    label: wTrans('auth.log_out'),
    icon: LogOutIcon,
    href: route('logout'),
    method: 'post',
    as: 'button',
  },
]
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="hover:bg-inherit" size="icon" variant="ghost">
        <Avatar>
          <AvatarImage
            v-if="user.avatar_url"
            :alt="user.name"
            :src="user.avatar_url"
          />
          <component
            :is="user.avatar_url ? AvatarFallback : 'span'"
            :delay-ms="user.avatar_url ? 500 : 0"
          >
            {{ initials(user.name) }}
          </component>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="w-52">
      <DropdownMenuLabel>
        <Text class="block truncate" size="sm" weight="medium">
          {{ user.name }}
        </Text>
        <Text class="block truncate" size="sm" variant="muted">
          {{ user.email }}
        </Text>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem v-for="item in items" :key="item.href" as-child>
        <Link
          :as="item.as"
          :href="item.href"
          :method="item.method"
          class="flex w-full items-center gap-2"
        >
          <component :is="item.icon" class="size-4 shrink-0" />
          {{ item.label }}
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
