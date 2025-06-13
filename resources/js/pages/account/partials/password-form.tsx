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
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  currentPassword: z.string(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8),
})

export function PasswordForm() {
  const { t } = useTranslation()

  const { setFormServerErrors, passwordConfirmationMessage } =
    useFormValidation()

  formSchema.refine(
    (data) => data.password === data.passwordConfirmation,
    () => passwordConfirmationMessage()
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.put(route('account.password.update'), values, {
        preserveScroll: true,
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onSuccess: () => {
          form.reset()

          toast.success(t('account_updated'), {
            description: t('account_has_been_updated'),
          })
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <SettingsGrid
      description={t('change_password_description')}
      title={t('change_password')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('current_password')}</FormLabel>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('new_password')}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    required
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('confirm_new_password')}</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="new-password"
                    required
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button loading={form.formState.isSubmitting} type="submit">
            {t('update_password')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
