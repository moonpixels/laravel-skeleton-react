<script lang="ts" setup>
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form'
import { Input } from '@/Components/ui/input'
import AuthForm from '@/Components/AuthForm.vue'
import { Button } from '@/Components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { GenericObject, SubmissionContext } from 'vee-validate'
import { passwordConfirmationMessage } from '@/Utils/zodValidation'

const props = defineProps<{
  email: string
  token: string
}>()

const formSchema = toTypedSchema(
  z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
      password_confirmation: z.string().min(8),
    })
    .refine(
      (data) => data.password === data.password_confirmation,
      () => passwordConfirmationMessage()
    )
)

const formValues = {
  email: props.email,
}

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  values.token = props.token

  await new Promise<void>((resolve) =>
    router.post(route('password.store'), values, {
      onError: (errors) => {
        actions.resetForm({ values, errors })
      },
      onSuccess: () => {
        actions.resetForm()
      },
      onFinish: () => resolve(),
    })
  )
}
</script>

<template>
  <GuestLayout>
    <Head :title="$t('auth.reset_your_password')" />

    <AuthForm
      :description="$t('auth.reset_your_password_description')"
      :title="$t('auth.reset_your_password')"
    >
      <template #default>
        <Form
          v-slot="{ isSubmitting }"
          :initial-values="formValues"
          :validation-schema="formSchema"
          class="space-y-6"
          @submit="submit"
        >
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>
                {{ $t('general.email') }}
              </FormLabel>
              <FormControl>
                <Input
                  autocomplete="username"
                  inputmode="email"
                  required
                  type="email"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>
                {{ $t('general.password') }}
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
                {{ $t('general.confirm_password') }}
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

          <Button :loading="isSubmitting" class="w-full" type="submit">
            {{ $t('auth.reset_password') }}
          </Button>
        </Form>
      </template>
    </AuthForm>
  </GuestLayout>
</template>
