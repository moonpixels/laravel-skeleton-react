<script lang="ts" setup>
import { useTemplateRef } from 'vue'
import { useUser } from '@/Composables/useUser'
import { initials } from '@/Utils/strings'
import { router } from '@inertiajs/vue3'
import { trans } from 'laravel-vue-i18n'
import { useToast } from '@/Components/ui/toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form'
import { Button } from '@/Components/ui/button'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Form, GenericObject, SubmissionContext } from 'vee-validate'
import { Skeleton } from '@/Components/ui/skeleton'

const { user } = useUser()

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')

const formSchema = toTypedSchema(
  z.object({
    avatar: z.instanceof(File).nullable().optional(),
  })
)

function openFileInput() {
  fileInput.value?.click()
}

async function submit(values: GenericObject, actions: SubmissionContext) {
  if (values.avatar === undefined) {
    return
  }

  await new Promise<void>((resolve) =>
    router.post(
      route('account.avatar.update'),
      { ...values, _method: 'put' },
      {
        preserveScroll: true,
        onError: (errors) => {
          actions.resetForm({ errors })
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
      }
    )
  )
}
</script>

<template>
  <Form
    v-slot="{ isSubmitting, handleSubmit }"
    :validation-schema="formSchema"
    class="space-y-6"
    @submit="submit"
  >
    <FormField
      v-slot="{ handleChange, handleBlur, setValue }"
      name="avatar"
      @update:model-value="handleSubmit($event, submit)"
    >
      <FormItem>
        <FormLabel>
          {{ $t('general.avatar') }}
        </FormLabel>
        <FormDescription>
          {{ $t('account.avatar_description') }}
        </FormDescription>
        <FormControl>
          <div class="flex items-center space-x-4">
            <div class="size-11 shrink-0">
              <Skeleton v-if="isSubmitting" class="size-11 rounded-full" />

              <Avatar v-else size="md">
                <AvatarImage
                  v-if="user.avatar_url"
                  :alt="user.name"
                  :class="{ 'opacity-50': isSubmitting }"
                  :src="user.avatar_url"
                />
                <component
                  :is="user.avatar_url ? AvatarFallback : 'span'"
                  :delay-ms="user.avatar_url ? 500 : 0"
                >
                  {{ initials(user.name) }}
                </component>
              </Avatar>
            </div>

            <div>
              <input
                ref="fileInput"
                accept="image/*"
                class="hidden"
                type="file"
                @blur="handleBlur"
                @change="handleChange"
              />

              <div class="flex items-center space-x-2">
                <Button
                  :loading="isSubmitting && !user.avatar_url"
                  type="button"
                  variant="secondary"
                  @click="openFileInput"
                >
                  {{ $t('general.change') }}
                </Button>

                <Button
                  :disabled="!user.avatar_url"
                  :loading="isSubmitting && !!user.avatar_url"
                  type="button"
                  variant="destructive"
                  @click="setValue(null)"
                >
                  {{ $t('general.remove') }}
                </Button>
              </div>
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </Form>
</template>
