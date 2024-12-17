import { IconFlagFR } from '@/Components/Icons/IconFlagFR'
import { IconFlagGB } from '@/Components/Icons/IconFlagGB'
import { SettingsGrid } from '@/Components/SettingsGrid'
import { Button } from '@/Components/UI/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/UI/Select'
import { Switch } from '@/Components/UI/Switch'
import { useDarkMode } from '@/Contexts/DarkModeContext'
import { useFormValidation } from '@/Hooks/useFormValidation'
import { useLocale } from '@/Hooks/useLocale'
import { useToast } from '@/Hooks/useToast'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { Globe } from 'lucide-react'
import { ElementType } from 'react'
import { useForm } from 'react-hook-form'
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
            <FormItem className="flex justify-between space-x-4">
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

  const { toast } = useToast()

  const { setFormServerErrors } = useFormValidation()

  const { supportedLocales, currentLocale, getCountryFromLocale } = useLocale()

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
          toast({
            description: t('account.account_has_been_updated'),
            title: t('account.account_updated'),
            variant: 'successful',
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
        return IconFlagGB
      case 'FR':
        return IconFlagFR
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
                            <option.icon className="h-3 w-auto shrink-0 text-muted-foreground" />
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
