<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { ToastTitle, type ToastTitleProps } from 'radix-vue'
import { cn } from '@/Utils/utils'

const props = defineProps<
  ToastTitleProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastTitle
    :class="cn('text-sm font-semibold leading-none', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </ToastTitle>
</template>
