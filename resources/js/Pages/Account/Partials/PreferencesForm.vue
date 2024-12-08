<script lang="ts" setup>
import SettingsGrid from '@/Components/SettingsGrid.vue'
import { type Component, inject } from 'vue'
import { UseDarkMode } from '@/Types'
import { trans } from 'laravel-vue-i18n'
import { useLocale } from '@/Composables/useLocale'
import { getCountryFromLocale } from '@/Utils/locale'
import IconFlagGB from '@/Components/Icons/IconFlagGB.vue'
import { Globe } from 'lucide-vue-next'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form'
import { Button } from '@/Components/ui/button'
import { Switch } from '@/Components/ui/switch'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import { router } from '@inertiajs/vue3'
import { useToast } from '@/Components/ui/toast'
import { GenericObject, SubmissionContext } from 'vee-validate'
import IconFlagFR from '@/Components/Icons/IconFlagFR.vue'

const { supportedLocales, currentLocale } = useLocale()

const useDarkTheme = inject<UseDarkMode>('useDarkTheme')

const formSchema = toTypedSchema(
  z.object({
    language: z.string().default(currentLocale.value),
  })
)

const supportedLocaleOptions = Object.entries(supportedLocales.value).map(
  ([locale, data]) => ({
    value: locale,
    label: data.nativeName,
    icon: getCountryFlag(data.regional),
  })
)

function getCountryFlag(locale: string): Component | undefined {
  const country = getCountryFromLocale(locale)

  if (!country) {
    return Globe
  }

  switch (country) {
    case 'GB':
      return IconFlagGB
    case 'FR':
      return IconFlagFR
    default:
      return Globe
  }
}

async function submit(
  values: GenericObject,
  actions: SubmissionContext
): Promise<void> {
  await new Promise<void>((resolve) =>
    router.put(route('account.preferences.update'), values, {
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
    :description="$t('account.preferences_description')"
    :title="$t('account.preferences')"
  >
    <Form>
      <FormField
        v-slot="{ value, handleChange }"
        v-model="useDarkTheme"
        name="theme"
      >
        <FormItem class="flex items-center justify-between space-x-4">
          <div class="space-y-2">
            <FormLabel>
              {{ $t('account.use_dark_mode') }}
            </FormLabel>
            <FormDescription>
              {{ $t('account.use_dark_mode_description') }}
            </FormDescription>
          </div>

          <FormControl>
            <Switch :checked="value" @update:checked="handleChange" />
          </FormControl>
        </FormItem>
      </FormField>
    </Form>

    <Form
      v-slot="{ isSubmitting }"
      :validation-schema="formSchema"
      class="mt-6 space-y-6"
      @submit="submit"
    >
      <FormField v-slot="{ componentField }" name="language">
        <FormItem>
          <FormLabel>
            {{ $t('general.language') }}
          </FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="option in supportedLocaleOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  <span class="flex items-center gap-2 truncate">
                    <component
                      :is="option.icon"
                      class="h-3 w-auto shrink-0 text-muted-foreground"
                    />

                    {{ option.label }}
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormDescription>
            {{ $t('account.select_your_language') }}
          </FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button :loading="isSubmitting" type="submit">
        {{ $t('account.update_preferences') }}
      </Button>
    </Form>
  </SettingsGrid>
</template>
