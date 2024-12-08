<script lang="ts" setup>
import { Primitive, type PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/Utils/utils'
import { HeadingVariants, headingVariants } from '@/Components/ui/heading/index'

interface Props extends PrimitiveProps {
  size?: HeadingVariants['size']
  weight?: HeadingVariants['weight']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'h1',
  size: '2xl',
  weight: 'semibold',
  class: '',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(headingVariants({ size, weight }), props.class)"
  >
    <slot />
  </Primitive>
</template>
