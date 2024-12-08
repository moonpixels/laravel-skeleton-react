<script lang="ts" setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import { Head } from '@inertiajs/vue3'
import PasswordForm from '@/Pages/Account/Partials/PasswordForm.vue'
import TwoFactorForm from '@/Pages/Account/Partials/TwoFactorForm.vue'
import PageHeader from '@/Components/PageHeader.vue'
import AccountBreadcrumbs from '@/Pages/Account/Partials/AccountBreadcrumbs.vue'
import AccountNavigation from '@/Pages/Account/Partials/AccountNavigation.vue'
</script>

<template>
  <Head :title="$t('account.account_security')" />

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
        <PasswordForm />
        <TwoFactorForm />
      </div>
    </template>
  </AuthenticatedLayout>
</template>
