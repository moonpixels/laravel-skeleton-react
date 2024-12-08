<script lang="ts" setup>
import { Toaster } from '@/Components/ui/toast'
</script>

<template>
  <slot />

  <Teleport to="body">
    <Toaster />
  </Teleport>
</template>
