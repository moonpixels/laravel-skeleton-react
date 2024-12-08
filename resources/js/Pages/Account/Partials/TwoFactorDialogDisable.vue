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
import { ref } from 'vue'
import { GenericObject, SubmissionContext } from 'vee-validate'

const open = ref(false)

const isSubmitting = ref(false)

const formSchema = toTypedSchema(
  z.object({
    code: z.string(),
  })
)

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  await new Promise<void>((resolve) =>
    router.delete(route('two-factor.disable'), {
      preserveScroll: true,
      data: values,
      onStart: () => (isSubmitting.value = true),
      onError: (errors) => {
        actions.resetForm({ values, errors })
      },
      onSuccess: () => {
        actions.resetForm()

        open.value = false

        useToast().toast({
          description: trans('account.two_factor_disabled_description'),
          title: trans('account.two_factor_disabled'),
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
        {{ $t('account.disable_two_factor') }}
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{ $t('account.disable_two_factor') }}
        </DialogTitle>
        <DialogDescription>
          {{ $t('account.disable_two_factor_warning') }}
        </DialogDescription>
      </DialogHeader>

      <Form
        id="disable-two-factor-form"
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
          form="disable-two-factor-form"
          type="submit"
          variant="destructive"
        >
          {{ $t('general.disable') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
