<script lang="ts" setup>
import { EqualIcon } from 'lucide-vue-next'
import { Button } from '@/Components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet'
import TheNavigation from '@/Components/TheNavigation.vue'
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button class="lg:hidden" size="icon" variant="ghost">
        <EqualIcon class="size-5" />
      </Button>
    </SheetTrigger>

    <SheetContent hide-close-button side="left">
      <TheNavigation />
    </SheetContent>
  </Sheet>
</template>
