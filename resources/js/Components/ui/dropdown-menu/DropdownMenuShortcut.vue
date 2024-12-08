<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '@/Utils/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span :class="cn('ml-auto text-xs tracking-widest opacity-60', props.class)">
    <slot />
  </span>
</template>
