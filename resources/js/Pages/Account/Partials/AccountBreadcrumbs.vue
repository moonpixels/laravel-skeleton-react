<script lang="ts" setup>
import PageBreadcrumbs, {
  type BreadcrumbItemType,
} from '@/Components/PageBreadcrumbs.vue'
import { computed } from 'vue'
import { trans } from 'laravel-vue-i18n'

const breadcrumbs = computed(() => {
  const items: BreadcrumbItemType[] = [
    {
      label: trans('navigation.account_settings'),
      href: route('account.edit'),
    },
  ]

  switch (true) {
    case route().current('account.edit'):
      items.push({
        label: trans('navigation.general'),
      })
      break

    case route().current('account.security.edit'):
      items.push({
        label: trans('navigation.security'),
      })
      break

    case route().current('account.preferences.edit'):
      items.push({
        label: trans('navigation.preferences'),
      })
      break
  }

  return items
})
</script>

<template>
  <PageBreadcrumbs :items="breadcrumbs" />
</template>
