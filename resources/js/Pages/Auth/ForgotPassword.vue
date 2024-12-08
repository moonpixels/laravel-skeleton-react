<script lang="ts" setup>
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { onMounted } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useToast } from '@/Components/ui/toast'
import { trans } from 'laravel-vue-i18n'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form'
import { Input } from '@/Components/ui/input'
import { Text } from '@/Components/ui/text'
import { Button } from '@/Components/ui/button'
import { TextLink } from '@/Components/ui/text-link'
import AuthForm from '@/Components/AuthForm.vue'
import { GenericObject, SubmissionContext } from 'vee-validate'

const props = defineProps<{
  status?: string
}>()

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
  })
)

onMounted(() => {
  if (props.status === 'reset-link-sent') {
    showSuccessToast()
  }
})

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  await new Promise<void>((resolve) =>
    router.post(route('password.email'), values, {
      onError: (errors) => {
        actions.resetForm({ values, errors })
      },
      onSuccess: () => {
        actions.resetForm()
        showSuccessToast()
      },
      onFinish: () => resolve(),
    })
  )
}

function showSuccessToast() {
  useToast().toast({
    description: trans('auth.password_reset_email_sent_description'),
    title: trans('auth.password_reset_email_sent'),
    variant: 'successful',
  })
}
</script>

<template>
  <GuestLayout>
    <Head :title="$t('auth.forgot_your_password')" />

    <AuthForm
      :description="$t('auth.forgot_your_password_description')"
      :title="$t('auth.forgot_your_password')"
    >
      <template #default>
        <Form
          v-slot="{ isSubmitting }"
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

          <Button :loading="isSubmitting" class="w-full" type="submit">
            {{ $t('auth.send_password_reset_email') }}
          </Button>
        </Form>
      </template>

      <template #footer>
        <Text as="p" size="sm" variant="muted">
          {{ $t('auth.remembered_password') }}
          <TextLink :href="route('login')">
            {{ $t('auth.log_in') }}
          </TextLink>
        </Text>
      </template>
    </AuthForm>
  </GuestLayout>
</template>
