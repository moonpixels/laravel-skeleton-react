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

const formSchema = toTypedSchema(
  z.object({
    password: z.string(),
  })
)

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  await new Promise<void>((resolve) =>
    router.post(route('password.confirm'), values, {
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
    <Head :title="$t('auth.confirm_your_password')" />

    <AuthForm
      :description="$t('auth.confirm_your_password_description')"
      :title="$t('auth.confirm_your_password')"
    >
      <template #default>
        <Form
          v-slot="{ isSubmitting }"
          :validation-schema="formSchema"
          class="space-y-6"
          @submit="submit"
        >
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>
                {{ $t('general.password') }}
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

          <Button :loading="isSubmitting" class="w-full" type="submit">
            {{ $t('general.confirm') }}
          </Button>
        </Form>
      </template>
    </AuthForm>
  </GuestLayout>
</template>
