<script lang="ts" setup>
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area'
import { Link } from '@inertiajs/vue3'
import { Text } from '@/Components/ui/text'
import { Ref } from 'vue'

interface Props {
  items: {
    label: string | Ref<string>
    href: string
    current: boolean
  }[]
}

defineProps<Props>()
</script>

<template>
  <ScrollArea class="-mx-4 mt-6 sm:-mx-6 lg:-mx-8">
    <nav class="h-10 w-full px-4 sm:px-6 lg:px-8">
      <ul class="flex h-full gap-4 border-b">
        <li v-for="item in items" :key="item.href" class="-mb-px">
          <Link
            :class="item.current ? 'border-primary' : 'border-transparent'"
            :href="item.href"
            class="group flex h-full items-center border-b-2"
          >
            <Text
              :variant="item.current ? undefined : 'muted'"
              class="leading-none group-hover:text-foreground"
              size="sm"
              weight="medium"
            >
              {{ item.label }}
            </Text>
          </Link>
        </li>
      </ul>
    </nav>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>
