<script lang="ts" setup>
import SettingsGrid from '@/Components/SettingsGrid.vue'
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
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { router } from '@inertiajs/vue3'
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
    router.delete(route('account.destroy'), {
      preserveScroll: true,
      data: values,
      onError: (errors) => {
        actions.resetForm({ values, errors })
      },
      onFinish: () => resolve(),
    })
  )
}
</script>

<template>
  <SettingsGrid
    :description="$t('account.delete_account_description')"
    :title="$t('account.delete_account')"
  >
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

      <Button :loading="isSubmitting" type="submit" variant="destructive">
        {{ $t('account.delete_account') }}
      </Button>
    </Form>
  </SettingsGrid>
</template>
