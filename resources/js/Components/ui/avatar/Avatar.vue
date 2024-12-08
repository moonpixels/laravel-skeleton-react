<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { AvatarRoot } from 'radix-vue'
import { avatarVariant, type AvatarVariants } from '.'
import { cn } from '@/Utils/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    size?: AvatarVariants['size']
    shape?: AvatarVariants['shape']
  }>(),
  {
    class: '',
    size: 'sm',
    shape: 'circle',
  }
)
</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape }), props.class)">
    <slot />
  </AvatarRoot>
</template>
