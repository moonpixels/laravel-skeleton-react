<script lang="ts" setup>
import { computed } from 'vue'
import { ToastRoot, type ToastRootEmits, useForwardPropsEmits } from 'radix-vue'
import { toastIconVariants, type ToastProps, toastVariants } from '.'
import { cn } from '@/Utils/utils'
import { CheckCircle, CircleAlert, Info } from 'lucide-vue-next'

const props = defineProps<ToastProps>()

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const icon = computed(() => {
  switch (props.variant) {
    case 'destructive':
      return CircleAlert
    case 'successful':
      return CheckCircle
    default:
      return Info
  }
})
</script>

<template>
  <ToastRoot
    :class="cn(toastVariants({ variant }), props.class)"
    v-bind="forwarded"
    @update:open="onOpenChange"
  >
    <component
      :is="icon"
      :class="toastIconVariants({ variant })"
      :stroke-width="2.5"
    />

    <div class="grow space-y-3">
      <slot />
    </div>
  </ToastRoot>
</template>
