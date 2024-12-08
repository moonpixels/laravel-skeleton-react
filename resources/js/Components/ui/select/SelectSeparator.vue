<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue'
import { SelectSeparator, type SelectSeparatorProps } from 'radix-vue'
import { cn } from '@/Utils/utils'

const props = defineProps<
  SelectSeparatorProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <SelectSeparator
    :class="cn('-mx-1 my-1 h-px bg-muted', props.class)"
    v-bind="delegatedProps"
  />
</template>
