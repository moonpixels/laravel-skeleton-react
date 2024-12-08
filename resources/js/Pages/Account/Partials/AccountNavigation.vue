<script lang="ts" setup>
import PageNavigation from '@/Components/PageNavigation.vue'
import { wTrans } from 'laravel-vue-i18n'

const navItems = [
  {
    label: wTrans('navigation.general'),
    href: route('account.edit'),
    current: route().current('account.edit'),
  },
  {
    label: wTrans('navigation.security'),
    href: route('account.security.edit'),
    current: route().current('account.security.edit'),
  },
  {
    label: wTrans('navigation.preferences'),
    href: route('account.preferences.edit'),
    current: route().current('account.preferences.edit'),
  },
]
</script>

<template>
  <PageNavigation :items="navItems" />
</template>
