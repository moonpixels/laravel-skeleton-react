<script lang="ts" setup>
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { getBrowserLocale } from '@/Utils/locale'
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
import { TextLink } from '@/Components/ui/text-link'
import { Text } from '@/Components/ui/text'
import { GenericObject, SubmissionContext } from 'vee-validate'
import { passwordConfirmationMessage } from '@/Utils/zodValidation'

const formSchema = toTypedSchema(
  z
    .object({
      name: z.string(),
      email: z.string().email(),
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
  values.language = getBrowserLocale()

  await new Promise<void>((resolve) =>
    router.post(route('register'), values, {
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
    <Head :title="$t('auth.register_new_account')" />

    <AuthForm
      :description="$t('auth.register_new_account_description')"
      :title="$t('auth.register_new_account')"
    >
      <template #default>
        <Form
          v-slot="{ isSubmitting }"
          :validation-schema="formSchema"
          class="space-y-6"
          @submit="submit"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>
                {{ $t('general.name') }}
              </FormLabel>
              <FormControl>
                <Input autocomplete="name" required v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

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
            {{ $t('auth.register') }}
          </Button>
        </Form>
      </template>

      <template #footer>
        <Text as="p" size="sm" variant="muted">
          {{ $t('auth.already_have_account') }}
          <TextLink :href="route('login')">
            {{ $t('auth.log_in') }}
          </TextLink>
        </Text>
      </template>
    </AuthForm>
  </GuestLayout>
</template>
