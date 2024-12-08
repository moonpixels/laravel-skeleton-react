<script lang="ts" setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import { Head } from '@inertiajs/vue3'
import BasicInformationForm from '@/Pages/Account/Partials/BasicInformationForm.vue'
import DeleteAccountForm from '@/Pages/Account/Partials/DeleteAccountForm.vue'
import PageHeader from '@/Components/PageHeader.vue'
import AccountBreadcrumbs from '@/Pages/Account/Partials/AccountBreadcrumbs.vue'
import AccountNavigation from '@/Pages/Account/Partials/AccountNavigation.vue'
</script>

<template>
  <Head :title="$t('account.account_settings')" />

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
        <BasicInformationForm />
        <DeleteAccountForm />
      </div>
    </template>
  </AuthenticatedLayout>
</template>
