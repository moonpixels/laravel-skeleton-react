<script lang="ts" setup>
import { Button } from '@/Components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/Components/ui/dialog'
import { useToast } from '@/Components/ui/toast'
import { trans } from 'laravel-vue-i18n'
import { computed, ref, watch } from 'vue'
import { AxiosResponse } from 'axios'
import { useCopy } from '@/Composables/useCopy'
import { ClipboardCheck, ClipboardCopy } from 'lucide-vue-next'
import { Skeleton } from '@/Components/ui/skeleton'

const open = ref(false)

const loadingData = ref(false)

const recoveryCodes = ref<string[]>([])

const recoveryCodesString = computed(() => {
  return recoveryCodes.value.join('\n')
})

const { copyText, copied } = useCopy()

watch(open, (open) => open && fetchRecoveryCodes())

async function fetchRecoveryCodes() {
  loadingData.value = true

  try {
    const response: AxiosResponse<{
      recoveryCodes: string[]
    }> = await axios.get(route('two-factor.recovery-codes'))

    recoveryCodes.value = response.data.recoveryCodes
  } catch {
    open.value = false

    useToast().toast({
      description: trans('errors.generic_description'),
      title: trans('errors.generic'),
      variant: 'destructive',
    })
  } finally {
    loadingData.value = false
  }
}

defineExpose({
  open,
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="secondary">
        {{ $t('account.view_recovery_codes') }}
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{ $t('account.recovery_codes') }}
        </DialogTitle>
        <DialogDescription>
          {{ $t('account.recovery_codes_description') }}
        </DialogDescription>
      </DialogHeader>

      <ul class="mx-auto grid list-none grid-cols-2 gap-x-6">
        <template v-if="recoveryCodes.length">
          <li
            v-for="code in recoveryCodes"
            :key="code"
            class="font-mono text-xs/5 text-foreground"
          >
            {{ code }}
          </li>
        </template>
        <template v-else>
          <li v-for="i in 8" :key="i" class="py-1">
            <Skeleton class="h-3 w-[72px]" />
          </li>
        </template>
      </ul>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            {{ $t('general.close') }}
          </Button>
        </DialogClose>

        <Button @click="copyText(recoveryCodesString)">
          <span class="flex items-center gap-1">
            <component
              :is="copied ? ClipboardCheck : ClipboardCopy"
              class="size-4"
            />

            {{ copied ? $t('general.copied') : $t('general.copy') }}
          </span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
