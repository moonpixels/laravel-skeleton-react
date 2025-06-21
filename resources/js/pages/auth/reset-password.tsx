import { AuthForm } from '@/components/auth-form'
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
import { GuestLayout } from '@/layouts/guest-layout'
import { zodResolver } from '@hookform/resolvers/zod'
import { router } from '@inertiajs/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
})

export default function ResetPassword({
  email,
  token,
}: {
  email: string
  token: string
}) {
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
      email,
      token,
      password: '',
      password_confirmation: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await new Promise<void>((resolve) =>
      router.post(route('password.store'), values, {
        onError: (errors) => {
          setFormServerErrors(form, errors)
        },
        onFinish: () => resolve(),
      })
    )
  }

  return (
    <GuestLayout title={t('resetYourPassword')}>
      <AuthForm
        description={t('resetYourPasswordDescription')}
        title={t('resetYourPassword')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="username"
                      inputMode="email"
                      required
                      type="email"
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
                  <FormLabel>{t('password')}</FormLabel>
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
                  <FormLabel>{t('confirmPassword')}</FormLabel>
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

            <Button
              loading={form.formState.isSubmitting}
              className="w-full"
              type="submit"
            >
              {t('resetPassword')}
            </Button>
          </form>
        </Form>
      </AuthForm>
    </GuestLayout>
  )
}
