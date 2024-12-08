<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue'
import {
  CheckboxIndicator,
  CheckboxRoot,
  useForwardPropsEmits,
} from 'radix-vue'
import { Check } from 'lucide-vue-next'
import { cn } from '@/Utils/utils'

const props = defineProps<
  CheckboxRootProps & { class?: HTMLAttributes['class'] }
>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CheckboxRoot
    :class="
      cn(
        'peer size-4 shrink-0 rounded border bg-input-background shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        props.class
      )
    "
    v-bind="forwarded"
  >
    <CheckboxIndicator
      class="flex h-full w-full items-center justify-center text-current"
    >
      <slot>
        <Check :stroke-width="4" class="size-3" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
