import { SettingsGrid } from '@/Components/SettingsGrid'
import { Button } from '@/Components/UI/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/UI/Form'
import { Input } from '@/Components/UI/Input'
import { useFormValidation } from '@/Hooks/useFormValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  password: z.string(),
})

export function DeleteAccountForm() {
  const { t } = useLaravelReactI18n()

  const { setFormServerErrors } = useFormValidation()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.delete(route('account.destroy'), {
        preserveScroll: true,
        data: values,
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <SettingsGrid
      description={t('account.delete_account_description')}
      title={t('account.delete_account')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('general.password')}</FormLabel>
                <FormControl>
                  <Input autoComplete="current-password" required type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={form.formState.isSubmitting} variant="destructive" type="submit">
            {t('account.delete_account')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
