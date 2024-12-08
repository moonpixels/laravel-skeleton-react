<script lang="ts" setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import { Head } from '@inertiajs/vue3'
import PreferencesForm from '@/Pages/Account/Partials/PreferencesForm.vue'
import PageHeader from '@/Components/PageHeader.vue'
import AccountBreadcrumbs from '@/Pages/Account/Partials/AccountBreadcrumbs.vue'
import AccountNavigation from '@/Pages/Account/Partials/AccountNavigation.vue'
</script>

<template>
  <Head :title="$t('account.account_preferences')" />

  <AuthenticatedLayout>
    <template #breadcrumbs>
      <AccountBreadcrumbs />
    </template>

    <template #default>
      <PageHeader>
        {{ $t('account.account_settings') }}
      </PageHeader>

      <AccountNavigation />

      <div class="divide-y divide-border">
        <PreferencesForm />
      </div>
    </template>
  </AuthenticatedLayout>
</template>
