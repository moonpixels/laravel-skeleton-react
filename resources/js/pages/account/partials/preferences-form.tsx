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
import { Theme, useTheme } from '@/contexts/theme-context'
import { useFormValidation } from '@/hooks/use-form-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, usePage } from '@inertiajs/react'
import { Globe, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { ElementType } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

const themeOptions = [
  {
    label: 'system',
    value: 'system',
    icon: MonitorIcon,
  },
  {
    label: 'light',
    value: 'light',
    icon: SunIcon,
  },
  {
    label: 'dark',
    value: 'dark',
    icon: MoonIcon,
  },
]

export function ThemeForm() {
  const { t } = useTranslation()

  const { theme, setTheme } = useTheme()

  const form = useForm({
    defaultValues: {
      theme: theme,
    },
  })

  function handleThemeChange(theme: Theme) {
    setTheme(theme)
  }

  return (
    <Form {...form}>
      <form className="mt-6 space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-between sm:flex-row">
              <div className="space-y-2">
                <FormLabel>{t('themeSelectLabel')}</FormLabel>
                <FormDescription>{t('themeSelectDescription')}</FormDescription>
              </div>

              <FormControl>
                <Select
                  onValueChange={(value: Theme) => {
                    field.onChange(value)
                    handleThemeChange(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="max-w-32">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {themeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2 truncate">
                          <option.icon className="text-muted-foreground h-3 w-auto shrink-0" />
                          {t(option.label)}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

const formSchema = z.object({
  language: z.string(),
})

export function PreferencesForm() {
  const { t, i18n } = useTranslation()

  const page = usePage()

  const { setFormServerErrors } = useFormValidation()

  const supportedLocaleOptions = Object.values(page.props.supportedLocales).map(
    (data) => ({
      value: data.regional,
      label: data.native_name,
      icon: getCountryFlag(data.regional),
    })
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: i18n.language,
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
          i18n.changeLanguage(values.language)

          toast.success(t('accountUpdated'), {
            description: t('accountHasBeenUpdated'),
          })
        },
        onFinish: () => resolve(),
      })
    )
  }

  function getCountryFlag(locale: string): ElementType {
    switch (locale) {
      case 'en-GB':
        return IconFlagGb
      case 'fr-FR':
        return IconFlagFr
      default:
        return Globe
    }
  }

  return (
    <SettingsGrid
      description={t('preferencesDescription')}
      title={t('preferences')}
    >
      <ThemeForm />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <FormLabel>{t('language')}</FormLabel>
                  <FormDescription>{t('selectYourLanguage')}</FormDescription>
                </div>

                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="max-w-48">
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={form.formState.isSubmitting} type="submit">
            {t('updatePreferences')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
