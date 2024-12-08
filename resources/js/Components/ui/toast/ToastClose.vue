<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { ToastClose, type ToastCloseProps } from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/Utils/utils'

const props = defineProps<
  ToastCloseProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastClose
    :class="
      cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/40 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:hover:text-destructive group-[.successful]:hover:text-successful group-[.destructive]:focus:ring-destructive group-[.successful]:focus:ring-successful group-[.destructive]:focus:ring-offset-destructive group-[.successful]:focus:ring-offset-successful',
        props.class
      )
    "
    v-bind="delegatedProps"
  >
    <X class="h-4 w-4" />
  </ToastClose>
</template>
