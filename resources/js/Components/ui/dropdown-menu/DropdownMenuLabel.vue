<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import {
  DropdownMenuLabel,
  type DropdownMenuLabelProps,
  useForwardProps,
} from 'radix-vue'
import { cn } from '@/Utils/utils'

const props = defineProps<
  DropdownMenuLabelProps & { class?: HTMLAttributes['class']; inset?: boolean }
>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuLabel
    :class="
      cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', props.class)
    "
    v-bind="forwardedProps"
  >
    <slot />
  </DropdownMenuLabel>
</template>
