<script lang="ts" setup>
import { Primitive, type PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/Utils/utils'
import { TextVariants, textVariants } from '@/Components/ui/text/index'

interface Props extends PrimitiveProps {
  variant?: TextVariants['variant']
  size?: TextVariants['size']
  weight?: TextVariants['weight']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  as: 'span',
  size: 'base',
  weight: 'normal',
  class: '',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(textVariants({ variant, size, weight }), props.class)"
  >
    <slot />
  </Primitive>
</template>
