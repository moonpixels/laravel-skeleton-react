<script lang="ts" setup>
import { Link } from '@inertiajs/vue3'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'

export interface BreadcrumbItemType {
  label: string
  href?: string
}

interface Props {
  items?: BreadcrumbItemType[]
}

defineProps<Props>()
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbPage v-if="route().current('home')">
          {{ $t('navigation.home') }}
        </BreadcrumbPage>

        <BreadcrumbLink v-else as-child>
          <Link :href="route('home')">
            {{ $t('navigation.home') }}
          </Link>
        </BreadcrumbLink>

        <BreadcrumbSeparator v-if="items && items.length" />
      </BreadcrumbItem>

      <template v-if="items && items.length">
        <template v-for="(item, index) in items" :key="index">
          <BreadcrumbItem>
            <BreadcrumbPage v-if="index === items.length - 1">
              {{ item.label }}
            </BreadcrumbPage>

            <BreadcrumbLink v-else-if="item.href" as-child>
              <Link :href="item.href">
                {{ item.label }}
              </Link>
            </BreadcrumbLink>

            <template v-else>
              {{ item.label }}
            </template>
          </BreadcrumbItem>

          <BreadcrumbSeparator v-if="index !== items.length - 1" />
        </template>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
