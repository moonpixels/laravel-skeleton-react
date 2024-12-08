<script lang="ts" setup>
import SettingsGrid from '@/Components/SettingsGrid.vue'
import { trans } from 'laravel-vue-i18n'
import { useUser } from '@/Composables/useUser'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { router } from '@inertiajs/vue3'
import { useToast } from '@/Components/ui/toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import AvatarForm from '@/Pages/Account/Partials/AvatarForm.vue'
import { GenericObject, SubmissionContext } from 'vee-validate'

const { user } = useUser()

const formSchema = toTypedSchema(
  z.object({
    name: z.string().default(user.value.name),
    email: z.string().email().default(user.value.email),
  })
)

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  await new Promise<void>((resolve) =>
    router.put(route('account.update'), values, {
      preserveScroll: true,
      onError: (errors) => {
        actions.resetForm({ values, errors })
      },
      onSuccess: () => {
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
    :description="$t('account.basic_information_description')"
    :title="$t('account.basic_information')"
  >
    <AvatarForm />

    <Form
      v-slot="{ isSubmitting }"
      :validation-schema="formSchema"
      class="mt-6 space-y-6"
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

      <Button :loading="isSubmitting" type="submit">
        {{ $t('general.submit') }}
      </Button>
    </Form>
  </SettingsGrid>
</template>
