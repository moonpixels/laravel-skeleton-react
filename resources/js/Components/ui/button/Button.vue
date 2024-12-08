<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type ButtonVariants, buttonVariants, loadingSpinnerVariants } from '.'
import { cn } from '@/Utils/utils'
import LoadingSpinner from '@/Components/LoadingSpinner.vue'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'default',
  class: '',
  loading: false,
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        buttonVariants({ variant, size: variant === 'link' ? 'link' : size }),
        props.class
      )
    "
    :disabled="loading"
  >
    <span
      :class="loading ? 'scale-100 opacity-100' : 'scale-50 opacity-0'"
      class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out"
    >
      <LoadingSpinner :class="loadingSpinnerVariants({ variant })" />
    </span>

    <span
      :class="loading ? 'scale-95 opacity-0' : 'scale-100 opacity-100'"
      class="inline-flex transition-all duration-300 ease-out"
    >
      <slot />
    </span>
  </Primitive>
</template>
