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
import { Head, router } from '@inertiajs/react'
import { useLaravelReactI18n } from 'laravel-react-i18n'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  token: z.string(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
})

export default function ResetPassword({ email, token }: { email: string; token: string }) {
  const { t } = useLaravelReactI18n()

  const { setFormServerErrors, passwordConfirmationMessage } = useFormValidation()

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
    <GuestLayout>
      <Head title={t('auth.reset_your_password')} />

      <AuthForm
        description={t('auth.reset_your_password_description')}
        title={t('auth.reset_your_password')}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('general.email')}</FormLabel>
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
                  <FormLabel>{t('general.password')}</FormLabel>
                  <FormControl>
                    <Input autoComplete="new-password" required type="password" {...field} />
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
                  <FormLabel>{t('general.confirm_password')}</FormLabel>
                  <FormControl>
                    <Input autoComplete="new-password" required type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button loading={form.formState.isSubmitting} className="w-full" type="submit">
              {t('auth.reset_password')}
            </Button>
          </form>
        </Form>
      </AuthForm>
    </GuestLayout>
  )
}
