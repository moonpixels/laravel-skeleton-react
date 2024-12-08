<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { ToastDescription, type ToastDescriptionProps } from 'radix-vue'
import { cn } from '@/Utils/utils'

const props = defineProps<
  ToastDescriptionProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastDescription
    :class="cn('text-sm text-muted-foreground', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </ToastDescription>
</template>
