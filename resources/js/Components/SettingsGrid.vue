<script lang="ts" setup>
import { Heading } from '@/Components/ui/heading'
import { Text } from '@/Components/ui/text'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-12 py-16 md:grid-cols-3">
    <div class="space-y-2">
      <Heading as="h2" size="lg">
        {{ title }}
      </Heading>

      <Text v-if="description" as="p" size="sm" variant="muted">
        {{ description }}
      </Text>
    </div>

    <div class="max-w-xl md:col-span-2">
      <slot />
    </div>
  </div>
</template>
