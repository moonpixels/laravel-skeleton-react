<script lang="ts" setup>
import GuestLayout from '@/Layouts/GuestLayout.vue'
import { Head, router } from '@inertiajs/vue3'
import { onMounted } from 'vue'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Text } from '@/Components/ui/text'
import { TextLink } from '@/Components/ui/text-link'
import { Checkbox } from '@/Components/ui/checkbox'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form'
import { useToast } from '@/Components/ui/toast'
import AuthForm from '@/Components/AuthForm.vue'
import { GenericObject, SubmissionContext } from 'vee-validate'
import { trans } from 'laravel-vue-i18n'

const props = defineProps<{
  status?: string
}>()

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string(),
    remember: z.boolean().default(false),
  })
)

onMounted(() => {
  if (props.status === 'password-updated') {
    useToast().toast({
      description: trans('auth.password_updated_description'),
      title: trans('auth.password_updated'),
      variant: 'successful',
    })
  }
})

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  await new Promise<void>((resolve) =>
    router.post(route('login'), values, {
      onError: (errors) => {
        actions.resetForm({ values: { ...values, password: '' }, errors })
      },
      onFinish: () => resolve(),
    })
  )
}
</script>

<template>
  <GuestLayout>
    <Head :title="$t('auth.login_to_account')" />

    <AuthForm
      :description="$t('auth.login_to_account_description')"
      :title="$t('auth.login_to_account')"
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

          <div class="flex items-center justify-between gap-3">
            <FormField v-slot="{ value, handleChange }" name="remember">
              <FormItem>
                <div class="flex items-center gap-2">
                  <FormControl>
                    <Checkbox :checked="value" @update:checked="handleChange" />
                  </FormControl>
                  <FormLabel>
                    {{ $t('auth.remember_label') }}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            </FormField>

            <Text as-child size="sm">
              <TextLink :href="route('password.request')">
                {{ $t('auth.forgot_password') }}
              </TextLink>
            </Text>
          </div>

          <Button :loading="isSubmitting" class="w-full" type="submit">
            {{ $t('auth.log_in') }}
          </Button>
        </Form>
      </template>

      <template #footer>
        <Text as="p" size="sm" variant="muted">
          {{ $t('auth.no_account') }}

          <TextLink :href="route('register')">
            {{ $t('auth.create_account') }}
          </TextLink>
        </Text>
      </template>
    </AuthForm>
  </GuestLayout>
</template>
