import { IconFlagFr } from '@/components/icons/icon-flag-fr'
import { IconFlagGb } from '@/components/icons/icon-flag-gb'
import { SettingsGrid } from '@/components/settings-grid'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useDarkMode } from '@/contexts/dark-mode-context'
import { getCountryFromLocale, useLocale } from '@/contexts/locale-context'
import { useFormValidation } from '@/hooks/use-form-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { Globe } from 'lucide-react'
import { ElementType } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  language: z.string(),
})

export function DarkModeForm() {
  const { t } = useLaravelReactI18n()

  const { isDarkMode, setDarkMode } = useDarkMode()

  const form = useForm({
    defaultValues: {
      use_dark_mode: isDarkMode,
    },
  })

  function handleDarkModeChange(useDarkMode: boolean) {
    setDarkMode(useDarkMode)
  }

  return (
    <Form {...form}>
      <form className="mt-6 space-y-6">
        <FormField
          control={form.control}
          name="use_dark_mode"
          render={({ field }) => (
            <FormItem className="flex justify-between">
              <div className="space-y-2">
                <FormLabel>{t('account.use_dark_mode')}</FormLabel>
                <FormDescription>{t('account.use_dark_mode_description')}</FormDescription>
              </div>

              <FormControl>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={(e) => {
                    field.onChange(e)
                    handleDarkModeChange(e)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export function PreferencesForm() {
  const { t } = useLaravelReactI18n()

  const { setFormServerErrors } = useFormValidation()

  const { supportedLocales, currentLocale } = useLocale()

  const supportedLocaleOptions = Object.entries(supportedLocales).map(([locale, data]) => ({
    value: locale,
    label: data.nativeName,
    icon: getCountryFlag(data.regional),
  }))

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: currentLocale,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.put(route('account.preferences.update'), values, {
        preserveScroll: true,
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onSuccess: () => {
          toast.success(t('account.account_updated'), {
            description: t('account.account_has_been_updated'),
          })
        },
        onFinish: () => resolve(),
      })
    )
  }

  function getCountryFlag(locale: string): ElementType {
    const country = getCountryFromLocale(locale)

    if (!country) {
      return Globe
    }

    switch (country) {
      case 'GB':
        return IconFlagGb
      case 'FR':
        return IconFlagFr
      default:
        return Globe
    }
  }

  return (
    <SettingsGrid
      description={t('account.preferences_description')}
      title={t('account.preferences')}
    >
      <DarkModeForm />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('general.language')}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {supportedLocaleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2 truncate">
                            <option.icon className="text-muted-foreground h-3 w-auto shrink-0" />
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>{t('account.select_your_language')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={form.formState.isSubmitting} type="submit">
            {t('account.update_preferences')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
