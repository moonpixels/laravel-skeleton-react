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
  current_password: z.string(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
})

export function PasswordForm() {
  const { t } = useTranslation()

  const { setFormServerErrors, passwordConfirmationMessage } =
    useFormValidation()

  formSchema.refine(
    (data) => data.password === data.password_confirmation,
    () => passwordConfirmationMessage()
  )

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
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

          toast.success(t('accountUpdated'), {
            description: t('accountHasBeenUpdated'),
          })
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <SettingsGrid
      description={t('changePasswordDescription')}
      title={t('change_password')}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('currentPassword')}</FormLabel>
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
                <FormLabel>{t('newPassword')}</FormLabel>
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
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('confirmNewPassword')}</FormLabel>
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
            {t('updatePassword')}
          </Button>
        </form>
      </Form>
    </SettingsGrid>
  )
}
