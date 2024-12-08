<script lang="ts" setup>
import { computed, type HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { cn } from '@/Utils/utils'
import { InertiaLinkProps, Link } from '@inertiajs/vue3'

interface Props extends PrimitiveProps, Omit<InertiaLinkProps, 'as'> {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: Link,
  class: '',
})

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <Primitive
    :class="
      cn(
        'text-foreground underline decoration-foreground/30 hover:decoration-foreground',
        props.class
      )
    "
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
