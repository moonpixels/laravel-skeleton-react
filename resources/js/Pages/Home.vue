<script lang="ts" setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue'
import { Head } from '@inertiajs/vue3'
import { Text } from '@/Components/ui/text'
import PageHeader from '@/Components/PageHeader.vue'
import PageBreadcrumbs from '@/Components/PageBreadcrumbs.vue'
</script>

<template>
  <Head :title="$t('general.home')" />

  <AuthenticatedLayout>
    <template #breadcrumbs>
      <PageBreadcrumbs />
    </template>

    <template #default>
      <PageHeader>
        {{ $t('general.home') }}
      </PageHeader>

      <div class="py-10">
        <Text size="sm" variant="muted">
          Ipsum ipsa aliquam deserunt molestias incidunt optio. Labore aperiam
          consequuntur natus sit repudiandae accusantium illum doloribus omnis.
        </Text>
      </div>
    </template>
  </AuthenticatedLayout>
</template>
