<script lang="ts" setup>
import { Heading } from '@/Components/ui/heading'
import { Text } from '@/Components/ui/text'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="w-full space-y-10 sm:max-w-sm">
    <div class="space-y-2">
      <Heading>
        {{ title }}
      </Heading>
      <Text size="sm" variant="muted">
        {{ description }}
      </Text>
    </div>

    <slot />

    <div v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>
