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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form'
import { Input } from '@/Components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { router } from '@inertiajs/vue3'
import { useToast } from '@/Components/ui/toast'
import { trans } from 'laravel-vue-i18n'
import { reactive, ref, watch } from 'vue'
import { Text } from '@/Components/ui/text'
import { AxiosResponse } from 'axios'
import { Skeleton } from '@/Components/ui/skeleton'
import { GenericObject, SubmissionContext } from 'vee-validate'

const open = ref(false)

const loadingData = ref(false)

const isSubmitting = ref(false)

const twoFactorSettings = reactive({
  qrCode: '',
  secret: '',
})

const formSchema = toTypedSchema(
  z.object({
    code: z.string(),
  })
)

watch(open, (open) => open && fetchQRCode())

async function fetchQRCode() {
  loadingData.value = true

  try {
    const response: AxiosResponse<{
      qrCode: string
      secret: string
    }> = await axios.post(route('two-factor.enable'))

    twoFactorSettings.qrCode = response.data.qrCode
    twoFactorSettings.secret = response.data.secret
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

async function submit(values: GenericObject, actions: SubmissionContext) {
  await new Promise<void>((resolve) =>
    router.post(route('two-factor.confirm'), values, {
      preserveScroll: true,
      onStart: () => (isSubmitting.value = true),
      onError: (errors) => {
        actions.resetForm({ values, errors })
      },
      onSuccess: () => {
        actions.resetForm()

        open.value = false

        useToast().toast({
          description: trans('account.two_factor_enabled_description'),
          title: trans('account.two_factor_enabled'),
          variant: 'successful',
        })
      },
      onFinish: () => {
        isSubmitting.value = false

        resolve()
      },
    })
  )
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button>
        {{ $t('account.enable_two_factor') }}
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{ $t('account.enable_two_factor') }}
        </DialogTitle>
        <DialogDescription>
          {{ $t('account.enable_two_factor_description') }}
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col items-center gap-2">
        <template v-if="loadingData">
          <Skeleton class="size-32" />
          <Skeleton class="h-4 w-32" />
        </template>

        <template v-else>
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="flex items-center justify-center dark:[&_path[fill='#09090b']]:fill-foreground dark:[&_rect[fill='#ffffff']]:fill-background"
            v-html="twoFactorSettings.qrCode"
          />

          <Text class="font-mono" size="xs">
            {{ twoFactorSettings.secret }}
          </Text>
        </template>
      </div>

      <Form
        id="confirm-two-factor-form"
        :validation-schema="formSchema"
        class="space-y-6"
        @submit="submit"
      >
        <FormField v-slot="{ componentField }" name="code">
          <FormItem>
            <FormLabel>
              {{ $t('auth.2fa_code_label') }}
            </FormLabel>
            <FormControl>
              <Input
                autocomplete="one-time-code"
                required
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </Form>

      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            {{ $t('general.cancel') }}
          </Button>
        </DialogClose>

        <Button
          :loading="isSubmitting"
          form="confirm-two-factor-form"
          type="submit"
        >
          {{ $t('general.enable') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
