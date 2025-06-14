import { SettingsGrid } from '@/components/settings-grid'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormValidation } from '@/hooks/use-form-validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const formSchema = z.object({
  password: z.string(),
})

export function DeleteAccountForm() {
  const { t } = useTranslation()

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
      description={t('deleteAccountDescription')}
      title={t('deleteAccount')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common:password')}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="current-password"
                    required
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            loading={form.formState.isSubmitting}
            variant="destructive"
            type="submit"
          >
            {t('deleteAccount')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
