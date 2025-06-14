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
import { useFormValidation } from '@/hooks/use-form-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { router, usePage } from '@inertiajs/react'
import { Globe } from 'lucide-react'
import { ElementType } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  language: z.string(),
})

export function DarkModeForm() {
  const { t } = useTranslation()

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
                <FormLabel>{t('useDarkMode')}</FormLabel>
                <FormDescription>{t('useDarkModeDescription')}</FormDescription>
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
  const { t, i18n } = useTranslation()

  const page = usePage()

  const { setFormServerErrors } = useFormValidation()

  const supportedLocaleOptions = Object.values(page.props.supportedLocales).map(
    (data) => ({
      value: data.regional,
      label: data.nativeName,
      icon: getCountryFlag(data.regional),
    })
  )

  console.log(i18n.language, supportedLocaleOptions)

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
      <DarkModeForm />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common:language')}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                <FormDescription>{t('selectYourLanguage')}</FormDescription>
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
