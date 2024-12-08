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
import { Text } from '@/Components/ui/text'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { GenericObject, SubmissionContext, useField } from 'vee-validate'

const formSchema = toTypedSchema(
  z.object({
    code: z.string(),
    is_recovery: z.boolean().default(false),
  })
)

const { value: isRecovery } = useField('is_recovery')

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  await new Promise<void>((resolve) =>
    router.post(route('two-factor.login'), values, {
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

function switchMode() {
  isRecovery.value = !isRecovery.value
}
</script>

<template>
  <GuestLayout>
    <Head :title="$t('auth.two_factor_authentication')" />

    <AuthForm
      :description="
        isRecovery
          ? $t('auth.two_factor_recovery_code_description')
          : $t('auth.two_factor_code_description')
      "
      :title="$t('auth.two_factor_authentication')"
    >
      <template #default>
        <Form
          v-slot="{ isSubmitting }"
          :validation-schema="formSchema"
          class="space-y-6"
          @submit="submit"
        >
          <FormField v-slot="{ componentField }" name="code">
            <FormItem>
              <FormLabel>
                {{
                  isRecovery
                    ? $t('auth.recovery_code_label')
                    : $t('auth.2fa_code_label')
                }}
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

          <Button :loading="isSubmitting" class="w-full" type="submit">
            {{
              isRecovery ? $t('auth.recovery_code') : $t('auth.confirm_code')
            }}
          </Button>
        </Form>
      </template>

      <template #footer>
        <Text as="p" size="sm" variant="muted">
          {{ $t('auth.having_trouble') }}

          <Button variant="link" @click="switchMode">
            {{
              isRecovery ? $t('auth.use_code') : $t('auth.use_recovery_code')
            }}
          </Button>
        </Text>
      </template>
    </AuthForm>
  </GuestLayout>
</template>
