<script lang="ts" setup>
import SettingsGrid from '@/Components/SettingsGrid.vue'
import { trans } from 'laravel-vue-i18n'
import { Button } from '@/Components/ui/button'
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
import { GenericObject, SubmissionContext } from 'vee-validate'
import { passwordConfirmationMessage } from '@/Utils/zodValidation'

const formSchema = toTypedSchema(
  z
    .object({
      current_password: z.string(),
      password: z.string().min(8),
      password_confirmation: z.string().min(8),
    })
    .refine(
      (data) => data.password === data.password_confirmation,
      () => passwordConfirmationMessage()
    )
)

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  await new Promise<void>((resolve) =>
    router.put(route('account.password.update'), values, {
      preserveScroll: true,
      onError: (errors) => {
        actions.resetForm({ values, errors })
      },
      onSuccess: () => {
        actions.resetForm()

        useToast().toast({
          description: trans('account.account_has_been_updated'),
          title: trans('account.account_updated'),
          variant: 'successful',
        })
      },
      onFinish: () => resolve(),
    })
  )
}
</script>

<template>
  <SettingsGrid
    :description="$t('account.change_password_description')"
    :title="$t('account.change_password')"
  >
    <Form
      v-slot="{ isSubmitting }"
      :validation-schema="formSchema"
      class="space-y-6"
      @submit="submit"
    >
      <FormField v-slot="{ componentField }" name="current_password">
        <FormItem>
          <FormLabel>
            {{ $t('account.current_password') }}
          </FormLabel>
          <FormControl>
            <Input
              autocomplete="current-password"
              required
              type="password"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>
            {{ $t('account.new_password') }}
          </FormLabel>
          <FormControl>
            <Input
              autocomplete="new-password"
              required
              type="password"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="password_confirmation">
        <FormItem>
          <FormLabel>
            {{ $t('account.confirm_new_password') }}
          </FormLabel>
          <FormControl>
            <Input
              autocomplete="new-password"
              required
              type="password"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button :loading="isSubmitting" type="submit">
        {{ $t('account.update_password') }}
      </Button>
    </Form>
  </SettingsGrid>
</template>
